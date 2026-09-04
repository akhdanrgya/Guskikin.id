import config from '@payload-config'
import { getPayload } from 'payload'

const notice = '[Konten contoh—verifikasi metadata sebelum publikasi]'

const records = [
  {
    description: `${notice} Dialog mengenai khittah, transformasi digital santri, dan penguatan kemandirian pesantren.`,
    duration: '38:45',
    episode: 24,
    host: 'Tim Media Guskikin (contoh)',
    isFeatured: true,
    publishedAt: '2026-09-01T02:00:00.000Z',
    series: 'Podcast Dialog Intelektual',
    slug: 'meneguhkan-khittah-dan-kemandirian-pesantren',
    speaker: 'Narasumber editorial (contoh)',
    title: 'Meneguhkan Khittah & Kemandirian Pesantren',
    type: 'podcast' as const,
  },
  {
    description: `${notice} Percakapan santri tentang fiqih kontemporer, etika bermedia, dan persoalan sosial sehari-hari.`,
    duration: '42:10',
    host: 'Studio Santri (contoh)',
    publishedAt: '2026-08-27T02:00:00.000Z',
    series: 'Santri Menyapa',
    slug: 'dialektika-fiqih-kontemporer-dan-etika-bermedia',
    title: 'Dialektika Fiqih Kontemporer & Etika Bermedia Sosial',
    type: 'podcast' as const,
  },
  {
    description: `${notice} Dokumentasi halaqah tentang rekonstruksi fiqih sosial dan relevansinya bagi kehidupan kebangsaan.`,
    duration: '25:18',
    publishedAt: '2026-08-22T02:00:00.000Z',
    series: 'Halaqah Ilmiah',
    slug: 'rekonstruksi-fiqih-sosial-di-era-kecerdasan-buatan',
    speaker: 'Forum akademik (contoh)',
    title: 'Rekonstruksi Fiqih Sosial di Era Kecerdasan Buatan',
    type: 'video' as const,
  },
  {
    description: `${notice} Tayangan tausiyah mengenai peran pesantren dalam menjaga nilai, persaudaraan, dan kehidupan bersama.`,
    duration: '31:40',
    publishedAt: '2026-08-18T02:00:00.000Z',
    series: 'Khutbah & Pidato',
    slug: 'pesantren-benteng-moral-dan-penjaga-kebangsaan',
    speaker: 'Redaksi khazanah (contoh)',
    title: 'Pesantren, Benteng Moral dan Penjaga Kebangsaan',
    type: 'video' as const,
  },
  {
    credit: 'Tim dokumentasi (contoh)',
    description: `${notice} Album kegiatan sorogan dan bandongan bersama santri di lingkungan pesantren.`,
    location: 'Jombang',
    publishedAt: '2026-08-14T02:00:00.000Z',
    resolution: 'Asset foto belum diunggah',
    slug: 'sorogan-dan-bandongan-kitab-ramadhan',
    title: 'Sorogan & Bandongan Kitab Ramadhan',
    type: 'photo-gallery' as const,
  },
  {
    credit: 'Tim dokumentasi (contoh)',
    description: `${notice} Album musyawarah kerja dan konsolidasi program keumatan.`,
    location: 'Surabaya',
    publishedAt: '2026-08-09T02:00:00.000Z',
    resolution: 'Asset foto belum diunggah',
    slug: 'musyawarah-kerja-dan-konsolidasi-program',
    title: 'Musyawarah Kerja & Konsolidasi Program Keumatan',
    type: 'photo-gallery' as const,
  },
  {
    credit: 'Tim dokumentasi (contoh)',
    description: `${notice} Album silaturahmi dengan pengasuh, santri, dan masyarakat.`,
    location: 'Situbondo',
    publishedAt: '2026-08-04T02:00:00.000Z',
    resolution: 'Asset foto belum diunggah',
    slug: 'silaturahmi-khidmat-kasepuhan',
    title: 'Silaturahmi Khidmat Kasepuhan',
    type: 'photo-gallery' as const,
  },
  {
    description: `${notice} Rekaman audio refleksi pagi untuk santri dan penggerak pendidikan pesantren.`,
    duration: '18:24',
    publishedAt: '2026-07-29T02:00:00.000Z',
    series: 'Kalam Fajar',
    slug: 'untaian-doa-fajar-dan-nasihat-santri',
    speaker: 'Narasumber editorial (contoh)',
    title: 'Untaian Doa Fajar & Nasihat Santri',
    type: 'audio' as const,
  },
  {
    description: `${notice} Rekaman kajian mengenai istiqamah, ketenangan hati, dan kebiasaan berbuat baik.`,
    duration: '22:15',
    publishedAt: '2026-07-24T02:00:00.000Z',
    series: 'Khutbah Jumat',
    slug: 'hakikat-istiqamah-dan-kebeningan-hati',
    title: 'Hakikat Istiqamah & Kebeningan Hati',
    type: 'audio' as const,
  },
  {
    description: `${notice} Kajian ringkas tentang hubungan makrifat hati, ilmu, dan adab pencari ilmu.`,
    duration: '45:10',
    publishedAt: '2026-07-19T02:00:00.000Z',
    series: 'Kajian Rutin',
    slug: 'makrifat-hati-dan-adab-pencari-ilmu',
    title: 'Makrifat Hati & Adab Pencari Ilmu',
    type: 'audio' as const,
  },
]

const payload = await getPayload({ config })
let created = 0
for (const record of records) {
  const existing = await payload.find({ collection: 'media-contents', limit: 1, pagination: false, where: { slug: { equals: record.slug } } })
  if (existing.docs.length) continue
  await payload.create({ collection: 'media-contents', data: record })
  created += 1
}
console.log(`Seed media selesai: ${created} arsip baru dibuat, ${records.length - created} sudah tersedia.`)
await payload.destroy()
