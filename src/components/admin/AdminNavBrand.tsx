import Link from 'next/link'

type AdminNavBrandProps = {
  i18n?: {
    language?: string
  }
}

export default function AdminNavBrand({ i18n }: AdminNavBrandProps) {
  const english = i18n?.language === 'en'

  return (
    <div className="guskikin-admin-nav-tools">
      <Link className="guskikin-admin-brand" href="/admin" aria-label="Dashboard guskikin.id">
        <span className="guskikin-admin-brand__mark" aria-hidden="true">
          GK
        </span>
        <span className="guskikin-admin-brand__copy">
          <strong>guskikin.id</strong>
          <small>{english ? 'Editorial Admin' : 'Admin Editorial'}</small>
        </span>
      </Link>

      <div className="guskikin-admin-create-actions" aria-label={english ? 'Create content' : 'Buat konten'}>
        <Link href="/admin/collections/posts/create">
          <span aria-hidden="true">+</span> {english ? 'Article' : 'Artikel'}
        </Link>
        <Link href="/admin/collections/news/create">
          <span aria-hidden="true">+</span> {english ? 'News' : 'Berita'}
        </Link>
      </div>
    </div>
  )
}
