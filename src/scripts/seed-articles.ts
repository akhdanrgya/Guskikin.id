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

const categories = [
  ['Fiqih Peradaban', 'fiqih-peradaban', 'Kajian hukum, etika, dan kemaslahatan untuk menjawab perubahan zaman.'],
  ['Kemandirian Ekonomi', 'kemandirian-ekonomi', 'Gagasan dan praktik ekonomi pesantren yang amanah serta berkelanjutan.'],
  ['Tausiyah & Dawuh', 'tausiyah-dawuh', 'Pesan keagamaan yang teduh, membumi, dan berakar pada tradisi pesantren.'],
  ['Pesantren & Karakter', 'pesantren-karakter', 'Pendidikan adab, sanad keilmuan, dan pembentukan karakter santri.'],
  ['Wawasan Kebangsaan', 'wawasan-kebangsaan', 'Refleksi keislaman, kebangsaan, persatuan, dan tanggung jawab sosial.'],
] as const

const tags = [
  ['Sanad Ilmu', 'sanad-ilmu'],
  ['Pesantren Tebuireng', 'pesantren-tebuireng'],
  ['Moderasi Beragama', 'moderasi-beragama'],
  ['Adab', 'adab'],
  ['Kemandirian Umat', 'kemandirian-umat'],
  ['Ukhuwah', 'ukhuwah'],
] as const

const articles = [
  {
    category: 'pesantren-karakter',
    excerpt: 'Sanad tidak berhenti pada urutan nama guru, tetapi hidup melalui adab belajar, ketelitian membaca sumber, dan tanggung jawab menyampaikan pengetahuan.',
    featured: true,
    minutes: 7,
    publishedAt: '2026-09-01T02:00:00.000Z',
    slug: 'menjaga-sanad-keilmuan-pesantren-di-tengah-arus-digital',
    tags: ['sanad-ilmu', 'pesantren-tebuireng', 'adab'],
    title: 'Menjaga Sanad Keilmuan Pesantren di Tengah Arus Digital',
    content: [
      'Arus informasi digital membuat pengetahuan bergerak lebih cepat daripada sebelumnya. Bagi pesantren, keadaan ini bukan alasan untuk menutup diri, melainkan kesempatan untuk menegaskan kembali cara belajar yang tertib dan bertanggung jawab.',
      'Sanad keilmuan memberi konteks pada sebuah pendapat: dari siapa ia dipelajari, bagaimana ia dipahami, serta dalam keadaan apa ia diterapkan. Ketelitian semacam ini membantu pembaca membedakan penjelasan yang matang dari potongan informasi yang kehilangan latar.',
      'Teknologi dapat memperluas jangkauan pengajian, dokumentasi, dan diskusi. Namun, hubungan dengan guru, adab bertanya, serta kebiasaan memeriksa sumber tetap menjadi fondasi agar kemudahan digital menghasilkan kemaslahatan.',
    ],
  },
  {
    category: 'fiqih-peradaban',
    excerpt: 'Fiqih peradaban mengajak umat membaca perubahan sosial secara jernih, menjaga prinsip, dan memilih jalan yang paling membawa kemaslahatan.',
    minutes: 6,
    publishedAt: '2026-08-28T02:00:00.000Z',
    slug: 'fiqih-peradaban-sebagai-etika-menjawab-perubahan-zaman',
    tags: ['moderasi-beragama', 'sanad-ilmu'],
    title: 'Fiqih Peradaban sebagai Etika Menjawab Perubahan Zaman',
    content: [
      'Perubahan sosial menghadirkan persoalan yang tidak selalu dapat dijawab hanya dengan melihat bentuk luarnya. Diperlukan pemahaman yang mempertemukan keteguhan prinsip, pengetahuan atas kenyataan, dan kepekaan terhadap akibat.',
      'Fiqih peradaban menempatkan hukum sebagai jalan merawat kehidupan bersama. Pertanyaan yang diajukan bukan sekadar boleh atau tidak, tetapi juga siapa yang terdampak, manfaat apa yang dijaga, dan kerusakan apa yang perlu dicegah.',
      'Sikap ini menuntut kerendahan hati untuk mendengar banyak disiplin ilmu serta keberanian bermusyawarah sebelum mengambil kesimpulan.',
    ],
  },
  {
    category: 'kemandirian-ekonomi',
    excerpt: 'Kemandirian ekonomi pesantren tumbuh dari tata kelola yang terbuka, usaha yang relevan, dan keberpihakan pada kesejahteraan bersama.',
    minutes: 5,
    publishedAt: '2026-08-24T02:00:00.000Z',
    slug: 'kemandirian-pesantren-dan-ekonomi-berbasis-amanah',
    tags: ['kemandirian-umat', 'pesantren-tebuireng'],
    title: 'Kemandirian Pesantren dan Ekonomi Berbasis Amanah',
    content: [
      'Kemandirian bukan berarti berjalan sendirian. Dalam lingkungan pesantren, kemandirian lahir ketika sumber daya dikelola secara amanah, kemampuan warga dikembangkan, dan manfaat usaha kembali menguatkan pendidikan serta pelayanan sosial.',
      'Usaha pesantren perlu dimulai dari kebutuhan nyata dan kompetensi yang tersedia. Pencatatan yang rapi, pembagian peran, serta evaluasi berkala membantu niat baik bertumbuh menjadi lembaga yang sehat.',
      'Dengan begitu, aktivitas ekonomi tidak hanya mengejar hasil, tetapi juga menjadi ruang belajar tentang tanggung jawab, kerja sama, dan kebermanfaatan.',
    ],
  },
  {
    category: 'pesantren-karakter',
    excerpt: 'Kecepatan ruang publik digital perlu diimbangi dengan adab menyimak, memeriksa, dan menyampaikan pendapat secara proporsional.',
    minutes: 4,
    publishedAt: '2026-08-20T02:00:00.000Z',
    slug: 'adab-menuntut-ilmu-di-ruang-publik-yang-serba-cepat',
    tags: ['adab', 'sanad-ilmu'],
    title: 'Adab Menuntut Ilmu di Ruang Publik yang Serba Cepat',
    content: [
      'Ruang digital sering mendorong orang untuk segera bereaksi. Padahal, proses belajar justru membutuhkan jeda: mendengar secara utuh, mengenali keterbatasan diri, lalu memeriksa kembali apa yang akan disampaikan.',
      'Adab bukan hiasan setelah ilmu dikuasai. Ia bekerja sejak seseorang memilih sumber, mengajukan pertanyaan, berbeda pendapat, hingga mengakui kekeliruan.',
      'Budaya belajar yang sehat dapat dimulai dari kebiasaan sederhana: mencantumkan sumber, tidak memotong penjelasan, dan tidak menjadikan perbedaan sebagai alasan untuk merendahkan.',
    ],
  },
  {
    category: 'wawasan-kebangsaan',
    excerpt: 'Literasi dan dialog memberi ruang bagi perbedaan untuk dipahami, sehingga ukhuwah tidak berhenti sebagai semboyan.',
    minutes: 6,
    publishedAt: '2026-08-16T02:00:00.000Z',
    slug: 'merawat-ukhuwah-melalui-literasi-dan-dialog-kebangsaan',
    tags: ['ukhuwah', 'moderasi-beragama'],
    title: 'Merawat Ukhuwah melalui Literasi dan Dialog Kebangsaan',
    content: [
      'Ukhuwah tumbuh dari kesediaan untuk mengenal orang lain secara utuh. Literasi membantu kita keluar dari prasangka, sementara dialog mengubah perbedaan dari sumber ketegangan menjadi kesempatan untuk belajar.',
      'Dalam masyarakat yang majemuk, persatuan tidak menuntut semua orang menjadi sama. Persatuan memerlukan kesepakatan untuk menjaga martabat sesama, menaati aturan bersama, dan menyelesaikan masalah tanpa kekerasan.',
      'Pesantren dapat mengambil peran penting dengan menghadirkan ruang perjumpaan yang teduh, berilmu, dan dekat dengan kebutuhan masyarakat.',
    ],
  },
  {
    category: 'fiqih-peradaban',
    excerpt: 'Musyawarah membantu keputusan publik mempertimbangkan ilmu, pengalaman, dampak, dan suara pihak yang paling terdampak.',
    minutes: 5,
    publishedAt: '2026-08-12T02:00:00.000Z',
    slug: 'tradisi-musyawarah-sebagai-jalan-menjaga-kemaslahatan',
    tags: ['moderasi-beragama', 'ukhuwah'],
    title: 'Tradisi Musyawarah sebagai Jalan Menjaga Kemaslahatan',
    content: [
      'Musyawarah bukan sekadar mengumpulkan banyak pendapat. Ia adalah ikhtiar untuk memperjelas masalah, memeriksa dasar pertimbangan, dan menemukan keputusan yang paling bertanggung jawab.',
      'Tradisi bahtsul masail menunjukkan bahwa perbedaan pandangan dapat dikelola melalui rujukan yang jelas dan tata dialog yang beradab. Hasilnya bukan kemenangan satu pihak, melainkan pemahaman yang lebih lengkap.',
      'Semangat serupa relevan dalam pengelolaan lembaga dan kehidupan warga: keputusan yang menyangkut banyak orang sepatutnya lahir dari proses yang dapat dipercaya.',
    ],
  },
  {
    category: 'tausiyah-dawuh',
    excerpt: 'Khazanah klasik tetap hidup ketika dibaca dengan disiplin sumber, pemahaman konteks, dan perhatian pada persoalan masyarakat hari ini.',
    minutes: 7,
    publishedAt: '2026-08-08T02:00:00.000Z',
    slug: 'membaca-khazanah-klasik-untuk-persoalan-kontemporer',
    tags: ['sanad-ilmu', 'adab'],
    title: 'Membaca Khazanah Klasik untuk Persoalan Kontemporer',
    content: [
      'Kitab klasik menyimpan jejak panjang ikhtiar ulama memahami wahyu dan kehidupan. Membacanya memerlukan ketekunan pada bahasa, susunan argumen, serta keadaan yang melatarbelakangi sebuah pembahasan.',
      'Persoalan kontemporer membawa unsur baru yang perlu dikenali secara akurat. Karena itu, pembacaan turats perlu berjalan bersama pengetahuan tentang masyarakat, teknologi, ekonomi, dan disiplin lain yang berkaitan.',
      'Pertemuan antara kedalaman tradisi dan ketelitian membaca zaman membuat khazanah klasik terus memberi arah tanpa dipaksa menjawab persoalan secara serampangan.',
    ],
  },
] as const

const payload = await getPayload({ config })

const categoryIDs = new Map<string, number>()
for (const [title, slug, description] of categories) {
  const existing = await payload.find({
    collection: 'categories',
    limit: 1,
    pagination: false,
    where: { slug: { equals: slug } },
  })
  const record = existing.docs[0] || await payload.create({
    collection: 'categories',
    data: { description, slug, title },
  })
  categoryIDs.set(slug, record.id)
}

const tagIDs = new Map<string, number>()
for (const [title, slug] of tags) {
  const existing = await payload.find({
    collection: 'tags',
    limit: 1,
    pagination: false,
    where: { slug: { equals: slug } },
  })
  const record = existing.docs[0] || await payload.create({
    collection: 'tags',
    data: { slug, title },
  })
  tagIDs.set(slug, record.id)
}

const existingAuthors = await payload.find({
  collection: 'authors',
  limit: 1,
  pagination: false,
  where: { slug: { equals: 'tim-redaksi-guskikin' } },
})
const author = existingAuthors.docs[0] || await payload.create({
  collection: 'authors',
  data: {
    bio: 'Tim editorial guskikin.id yang mengelola publikasi khazanah, pesantren, dan refleksi kebangsaan.',
    name: 'Tim Redaksi Guskikin',
    slug: 'tim-redaksi-guskikin',
  },
})

let created = 0
for (const article of articles) {
  const existing = await payload.find({
    collection: 'posts',
    limit: 1,
    pagination: false,
    where: { slug: { equals: article.slug } },
  })
  if (existing.docs.length) continue

  await payload.create({
    collection: 'posts',
    data: {
      _status: 'published',
      authors: [author.id],
      category: categoryIDs.get(article.category),
      content: richText(...article.content),
      excerpt: article.excerpt,
      isFeatured: 'featured' in article ? article.featured : false,
      publishedAt: article.publishedAt,
      readingTime: article.minutes,
      slug: article.slug,
      tags: article.tags.map((slug) => tagIDs.get(slug)).filter((id): id is number => Boolean(id)),
      title: article.title,
    },
  })
  created += 1
}

console.log(`Seed artikel selesai: ${created} artikel baru dibuat, ${articles.length - created} sudah tersedia.`)
await payload.destroy()
