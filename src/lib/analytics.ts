import { randomUUID } from 'node:crypto'

import { sql } from '@payloadcms/db-postgres'
import type { Endpoint, PayloadRequest } from 'payload'

const VISITOR_COOKIE = 'gk_vid'
const SESSION_COOKIE = 'gk_sid'
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

type QueryResult<Row> = { rows: Row[] }

function rowsOf<Row>(result: unknown): Row[] {
  if (result && typeof result === 'object' && 'rows' in result) {
    return (result as QueryResult<Row>).rows
  }

  return []
}

function parseCookies(header: string | null): Record<string, string> {
  if (!header) return {}

  return Object.fromEntries(
    header.split(';').flatMap((part) => {
      const separator = part.indexOf('=')
      if (separator < 1) return []
      return [[part.slice(0, separator).trim(), decodeURIComponent(part.slice(separator + 1).trim())]]
    }),
  )
}

function safeHeader(value: string | null, maxLength: number): string | null {
  if (!value) return null

  try {
    return decodeURIComponent(value).replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, maxLength) || null
  } catch {
    return value.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, maxLength) || null
  }
}

function normalizePathname(value: unknown): string | null {
  if (typeof value !== 'string' || !value.startsWith('/')) return null

  try {
    const pathname = new URL(value, 'https://guskikin.id').pathname
    if (pathname.startsWith('/admin') || pathname.startsWith('/api')) return null
    return pathname.replace(/\/{2,}/g, '/').slice(0, 300)
  } catch {
    return null
  }
}

function isSameSiteRequest(req: PayloadRequest): boolean {
  const fetchSite = req.headers.get('sec-fetch-site')
  return !fetchSite || fetchSite === 'same-origin' || fetchSite === 'same-site' || fetchSite === 'none'
}

function cookieHeader(name: string, value: string, persistent: boolean, secure: boolean): string {
  return [
    `${name}=${encodeURIComponent(value)}`,
    'Path=/',
    'SameSite=Lax',
    secure ? 'Secure' : '',
    persistent ? 'Max-Age=31536000' : '',
  ]
    .filter(Boolean)
    .join('; ')
}

async function trackVisit(req: PayloadRequest): Promise<Response> {
  if (!isSameSiteRequest(req)) {
    return Response.json({ error: 'Permintaan ditolak.' }, { status: 403 })
  }

  let body: { event?: unknown; pathname?: unknown }
  try {
    body = (await req.json?.()) as typeof body
  } catch {
    return Response.json({ error: 'Data tidak valid.' }, { status: 400 })
  }

  const pathname = normalizePathname(body?.pathname)
  const event = body?.event === 'pageview' ? 'pageview' : body?.event === 'heartbeat' ? 'heartbeat' : null
  if (!pathname || !event) {
    return Response.json({ error: 'Data tidak valid.' }, { status: 400 })
  }

  const cookies = parseCookies(req.headers.get('cookie'))
  const visitorID = UUID_PATTERN.test(cookies[VISITOR_COOKIE] ?? '') ? cookies[VISITOR_COOKIE] : randomUUID()
  const sessionID = UUID_PATTERN.test(cookies[SESSION_COOKIE] ?? '') ? cookies[SESSION_COOKIE] : randomUUID()
  const country = safeHeader(req.headers.get('x-vercel-ip-country'), 2)?.toUpperCase() ?? null
  const region = safeHeader(req.headers.get('x-vercel-ip-country-region'), 80)
  const city = safeHeader(req.headers.get('x-vercel-ip-city'), 120)
  const database = req.payload.db.drizzle

  await database.transaction(async (tx) => {
    await tx.execute(sql`
      INSERT INTO "gk_analytics_visitors" ("visitor_id", "first_seen", "last_seen", "country", "region", "city")
      VALUES (${visitorID}::uuid, NOW(), NOW(), ${country}, ${region}, ${city})
      ON CONFLICT ("visitor_id") DO UPDATE SET
        "last_seen" = NOW(),
        "country" = COALESCE(EXCLUDED."country", "gk_analytics_visitors"."country"),
        "region" = COALESCE(EXCLUDED."region", "gk_analytics_visitors"."region"),
        "city" = COALESCE(EXCLUDED."city", "gk_analytics_visitors"."city")
    `)

    await tx.execute(sql`
      INSERT INTO "gk_analytics_sessions" ("session_id", "visitor_id", "started_at", "last_seen", "current_path")
      VALUES (${sessionID}::uuid, ${visitorID}::uuid, NOW(), NOW(), ${pathname})
      ON CONFLICT ("session_id") DO UPDATE SET
        "last_seen" = NOW(),
        "current_path" = EXCLUDED."current_path"
    `)

    if (event === 'pageview') {
      await tx.execute(sql`
        INSERT INTO "gk_analytics_page_views" ("visitor_id", "session_id", "pathname", "viewed_at")
        VALUES (${visitorID}::uuid, ${sessionID}::uuid, ${pathname}, NOW())
      `)
    }
  })

  const forwardedProto = req.headers.get('x-forwarded-proto')
  const secure = forwardedProto === 'https' || process.env.NODE_ENV === 'production'
  const headers = new Headers({ 'Cache-Control': 'no-store' })
  if (cookies[VISITOR_COOKIE] !== visitorID) {
    headers.append('Set-Cookie', cookieHeader(VISITOR_COOKIE, visitorID, true, secure))
  }
  if (cookies[SESSION_COOKIE] !== sessionID) {
    headers.append('Set-Cookie', cookieHeader(SESSION_COOKIE, sessionID, false, secure))
  }

  return Response.json({ ok: true }, { headers })
}

type CountRow = { value: number | string }
type OriginRow = { city: string | null; country: string | null; visitors: number | string }
type PageRow = { pathname: string; views: number | string }
type TrendRow = { day: string; visitors: number | string; views: number | string }

async function analyticsSummary(req: PayloadRequest): Promise<Response> {
  if (!req.user) {
    return Response.json({ error: 'Tidak terautentikasi.' }, { status: 401 })
  }

  const database = req.payload.db.drizzle
  const [totalResult, activeResult, todayResult, originsResult, pagesResult, trendResult] = await Promise.all([
    database.execute(sql`SELECT COUNT(*)::int AS "value" FROM "gk_analytics_visitors"`),
    database.execute(sql`
      SELECT COUNT(DISTINCT "visitor_id")::int AS "value"
      FROM "gk_analytics_sessions"
      WHERE "last_seen" >= NOW() - INTERVAL '5 minutes'
    `),
    database.execute(sql`
      SELECT COUNT(*)::int AS "value"
      FROM "gk_analytics_page_views"
      WHERE "viewed_at" >= DATE_TRUNC('day', NOW() AT TIME ZONE 'Asia/Jakarta') AT TIME ZONE 'Asia/Jakarta'
    `),
    database.execute(sql`
      SELECT "country", "city", COUNT(*)::int AS "visitors"
      FROM "gk_analytics_visitors"
      GROUP BY "country", "city"
      ORDER BY "visitors" DESC, "country" ASC, "city" ASC
      LIMIT 8
    `),
    database.execute(sql`
      SELECT "pathname", COUNT(*)::int AS "views"
      FROM "gk_analytics_page_views"
      WHERE "viewed_at" >= NOW() - INTERVAL '30 days'
      GROUP BY "pathname"
      ORDER BY "views" DESC, "pathname" ASC
      LIMIT 8
    `),
    database.execute(sql`
      WITH days AS (
        SELECT GENERATE_SERIES(
          (NOW() AT TIME ZONE 'Asia/Jakarta')::date - 6,
          (NOW() AT TIME ZONE 'Asia/Jakarta')::date,
          INTERVAL '1 day'
        )::date AS "day"
      ), daily AS (
        SELECT
          ("viewed_at" AT TIME ZONE 'Asia/Jakarta')::date AS "day",
          COUNT(*)::int AS "views",
          COUNT(DISTINCT "visitor_id")::int AS "visitors"
        FROM "gk_analytics_page_views"
        WHERE "viewed_at" >= NOW() - INTERVAL '8 days'
        GROUP BY 1
      )
      SELECT days."day"::text, COALESCE(daily."views", 0)::int AS "views", COALESCE(daily."visitors", 0)::int AS "visitors"
      FROM days
      LEFT JOIN daily USING ("day")
      ORDER BY days."day" ASC
    `),
  ])

  const count = (result: unknown) => Number(rowsOf<CountRow>(result)[0]?.value ?? 0)

  return Response.json(
    {
      activeVisitors: count(activeResult),
      generatedAt: new Date().toISOString(),
      origins: rowsOf<OriginRow>(originsResult).map((row) => ({
        city: row.city,
        country: row.country,
        visitors: Number(row.visitors),
      })),
      popularPages: rowsOf<PageRow>(pagesResult).map((row) => ({ pathname: row.pathname, views: Number(row.views) })),
      todayViews: count(todayResult),
      totalVisitors: count(totalResult),
      trend: rowsOf<TrendRow>(trendResult).map((row) => ({
        day: row.day,
        visitors: Number(row.visitors),
        views: Number(row.views),
      })),
    },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}

export const analyticsEndpoints: Endpoint[] = [
  { handler: trackVisit, method: 'post', path: '/analytics/visit' },
  { handler: analyticsSummary, method: 'get', path: '/analytics/summary' },
]
