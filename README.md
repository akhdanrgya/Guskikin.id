# guskikin.id

Platform editorial Gus Kikin yang menggabungkan portal berita, arsip khazanah,
dawuh, agenda dakwah, media audiovisual, dan pengelolaan konten melalui Payload
CMS. Arah produk dan keputusan engineering utama dijelaskan di
`ANTIGRAVITY_GUS_KIKIN_MASTER_SPEC.md`.

## Stack

- Next.js 16 App Router dan React Server Components
- TypeScript strict mode
- Payload CMS 3 dengan PostgreSQL
- Cloudflare R2 atau penyimpanan S3-compatible
- Tailwind CSS 4 dan shadcn/ui

## Menjalankan proyek

Gunakan Node.js 22 LTS dan pnpm yang tercantum di `package.json`.

```bash
pnpm install
cp .env.example .env
pnpm generate:types
pnpm generate:importmap
pnpm dev
```

Frontend tersedia di `http://localhost:3000` dan panel Payload di
`http://localhost:3000/admin`.

## Environment

Isi seluruh kredensial melalui `.env`; jangan menyimpan secret di source code.
Variabel yang dibutuhkan tersedia di `.env.example`:

- `DATABASE_URI` untuk PostgreSQL
- `PAYLOAD_SECRET` untuk autentikasi Payload
- `NEXT_PUBLIC_SITE_URL` untuk URL kanonis aplikasi
- `S3_*` untuk bucket R2/S3-compatible
- `NEXT_PUBLIC_GA_ID` untuk analytics opsional

## Quality checks

```bash
pnpm lint
pnpm typecheck
pnpm build
```

`src/payload-types.ts` dan `src/app/(payload)/admin/importMap.js` merupakan
artefak resmi Payload. Regenerasikan keduanya setiap kali schema atau komponen
admin berubah.

## Struktur utama

- `src/app/(frontend)` berisi route dan layout publik.
- `src/app/(payload)` berisi admin panel dan REST API Payload.
- `src/collections` berisi schema collection editorial.
- `src/globals` berisi konfigurasi global situs dan homepage.
- `src/components` berisi komponen UI yang dapat digunakan kembali.
