import { spawnSync } from 'node:child_process'

if (process.env.VERCEL_ENV !== 'production') {
  console.log('Skipping production migrations outside a Vercel production build.')
  process.exit(0)
}

const result = spawnSync(
  process.execPath,
  ['node_modules/payload/bin.js', 'run', 'src/scripts/migrate-production.ts'],
  {
    env: process.env,
    stdio: 'inherit',
  },
)

if (result.error) throw result.error
process.exit(result.status ?? 1)
