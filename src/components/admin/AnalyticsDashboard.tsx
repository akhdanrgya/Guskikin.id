'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

type AnalyticsData = {
  activeVisitors: number
  generatedAt: string
  origins: Array<{ city: string | null; country: string | null; visitors: number }>
  popularPages: Array<{ pathname: string; views: number }>
  todayViews: number
  totalVisitors: number
  trend: Array<{ day: string; visitors: number; views: number }>
}

const numberFormatter = new Intl.NumberFormat('id-ID')
const dayFormatter = new Intl.DateTimeFormat('id-ID', { weekday: 'short' })

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [error, setError] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true)

    try {
      const response = await fetch('/api/analytics/summary', { cache: 'no-store', credentials: 'same-origin' })
      if (!response.ok) throw new Error('Gagal mengambil analitik')
      setData((await response.json()) as AnalyticsData)
      setError(false)
    } catch {
      setError(true)
    } finally {
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    const initialLoad = window.setTimeout(() => void load(), 0)
    const timer = window.setInterval(() => void load(), 60_000)
    return () => {
      window.clearTimeout(initialLoad)
      window.clearInterval(timer)
    }
  }, [load])

  const maxTrend = useMemo(() => Math.max(1, ...(data?.trend.map((item) => item.views) ?? [1])), [data])

  return (
    <section className="guskikin-analytics" aria-labelledby="analytics-heading">
      <header className="guskikin-analytics__header">
        <div>
          <span className="guskikin-analytics__eyebrow">Analitik pengunjung</span>
          <h2 id="analytics-heading">Pembaca guskikin.id</h2>
          <p>Data anonim, diperbarui otomatis setiap menit. Aktif berarti terlihat dalam 5 menit terakhir.</p>
        </div>
        <button disabled={refreshing} onClick={() => void load(true)} type="button">
          {refreshing ? 'Memuat…' : 'Perbarui'}
        </button>
      </header>

      {error && !data ? (
        <div className="guskikin-analytics__notice">Data analitik belum tersedia. Jalankan migration terbaru terlebih dahulu.</div>
      ) : (
        <>
          <div className="guskikin-analytics__stats">
            <article><span>Total pengunjung unik</span><strong>{data ? numberFormatter.format(data.totalVisitors) : '—'}</strong><small>Sejak pencatatan dimulai</small></article>
            <article><span>Sedang aktif</span><strong className="is-live">{data ? numberFormatter.format(data.activeVisitors) : '—'}</strong><small><i aria-hidden="true" /> 5 menit terakhir</small></article>
            <article><span>Kunjungan hari ini</span><strong>{data ? numberFormatter.format(data.todayViews) : '—'}</strong><small>Waktu Indonesia Barat</small></article>
          </div>

          <div className="guskikin-analytics__grid">
            <article className="guskikin-analytics__panel guskikin-analytics__trend">
              <div className="guskikin-analytics__panel-heading"><h3>Tren 7 hari</h3><span>Page view</span></div>
              <div className="guskikin-analytics__bars">
                {(data?.trend ?? []).map((item) => (
                  <div className="guskikin-analytics__bar-item" key={item.day} title={`${item.views} kunjungan · ${item.visitors} pengunjung`}>
                    <span>{numberFormatter.format(item.views)}</span>
                    <div><i style={{ height: `${Math.max(5, (item.views / maxTrend) * 100)}%` }} /></div>
                    <small>{dayFormatter.format(new Date(`${item.day}T12:00:00+07:00`))}</small>
                  </div>
                ))}
                {!data && <div className="guskikin-analytics__empty">Memuat tren…</div>}
              </div>
            </article>

            <article className="guskikin-analytics__panel">
              <div className="guskikin-analytics__panel-heading"><h3>Asal pengunjung</h3><span>Lokasi terakhir</span></div>
              <ol className="guskikin-analytics__list">
                {(data?.origins ?? []).map((item, index) => (
                  <li key={`${item.country}-${item.city}-${index}`}>
                    <span><b>{item.city || 'Kota tidak diketahui'}</b><small>{item.country || 'Lokasi tidak diketahui'}</small></span>
                    <strong>{numberFormatter.format(item.visitors)}</strong>
                  </li>
                ))}
                {data?.origins.length === 0 && <li className="guskikin-analytics__empty">Belum ada data lokasi.</li>}
              </ol>
            </article>

            <article className="guskikin-analytics__panel">
              <div className="guskikin-analytics__panel-heading"><h3>Halaman populer</h3><span>30 hari terakhir</span></div>
              <ol className="guskikin-analytics__list">
                {(data?.popularPages ?? []).map((item) => (
                  <li key={item.pathname}>
                    <span><b>{item.pathname === '/' ? 'Beranda' : item.pathname}</b><small>Page view</small></span>
                    <strong>{numberFormatter.format(item.views)}</strong>
                  </li>
                ))}
                {data?.popularPages.length === 0 && <li className="guskikin-analytics__empty">Belum ada kunjungan tercatat.</li>}
              </ol>
            </article>
          </div>
        </>
      )}
    </section>
  )
}
