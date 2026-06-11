/** Restores the source-mode package.json swapped by prepack.mjs. */
import { existsSync, renameSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const backupPath = join(root, 'package.json.backup')

if (existsSync(backupPath)) {
  renameSync(backupPath, join(root, 'package.json'))
  console.warn('[postpack] package.json restored to source mode')
}
