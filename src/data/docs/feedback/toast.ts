import type { DocPageData } from '@/types/docs'

export default {
  title: 'Toast',
  description: 'Toast shows short notifications in a corner of the screen. Put one `<DuToast />` in your layout and raise messages from anywhere with `useToasts()` — the queue lives at module scope, so no caller has to reach the component first.',
  category: 'Feedback',
  source: 'https://daisyui.com/components/toast/',
  props: [
    {
      title: 'horizontalPosition',
      description: 'Horizontal placement of the toast stack',
      type: 'DuToastHorizontalPosition',
      default: '"end"',
      options: ['start', 'center', 'end'],
    },
    {
      title: 'verticalPosition',
      description: 'Vertical placement of the toast stack',
      type: 'DuToastVerticalPosition',
      default: '"bottom"',
      options: ['top', 'middle', 'bottom'],
    },
    {
      title: 'to',
      description: 'Teleport target selector. Renders the toast in place when omitted.',
      type: 'string',
    },
    {
      title: 'dismissLabel',
      description: "Accessible name of each toast's close button.",
      type: 'string',
      default: "'Dismiss'",
    },
  ],
  slots: [
    {
      title: 'Slot #toast',
      description: 'Render a queued toast yourself. Scope: `{ toast, dismiss }`.',
      code: `<DuToast>
  <template #toast="{ toast, dismiss }">
    <div class="alert" :class="\`alert-\${toast.variant}\`">
      <strong>{{ toast.title }}</strong>
      <span>{{ toast.message }}</span>
      <button type="button" @click="dismiss">✕</button>
    </div>
  </template>
</DuToast>`,
    },
    {
      title: 'Default slot',
      description: 'Write the toasts by hand. Still supported, and additive — anything in the default slot renders alongside the queue.',
      code: `<DuToast horizontalPosition="end" verticalPosition="top">
  <DuAlert variant="success" icon>Saved successfully!</DuAlert>
</DuToast>`,
    },
  ],
  classnames: {
    placement: [
      { class: 'toast-start', desc: 'Left side' },
      { class: 'toast-center', desc: 'Horizontally centered' },
      { class: 'toast-end', desc: 'Right side', default: true },
      { class: 'toast-top', desc: 'Top of screen' },
      { class: 'toast-middle', desc: 'Vertically centered' },
      { class: 'toast-bottom', desc: 'Bottom of screen', default: true },
    ],
  },
  sections: [
    {
      title: 'useToasts()',
      description: 'One `<DuToast />` in the layout, then `push()` from anywhere. The queue is at module scope on purpose: a per-instance queue would mean every caller had to find the right component first. `duration` defaults to 5000 ms and `0` means "until dismissed".',
      links: [
        { label: 'DuAlert docs', href: '/docs/feedback/alert' },
      ],
      script: `
      const { push, clear } = useToasts()
      return { push, clear }
      `,
      preview: `<div class="relative h-44 w-full rounded-xl border border-base-300 overflow-hidden p-3 flex flex-wrap gap-2 items-start">
  <DuButton size="sm" variant="success" @click="push({ message: 'Saved successfully', variant: 'success' })">Success</DuButton>
  <DuButton size="sm" variant="info" @click="push({ title: 'Upload', message: '2 files uploaded', variant: 'info' })">Info</DuButton>
  <DuButton size="sm" variant="error" @click="push({ message: 'Could not reach the server', variant: 'error' })">Error</DuButton>
  <DuButton size="sm" ghost @click="push({ message: 'This one stays until you close it', duration: 0 })">Persistent</DuButton>
  <DuButton size="sm" ghost @click="clear()">Clear all</DuButton>
  <DuToast class="absolute" horizontalPosition="end" verticalPosition="bottom" />
</div>`,
      code: `<!-- once, in your layout -->
<DuToast horizontalPosition="end" verticalPosition="top" />

<!-- anywhere else -->
<script setup lang="ts">
import { useToasts } from 'cornet-ui'

const { push } = useToasts()

async function save() {
  try {
    await api.save()
    push({ message: 'Saved successfully', variant: 'success' })
  }
  catch (error) {
    push({ message: String(error), variant: 'error' })
  }
}
</script>`,
    },
    {
      title: 'The API',
      description: '`push()` returns the toast id, so you can dismiss a specific one later. `pause()` and `resume()` hold every countdown — the component already calls them on hover and focus, so you rarely need to.',
      lang: 'ts',
      code: `const { toasts, push, dismiss, clear, pause, resume } = useToasts()

const id = push({
  title: 'Export ready',            // optional
  message: 'report-2026.csv',       // optional
  variant: 'success',               // any Cornet variant
  duration: 5000,                   // ms; 0 = until dismissed
  politeness: 'polite',             // 'polite' | 'assertive'
})

dismiss(id)   // remove one
clear()       // remove all

toasts.value  // readonly Ref<Toast[]>, if you want to render them yourself`,
    },
    {
      title: 'Two live regions, always present',
      description: 'A live region only announces what arrives **after** it exists — one created at the same moment as its first message is usually missed entirely. So DuToast renders both regions from the start, whether or not they hold anything: a `role="status"` / `aria-live="polite"` one, and a `role="alert"` / `aria-live="assertive"` one. An `error` toast goes to the assertive region, everything else to the polite one; `politeness` overrides that. Interrupting someone is a cost — spend it on failures, not on "Saved".',
      links: [
        { label: 'ARIA live regions', href: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions' },
      ],
      lang: 'ts',
      code: `push({ message: 'Saved', variant: 'success' })                 // polite
push({ message: 'Upload failed', variant: 'error' })           // assertive
push({ message: 'Careful', politeness: 'assertive' })          // forced assertive`,
    },
    {
      title: 'Countdowns pause when you reach for them',
      description: 'Hovering the container or tabbing into it holds every countdown, and it resumes from where it stopped rather than restarting. WCAG 2.2.1 asks that a time limit be pausable, and a toast that vanishes while it is being read — or while you are reaching for its close button — is the everyday version of that failure.',
      links: [
        { label: 'WCAG 2.2.1 Timing Adjustable', href: 'https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html' },
      ],
      code: `<!-- nothing to wire: the container pauses on hover and on focus -->
<DuToast dismissLabel="Close notification" />`,
    },
    {
      title: 'Rendering a toast yourself',
      description: 'The `#toast` slot replaces how a queued toast is drawn, keeping the queue, the countdowns and the live regions.',
      code: `<DuToast>
  <template #toast="{ toast, dismiss }">
    <div class="rounded-box bg-base-100 border p-3 flex items-center gap-3">
      <div class="flex-1">
        <p class="font-semibold">{{ toast.title }}</p>
        <p class="text-xs">{{ toast.message }}</p>
      </div>
      <DuButton size="xs" ghost square ariaLabel="Dismiss" @click="dismiss">✕</DuButton>
    </div>
  </template>
</DuToast>`,
    },
    {
      title: 'Handwritten toasts',
      description: 'The default slot still works exactly as before, and it is additive — its content renders alongside anything in the queue. Use it for a banner that is not really a notification.',
      preview: `<div class="relative h-36 w-full rounded-xl border border-base-300 overflow-hidden" style="transform: translate(0, 0)">
  <DuToast horizontalPosition="end" verticalPosition="top">
    <DuAlert variant="success" icon>Saved successfully!</DuAlert>
    <DuAlert variant="info" icon>2 files uploaded</DuAlert>
  </DuToast>
</div>`,
      code: `<DuToast horizontalPosition="end" verticalPosition="top">
  <DuAlert variant="success" icon>Saved successfully!</DuAlert>
  <DuAlert variant="info" icon>2 files uploaded</DuAlert>
</DuToast>`,
    },
    {
      title: 'Placement',
      preview: `<div class="relative h-40 w-full rounded-xl border border-base-300 overflow-hidden" style="transform: translate(0, 0)">
  <DuToast horizontalPosition="start" verticalPosition="top">
    <DuAlert variant="info">start / top</DuAlert>
  </DuToast>
</div>`,
      code: `<DuToast horizontalPosition="start" verticalPosition="top" />
<DuToast horizontalPosition="center" verticalPosition="middle" />
<DuToast horizontalPosition="end" verticalPosition="bottom" />`,
    },
  ],
} satisfies DocPageData
