import type { DocPageData } from '@/types/docs'

export default {
  title: 'Copy Components',
  description: 'Skip the submodule — download only the components and composables you need and own the code directly in your project.',
  category: 'Guides',
  sections: [
    {
      title: 'When to use this approach',
      description: 'Use this if you want to modify components freely without managing a submodule or waiting for upstream changes. The trade-off: you won\'t get automatic updates.',
      lang: 'bash',
      code: `# You end up with the source files directly in your project:
# src/components/Actions/du-button/du-button.vue
# src/components/DataInput/du-select/du-select.vue
# src/composables/useSizeProps.ts
# ... etc`,
    },
    {
      title: 'Script',
      description: 'Run this from the root of your project. It does a sparse clone (only fetches the two folders), copies them in, then cleans up.',
      lang: 'bash',
      code: `#!/bin/sh
REPO="git@gitlab.limos.fr:hub-isima/daisyui-vue-kit.git"
TMP=$(mktemp -d)

git clone --filter=blob:none --sparse "$REPO" "$TMP"
git -C "$TMP" sparse-checkout set lib/components lib/composables
git -C "$TMP" checkout

mkdir -p src/components src/composables
cp -r "$TMP/lib/components/." src/components/
cp -r "$TMP/lib/composables/." src/composables/

rm -rf "$TMP"
echo "Done."`,
    },
    {
      title: 'Update imports',
      description: 'Once copied, import components from your local path instead of the package.',
      lang: 'vue',
      code: `<script setup lang="ts">
// Before (package)
import { DuButton } from 'cornet-ui'

// After (local copy)
import DuButton from '@/components/Actions/du-button/du-button.vue'
</script>

<template>
  <DuButton variant="primary">Hello!</DuButton>
</template>`,
    },
    {
      title: 'Import the CSS',
      description: 'The component styles still need to be loaded. Add Tailwind and DaisyUI to your main CSS file.',
      lang: 'css',
      code: `/* src/style.css */
@import "tailwindcss";
@plugin "daisyui";`,
    },
  ],
} satisfies DocPageData
