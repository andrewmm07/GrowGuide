/**
 * Bundle digestRunner for Supabase Edge (Deno).
 * Run before: supabase functions deploy notification-digest
 */
import * as esbuild from 'esbuild'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

await esbuild.build({
  entryPoints: [join(root, 'lib/notifications/digestRunner.ts')],
  bundle: true,
  platform: 'browser',
  format: 'esm',
  outfile: join(root, 'supabase/functions/notification-digest/digest.bundle.mjs'),
  packages: 'bundle',
  mainFields: ['browser', 'module', 'main'],
  alias: {
    '@': root,
  },
  logLevel: 'info',
})

console.log('Built supabase/functions/notification-digest/digest.bundle.mjs')
