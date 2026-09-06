import config from '@payload-config'
import { getPayload } from 'payload'

const paragraph = (text: string) => ({
  children: [
    {
      detail: 0,
      format: 0,
      mode: 'normal',
      style: '',
      text,
      type: 'text',
      version: 1,
    },
  ],
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  textFormat: 0,
  textStyle: '',
  type: 'paragraph',
  version: 1,
})

const richText = (...paragraphs: string[]) => ({
  root: {
    children: paragraphs.map(paragraph),
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    type: 'root',
    version: 1,
  },
})

const newsItems = [
  {
    content: [
      'Kanal Berita guskikin.id hadir sebagai ruang khusus untuk menyampaikan kabar resmi, kegiatan, dan informasi terbaru kepada masyarakat.',
      'Pemisahan kanal berita dari artikel membantu pembaca membedakan informasi aktual dengan tulisan opini, kajian, dan refleksi yang membutuhkan pembacaan lebih mendalam.',
    ],
    excerpt: 'Kanal khusus untuk kabar resmi, kegiatan, dan informasi terbaru kini tersedia di guskikin.id.',
    featured: true,
    publishedAt: '2026-09-06T08:00:00.000Z',
    slug: 'selamat-datang-di-kanal-berita-guskikin-id',
    title: 'Selamat Datang di Kanal Berita guskikin.id',
  },
  {
    content: [
      'Tim redaksi membuka ruang informasi untuk mendokumentasikan kegiatan pesantren, silaturahmi, dan agenda keumatan secara tertib.',
      'Informasi yang diterbitkan akan dilengkapi konteks, waktu, dan sumber yang jelas agar mudah digunakan oleh pembaca serta jejaring media.',
    ],
    excerpt: 'Ruang informasi kegiatan pesantren disiapkan agar dokumentasi dan kabar resmi lebih mudah ditemukan.',
    featured: false,
    publishedAt: '2026-09-05T08:00:00.000Z',
    slug: 'ruang-informasi-kegiatan-pesantren',
    title: 'Redaksi Membuka Ruang Informasi Kegiatan Pesantren',
  },
  {
    content: [
      'Agenda, laporan kegiatan, dan dokumentasi terbaru akan diperbarui secara berkala melalui kanal Berita.',
      'Pembaca dapat menggunakan menu Berita untuk mengikuti perkembangan terbaru, sedangkan menu Artikel memuat opini, kajian, dan refleksi kebangsaan.',
    ],
    excerpt: 'Agenda dan dokumentasi terbaru akan diperbarui berkala melalui kanal Berita.',
    featured: false,
    publishedAt: '2026-09-04T08:00:00.000Z',
    slug: 'pembaruan-agenda-dan-dokumentasi-berkala',
    title: 'Pembaruan Agenda dan Dokumentasi Akan Hadir Berkala',
  },
] as const

const payload = await getPayload({ config })

try {
  const existingNews = await payload.count({ collection: 'news' })

  if (existingNews.totalDocs > 0) {
    console.log(`Seed berita dilewati: database sudah memiliki ${existingNews.totalDocs} berita.`)
  } else {
    const existingCategory = await payload.find({
      collection: 'categories',
      limit: 1,
      pagination: false,
      where: { slug: { equals: 'kabar-pesantren' } },
    })
    const category =
      existingCategory.docs[0] ??
      (await payload.create({
        collection: 'categories',
        data: {
          description: 'Kabar resmi, kegiatan, dan informasi terbaru dari lingkungan pesantren.',
          slug: 'kabar-pesantren',
          title: 'Kabar Pesantren',
        },
      }))

    const existingAuthors = await payload.find({
      collection: 'authors',
      limit: 1,
      pagination: false,
      where: { slug: { equals: 'tim-redaksi-guskikin' } },
    })
    const author =
      existingAuthors.docs[0] ??
      (await payload.create({
        collection: 'authors',
        data: {
          bio: 'Tim editorial guskikin.id yang mengelola publikasi dan informasi resmi.',
          name: 'Tim Redaksi Guskikin',
          slug: 'tim-redaksi-guskikin',
        },
      }))

    for (const item of newsItems) {
      await payload.create({
        collection: 'news',
        data: {
          _status: 'published',
          authors: [author.id],
          category: category.id,
          content: richText(...item.content),
          excerpt: item.excerpt,
          isFeatured: item.featured,
          publishedAt: item.publishedAt,
          readingTime: 3,
          slug: item.slug,
          title: item.title,
        },
      })
    }

    console.log(`Seed berita selesai: ${newsItems.length} berita dibuat.`)
  }
} finally {
  await payload.destroy()
}
