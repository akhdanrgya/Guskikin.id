import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const mediaHostname = (() => {
  try {
    return process.env.S3_ENDPOINT ? new URL(process.env.S3_ENDPOINT).hostname : null
  } catch {
    return null
  }
})()

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/aida-public/**',
      },
      ...(mediaHostname
        ? [{ protocol: 'https' as const, hostname: mediaHostname, pathname: '/**' }]
        : []),
    ],
  },
}

export default withPayload(nextConfig)
