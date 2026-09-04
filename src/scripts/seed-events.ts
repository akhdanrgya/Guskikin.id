import config from '@payload-config'
import { getPayload } from 'payload'

const sampleNotice = '[Data contoh—verifikasi jadwal]'

const events = [
  {
    address: 'Alamat contoh—perlu konfirmasi sebelum publikasi',
    audience: 'Terbuka untuk umum',
    city: 'Jombang',
    description: `${sampleNotice} Silaturahmi dan pengajian bersama para pengasuh pesantren serta masyarakat.`,
    endDate: '2026-09-12T05:00:00.000Z',
    eventType: 'silaturahmi' as const,
    isFeatured: true,
    organizer: 'Panitia majelis (contoh)',
    slug: 'silaturahmi-pengasuh-pesantren-dan-halaqah-sanad',
    startDate: '2026-09-12T01:30:00.000Z',
    status: 'upcoming' as const,
    title: 'Silaturahmi Pengasuh Pesantren & Halaqah Sanad',
    venue: 'Aula Pesantren (contoh)',
  },
  {
    address: 'Alamat contoh—perlu konfirmasi sebelum publikasi',
    audience: 'Akademisi, santri, dan undangan',
    city: 'Surabaya',
    description: `${sampleNotice} Forum akademik untuk mendiskusikan fiqih sosial dan penguatan kemandirian pesantren.`,
    endDate: '2026-09-18T05:00:00.000Z',
    eventType: 'halaqah' as const,
    organizer: 'Forum kajian (contoh)',
    slug: 'halaqah-fiqih-peradaban-dan-kemandirian-pesantren',
    startDate: '2026-09-18T02:00:00.000Z',
    status: 'upcoming' as const,
    title: 'Halaqah Fiqih Peradaban & Kemandirian Pesantren',
    venue: 'Auditorium Kampus (contoh)',
  },
  {
    address: 'Alamat contoh—perlu konfirmasi sebelum publikasi',
    audience: 'Santri dan masyarakat',
    city: 'Jombang',
    description: `${sampleNotice} Pengajian kitab rutin yang membahas adab, kebeningan hati, dan tanggung jawab sosial.`,
    eventType: 'pengajian-rutin' as const,
    organizer: 'Majelis pengajian (contoh)',
    scheduleLabel: 'Setiap Ahad Pagi • 06:00 WIB',
    slug: 'pengajian-rutin-kitab-ihya-ulumiddin',
    startDate: '2026-09-20T23:00:00.000Z',
    status: 'upcoming' as const,
    title: 'Pengajian Rutin Kitab Ihya’ Ulumiddin',
    venue: 'Masjid Pesantren (contoh)',
  },
  {
    address: 'Alamat contoh—perlu konfirmasi sebelum publikasi',
    audience: 'Terbuka untuk umum',
    city: 'Tuban',
    description: `${sampleNotice} Tabligh akbar dan doa bersama untuk mempererat persaudaraan serta kepedulian sosial.`,
    endDate: '2026-10-03T15:00:00.000Z',
    eventType: 'tabligh-akbar' as const,
    organizer: 'Panitia daerah (contoh)',
    slug: 'tabligh-akbar-dan-doa-bersama',
    startDate: '2026-10-03T12:30:00.000Z',
    status: 'upcoming' as const,
    title: 'Tabligh Akbar & Doa Bersama untuk Keselamatan Bangsa',
    venue: 'Alun-alun Kabupaten (contoh)',
  },
  {
    address: 'Alamat contoh—perlu konfirmasi sebelum publikasi',
    audience: 'Santri dan alumni',
    city: 'Kediri',
    description: `${sampleNotice} Kajian malam dan diskusi adab penuntut ilmu bersama santri serta alumni.`,
    eventType: 'pengajian-rutin' as const,
    organizer: 'Ikatan alumni (contoh)',
    scheduleLabel: 'Malam Jumat Kliwon • 19:30 WIB',
    slug: 'halaqah-fathul-qarib-dan-risalah-adabul-alim',
    startDate: '2026-10-08T12:30:00.000Z',
    status: 'upcoming' as const,
    title: 'Halaqah Fathul Qarib & Risalah Adabul ‘Alim',
    venue: 'Pendopo Majelis (contoh)',
  },
  {
    address: 'Alamat contoh—arsip pratinjau',
    audience: 'Warga pesantren',
    city: 'Banyuwangi',
    description: `${sampleNotice} Catatan perjalanan dakwah dan silaturahmi ke lingkungan pesantren.`,
    eventType: 'silaturahmi' as const,
    organizer: 'Tim safari (contoh)',
    slug: 'catatan-perjalanan-dakwah-di-banyuwangi',
    startDate: '2026-08-24T02:00:00.000Z',
    status: 'completed' as const,
    title: 'Catatan Perjalanan Dakwah di Banyuwangi',
    venue: 'Kompleks Pesantren (contoh)',
  },
  {
    address: 'Alamat contoh—arsip pratinjau',
    audience: 'Akademisi dan mahasiswa',
    city: 'Jakarta',
    description: `${sampleNotice} Halaqah kebangsaan mengenai adab, moderasi, dan kemandirian.`,
    eventType: 'halaqah' as const,
    organizer: 'Forum akademik (contoh)',
    slug: 'halaqah-kebangsaan-di-jakarta',
    startDate: '2026-08-17T02:00:00.000Z',
    status: 'completed' as const,
    title: 'Halaqah Kebangsaan di Jakarta',
    venue: 'Ruang pertemuan (contoh)',
  },
  {
    address: 'Alamat contoh—arsip pratinjau',
    audience: 'Pengasuh dan santri',
    city: 'Pamekasan',
    description: `${sampleNotice} Silaturahmi lintas pesantren untuk memperkuat ukhuwah dan pertukaran pengetahuan.`,
    eventType: 'silaturahmi' as const,
    organizer: 'Forum pesantren (contoh)',
    slug: 'safari-silaturahmi-lintas-pesantren-madura',
    startDate: '2026-08-10T02:00:00.000Z',
    status: 'completed' as const,
    title: 'Safari Silaturahmi Lintas Pesantren Madura',
    venue: 'Pondok pesantren (contoh)',
  },
]

const payload = await getPayload({ config })
let created = 0

for (const event of events) {
  const existing = await payload.find({
    collection: 'events',
    limit: 1,
    pagination: false,
    where: { slug: { equals: event.slug } },
  })
  if (existing.docs.length) continue

  await payload.create({ collection: 'events', data: event })
  created += 1
}

console.log(`Seed event selesai: ${created} agenda baru dibuat, ${events.length - created} sudah tersedia.`)
await payload.destroy()
