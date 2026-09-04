import config from '@payload-config'
import { getPayload } from 'payload'

const topics = [
  ['Adab Santri & Keilmuan', 'adab-santri-keilmuan', 'Adab belajar, hubungan guru dan murid, serta tanggung jawab keilmuan.'],
  ['Tasawuf & Hati', 'tasawuf-hati', 'Kebeningan hati, keikhlasan, dan keteguhan dalam pengabdian.'],
  ['Tausiyah Kebangsaan', 'tausiyah-kebangsaan', 'Pesan persaudaraan, kebangsaan, dan tanggung jawab sosial.'],
  ['Kemandirian & Muamalah', 'kemandirian-muamalah', 'Etika bekerja, amanah ekonomi, dan kemandirian umat.'],
  ['Keluarga & Akhlak', 'keluarga-akhlak', 'Akhlak keluarga, kasih sayang, dan pendidikan keseharian.'],
] as const

const records = [
  {
    context: 'Ilmu yang Menjadi Akhlak',
    date: '2026-09-01T02:00:00.000Z',
    quote: 'Ilmu tidak cukup tinggal di dalam ingatan; ia perlu tumbuh menjadi adab, ketenangan, dan manfaat bagi sesama.',
    slug: 'ilmu-yang-menjadi-akhlak',
    topic: 'adab-santri-keilmuan',
  },
  {
    context: 'Kunci Ketenangan Batin',
    date: '2026-08-27T02:00:00.000Z',
    quote: 'Ketenangan lahir ketika ikhtiar dilakukan dengan sungguh-sungguh dan hasilnya diserahkan tanpa kehilangan rasa syukur.',
    slug: 'kunci-ketenangan-batin',
    topic: 'tasawuf-hati',
  },
  {
    context: 'Sanad Keilmuan & Berkah Guru',
    date: '2026-08-23T02:00:00.000Z',
    quote: 'Belajar kepada guru mengajarkan bahwa kecerdasan memerlukan tuntunan, kesabaran, dan kerendahan hati.',
    slug: 'sanad-keilmuan-dan-berkah-guru',
    topic: 'adab-santri-keilmuan',
  },
  {
    context: 'Ukhuwah Wathaniyah & Rawat NKRI',
    date: '2026-08-19T02:00:00.000Z',
    quote: 'Mencintai tanah air diwujudkan dengan menjaga kerukunan, menunaikan tanggung jawab, dan menghadirkan manfaat bagi warga.',
    slug: 'ukhuwah-wathaniyah-dan-rawat-nkri',
    topic: 'tausiyah-kebangsaan',
  },
  {
    context: 'Kemandirian Ekonomi & Etika Muamalah',
    date: '2026-08-15T02:00:00.000Z',
    quote: 'Kemandirian perlu dibangun di atas amanah; keberhasilan tidak hanya diukur dari hasil, tetapi juga dari cara mencapainya.',
    slug: 'kemandirian-ekonomi-dan-etika-muamalah',
    topic: 'kemandirian-muamalah',
  },
  {
    context: 'Keikhlasan dalam Pengabdian Sosial',
    date: '2026-08-11T02:00:00.000Z',
    quote: 'Pengabdian yang ikhlas tidak selalu terlihat besar, tetapi ketekunannya mampu menguatkan banyak orang.',
    slug: 'keikhlasan-dalam-pengabdian-sosial',
    topic: 'tasawuf-hati',
  },
  {
    context: 'Mendidik Generasi di Era Disrupsi',
    date: '2026-08-07T02:00:00.000Z',
    quote: 'Teknologi dapat menjawab banyak pertanyaan, tetapi teladan tetap dibutuhkan untuk menumbuhkan kebijaksanaan.',
    slug: 'mendidik-generasi-di-era-disrupsi',
    topic: 'keluarga-akhlak',
  },
] as const

const payload = await getPayload({ config })
const topicIDs = new Map<string, number>()

for (const [title, slug, description] of topics) {
  const existing = await payload.find({
    collection: 'categories',
    limit: 1,
    pagination: false,
    where: { slug: { equals: slug } },
  })
  const topic = existing.docs[0] || await payload.create({
    collection: 'categories',
    data: { description, slug, title },
  })
  topicIDs.set(slug, topic.id)
}

let created = 0
for (const record of records) {
  const existing = await payload.find({
    collection: 'dawuh',
    limit: 1,
    pagination: false,
    where: { slug: { equals: record.slug } },
  })
  if (existing.docs.length) continue

  await payload.create({
    collection: 'dawuh',
    data: {
      context: record.context,
      date: record.date,
      quote: record.quote,
      slug: record.slug,
      source: 'Naskah contoh untuk pratinjau — perlu verifikasi sumber redaksi',
      topic: topicIDs.get(record.topic),
    },
  })
  created += 1
}

console.log(`Seed dawuh selesai: ${created} catatan baru dibuat, ${records.length - created} sudah tersedia.`)
await payload.destroy()
