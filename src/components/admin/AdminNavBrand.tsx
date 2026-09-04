import Link from 'next/link'

export default function AdminNavBrand() {
  return (
    <Link className="guskikin-admin-brand" href="/admin" aria-label="Dashboard guskikin.id">
      <span className="guskikin-admin-brand__mark" aria-hidden="true">
        GK
      </span>
      <span className="guskikin-admin-brand__copy">
        <strong>guskikin.id</strong>
        <small>Admin Editorial</small>
      </span>
    </Link>
  )
}
