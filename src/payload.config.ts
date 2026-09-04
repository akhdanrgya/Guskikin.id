import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { s3Storage } from '@payloadcms/storage-s3'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Categories } from './collections/Categories'
import { Tags } from './collections/Tags'
import { Authors } from './collections/Authors'
import { Dawuh } from './collections/Dawuh'
import { Khazanah } from './collections/Khazanah'
import { Events } from './collections/Events'
import { MediaContents } from './collections/MediaContents'
import { Scholars } from './collections/Scholars'
import { CommunityPosts } from './collections/CommunityPosts'
import { Pages } from './collections/Pages'

import { SiteSettings } from './globals/SiteSettings'
import { Header } from './globals/Header'
import { Footer } from './globals/Footer'
import { Homepage } from './globals/Homepage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    components: {
      beforeDashboard: ['/components/admin/AdminDashboardHero'],
      beforeLogin: ['/components/admin/AuthIntro'],
      beforeNavLinks: ['/components/admin/AdminNavBrand'],
      graphics: {
        Icon: '/components/admin/AdminIcon',
        Logo: '/components/admin/AuthLogo',
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— guskikin.id',
    },
  },
  collections: [
    Users,
    Media,
    Posts,
    Categories,
    Tags,
    Authors,
    Dawuh,
    Khazanah,
    Events,
    MediaContents,
    Scholars,
    CommunityPosts,
    Pages,
  ],
  globals: [SiteSettings, Header, Footer, Homepage],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        endpoint: process.env.S3_ENDPOINT || '',
        region: process.env.S3_REGION || 'auto',
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
      },
    }),
  ],
})
