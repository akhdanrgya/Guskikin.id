type AdminDashboardHeroProps = {
  i18n?: {
    language?: string
  }
  user?: {
    email?: null | string
  } | null
}

const copy = {
  en: {
    actions: [
      {
        description: 'Prepare the manuscript, metadata, and publication status.',
        href: '/admin/collections/posts/create',
        label: 'Write Article',
      },
      {
        description: 'Publish the latest official information and activities.',
        href: '/admin/collections/news/create',
        label: 'Write News',
      },
      {
        description: 'Schedule an assembly, preaching tour, or broadcast.',
        href: '/admin/collections/events/create',
        label: 'Add Event',
      },
      {
        description: 'Manage editorial photos, posters, and visual assets.',
        href: '/admin/collections/media/create',
        label: 'Upload Media',
      },
    ],
    description: 'Manage knowledge, events, and guskikin.id publications in one orderly workflow.',
    eyebrow: 'Guskikin Editorial Room',
    identity: 'Signed in as',
    identityFallback: 'Editorial Team',
    motto: 'Trusted information, thoughtful publication.',
    navigation: 'Editorial quick actions',
    title: 'Editorial control room.',
  },
  id: {
    actions: [
      {
        description: 'Susun naskah, metadata, dan status publikasi.',
        href: '/admin/collections/posts/create',
        label: 'Tulis Artikel',
      },
      {
        description: 'Terbitkan informasi dan kegiatan resmi terbaru.',
        href: '/admin/collections/news/create',
        label: 'Tulis Berita',
      },
      {
        description: 'Jadwalkan majelis, safari dakwah, atau siaran.',
        href: '/admin/collections/events/create',
        label: 'Tambah Agenda',
      },
      {
        description: 'Kelola foto, poster, dan aset visual redaksi.',
        href: '/admin/collections/media/create',
        label: 'Unggah Media',
      },
    ],
    description: 'Kelola khazanah, agenda, dan publikasi guskikin.id dalam satu alur kerja yang tertib.',
    eyebrow: 'Ruang Redaksi Guskikin',
    identity: 'Masuk sebagai',
    identityFallback: 'Tim Redaksi',
    motto: 'Sanad informasi, adab publikasi.',
    navigation: 'Aksi cepat redaksi',
    title: 'Ruang kendali redaksi.',
  },
} as const

export default function AdminDashboardHero({ i18n, user }: AdminDashboardHeroProps) {
  const language = i18n?.language === 'en' ? 'en' : 'id'
  const text = copy[language]

  return (
    <section className="guskikin-dashboard-hero" aria-labelledby="dashboard-heading">
      <div className="guskikin-dashboard-hero__header">
        <div className="guskikin-dashboard-hero__copy">
          <span className="guskikin-dashboard-hero__eyebrow">{text.eyebrow}</span>
          <h1 id="dashboard-heading">{text.title}</h1>
          <p>{text.description}</p>
        </div>

        <div className="guskikin-dashboard-hero__identity">
          <span>{text.identity}</span>
          <strong>{user?.email ?? text.identityFallback}</strong>
          <small>{text.motto}</small>
        </div>
      </div>

      <nav className="guskikin-dashboard-actions" aria-label={text.navigation}>
        {text.actions.map((action, index) => (
          <a className="guskikin-dashboard-actions__item" href={action.href} key={action.href}>
            <span className="guskikin-dashboard-actions__index" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="guskikin-dashboard-actions__content">
              <strong>{action.label}</strong>
              <small>{action.description}</small>
            </span>
            <span className="guskikin-dashboard-actions__arrow" aria-hidden="true">→</span>
          </a>
        ))}
      </nav>
    </section>
  )
}
