type AdminDashboardHeroProps = {
  user?: {
    email?: null | string
  } | null
}

const quickActions = [
  {
    description: 'Susun naskah, metadata, dan status publikasi.',
    href: '/admin/collections/posts/create',
    index: '01',
    label: 'Tulis Artikel',
  },
  {
    description: 'Jadwalkan majelis, safari dakwah, atau siaran.',
    href: '/admin/collections/events/create',
    index: '02',
    label: 'Tambah Agenda',
  },
  {
    description: 'Kelola foto, poster, dan aset visual redaksi.',
    href: '/admin/collections/media/create',
    index: '03',
    label: 'Unggah Media',
  },
]

export default function AdminDashboardHero({ user }: AdminDashboardHeroProps) {
  return (
    <section className="guskikin-dashboard-hero" aria-labelledby="dashboard-heading">
      <div className="guskikin-dashboard-hero__header">
        <div className="guskikin-dashboard-hero__copy">
          <span className="guskikin-dashboard-hero__eyebrow">Ruang Redaksi Guskikin</span>
          <h1 id="dashboard-heading">Ruang kendali redaksi.</h1>
          <p>
            Kelola khazanah, agenda, dan publikasi guskikin.id dalam satu alur kerja yang
            tertib.
          </p>
        </div>

        <div className="guskikin-dashboard-hero__identity">
          <span>Masuk sebagai</span>
          <strong>{user?.email ?? 'Tim Redaksi'}</strong>
          <small>Sanad informasi, adab publikasi.</small>
        </div>
      </div>

      <nav className="guskikin-dashboard-actions" aria-label="Aksi cepat redaksi">
        {quickActions.map((action) => (
          <a className="guskikin-dashboard-actions__item" href={action.href} key={action.href}>
            <span className="guskikin-dashboard-actions__index" aria-hidden="true">
              {action.index}
            </span>
            <span className="guskikin-dashboard-actions__content">
              <strong>{action.label}</strong>
              <small>{action.description}</small>
            </span>
            <span className="guskikin-dashboard-actions__arrow" aria-hidden="true">
              →
            </span>
          </a>
        ))}
      </nav>
    </section>
  )
}
