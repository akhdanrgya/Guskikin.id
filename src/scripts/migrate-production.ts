import type { MigrateUpArgs } from '@payloadcms/db-postgres'
import config from '@payload-config'
import { getPayload } from 'payload'

import { migrations } from '../migrations'

type QueryResult<Row extends Record<string, unknown> = Record<string, unknown>> = {
  rowCount: null | number
  rows: Row[]
}

type DatabaseClient = {
  query: <Row extends Record<string, unknown> = Record<string, unknown>>(
    statement: string,
    values?: unknown[],
  ) => Promise<QueryResult<Row>>
  release: () => void
}

if (process.env.VERCEL_ENV !== 'production') {
  console.log('Skipping production migrations outside a Vercel production build.')
  process.exit(0)
}

const payload = await getPayload({ config })
const adapter = payload.db as typeof payload.db & {
  drizzle: MigrateUpArgs['db']
  pool: { connect: () => Promise<DatabaseClient> }
}
const client = await adapter.pool.connect()

try {
  // Prevent two production builds from migrating the same database concurrently.
  await client.query("select pg_advisory_lock(hashtext('guskikin_payload_migrations'))")

  for (const migration of migrations) {
    const existing = await client.query<{ id: number }>(
      'select id from payload_migrations where name = $1 limit 1',
      [migration.name],
    )

    if (existing.rowCount) {
      console.log(`Migration ${migration.name} already applied.`)
      continue
    }

    console.log(`Applying migration ${migration.name}...`)
    await migration.up({ db: adapter.drizzle } as MigrateUpArgs)

    await client.query('begin')
    try {
      await client.query(
        `insert into payload_migrations (name, batch, updated_at, created_at)
         select $1::varchar,
           coalesce((select max(batch) from payload_migrations where batch > 0), 0) + 1,
           now(),
           now()
         where not exists (select 1 from payload_migrations where name = $1)`,
        [migration.name],
      )
      await client.query('commit')
    } catch (error) {
      await client.query('rollback')
      throw error
    }

    console.log(`Migration ${migration.name} applied.`)
  }

  // The old development marker makes Payload request interactive confirmation.
  // It is safe to remove only after every production migration is recorded.
  const pending = await Promise.all(
    migrations.map((migration) =>
      client.query<{ id: number }>('select id from payload_migrations where name = $1 limit 1', [migration.name]),
    ),
  )
  if (pending.every((result) => Boolean(result.rowCount))) {
    await client.query("delete from payload_migrations where name = 'dev' and batch = -1")
  }
} finally {
  await client.query("select pg_advisory_unlock(hashtext('guskikin_payload_migrations'))")
  client.release()
}

process.exit(0)
