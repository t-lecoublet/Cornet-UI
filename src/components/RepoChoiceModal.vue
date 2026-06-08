<script setup lang="ts">
import { useRepoPreference, type RepoPref } from '@/composables/useRepoPreference'

const { set } = useRepoPreference()

function choose(pref: RepoPref) {
  set(pref)
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-base-300/60 backdrop-blur-sm">
      <div class="bg-base-100 rounded-2xl shadow-2xl w-full max-w-lg border border-base-300">

        <div class="p-6 pb-4">
          <h2 class="text-lg font-bold mb-1">Choose your source</h2>
          <p class="text-sm text-base-content/60">
            Cornet is hosted on two platforms. Pick the one you prefer for
            links and code examples — you can switch anytime from the navbar.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-3 px-6 pb-6">

          <!-- GitLab -->
          <button
            class="flex flex-col items-start gap-3 p-4 rounded-xl border-2 border-base-300 hover:border-warning/60 hover:bg-warning/5 transition-all cursor-pointer text-left"
            @click="choose('gitlab')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 448 512" fill="currentColor" class="text-warning shrink-0">
              <path d="M0 96v320c0 35.3 28.7 64 64 64h320c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64C28.7 32 0 60.7 0 96m337.5 12.5l44.6 116.4l.4 1.2c5.6 16.8 7.2 35.2 2.3 52.5c-5 17.2-15.4 32.4-29.8 43.3l-.2.1l-68.4 51.2l-54.1 40.9c-.5.2-1.1.5-1.7.8c-2 1-4.4 2-6.7 2c-3 0-6.8-1.8-8.3-2.8l-54.2-40.9l-67.9-50.9l-.4-.3l-.2-.1c-14.3-10.8-24.8-26-29.7-43.3s-4.2-35.7 2.2-52.5l.5-1.2l44.7-116.4c.9-2.3 2.5-4.3 4.5-5.6c1.6-1 3.4-1.6 5.2-1.8c1.3-.7 2.1-.4 3.4.1c.6.2 1.2.5 2 .7c1 .4 1.6.9 2.4 1.5c.6.4 1.2 1 2.1 1.5c1.2 1.4 2.2 3 2.7 4.8l29.2 92.2H285l30.2-92.2c.5-1.8 1.4-3.4 2.6-4.8s2.8-2.4 4.5-3.1c1.7-.6 3.6-.9 5.4-.7s3.6.8 5.2 1.8c2 1.3 3.7 3.3 4.6 5.6"/>
            </svg>
            <div>
              <div class="font-semibold text-sm">GitLab</div>
              <div class="text-xs text-base-content/70 mt-0.5 leading-relaxed">
                Independent CNRS lab — sovereign hosting, no dependency on a big platform.
              </div>
            </div>
          </button>

          <!-- GitHub -->
          <button
            class="flex flex-col items-start gap-3 p-4 rounded-xl border-2 border-base-300 hover:border-primary/60 hover:bg-primary/5 transition-all cursor-pointer text-left"
            @click="choose('github')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" class="shrink-0">
              <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"/>
            </svg>
            <div>
              <div class="font-semibold text-sm">GitHub</div>
              <div class="text-xs text-base-content/70 mt-0.5 leading-relaxed">
                Microsoft — wider reach, the code is more likely to stay accessible long-term.
              </div>
            </div>
          </button>
        </div>

      </div>
    </div>
  </Teleport>
</template>
