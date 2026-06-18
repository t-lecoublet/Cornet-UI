import { ref, computed } from 'vue'

export type RepoPref = 'gitlab' | 'github' | 'npm'

const STORAGE_KEY = 'cornet-repo-preference'

const GITLAB_BASE = 'https://gitlab.limos.fr/hub-isima/daisyui-vue-kit'
const GITHUB_BASE = 'https://github.com/t-lecoublet/Cornet'
const NPM_BASE    = 'https://www.npmjs.com/package/cornet-ui'
const GITLAB_SSH  = 'git@gitlab.limos.fr:hub-isima/daisyui-vue-kit.git'
const GITHUB_SSH  = 'git@github.com:t-lecoublet/Cornet.git'

const stored = typeof localStorage !== 'undefined'
  ? (localStorage.getItem(STORAGE_KEY) as RepoPref | null)
  : null

const preference = ref<RepoPref | null>(stored)

export function useRepoPreference() {
  function set(pref: RepoPref) {
    preference.value = pref
    localStorage.setItem(STORAGE_KEY, pref)
  }

  function transformUrl(text: string): string {
    if (preference.value !== 'github') return text
    return text
      .replace(/https:\/\/gitlab\.limos\.fr\/hub-isima\/daisyui-vue-kit\/-\/tree\//g, `${GITHUB_BASE}/tree/`)
      .replace(/https:\/\/gitlab\.limos\.fr\/hub-isima\/daisyui-vue-kit/g, GITHUB_BASE)
      .replace(/git@gitlab\.limos\.fr:hub-isima\/daisyui-vue-kit\.git/g, GITHUB_SSH)
  }

  const repoUrl = computed(() => {
    if (preference.value === 'github') return GITHUB_BASE
    if (preference.value === 'npm') return NPM_BASE
    return GITLAB_BASE
  })

  return { preference, set, transformUrl, repoUrl }
}
