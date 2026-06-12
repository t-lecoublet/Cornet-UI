/** Restores the source-mode package.json and index.css swapped by prepack.mjs. */
import { existsSync, renameSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(dirname(fileURLToPath(import.meta.url)))

for (const [backup, target] of [
  ['package.json.backup', 'package.json'],
  ['index.css.backup', 'index.css'],
]) {
  const backupPath = join(root, backup)
  if (existsSync(backupPath)) {
    renameSync(backupPath, join(root, target))
  }
}
console.warn('[postpack] package.json and index.css restored to source mode')
