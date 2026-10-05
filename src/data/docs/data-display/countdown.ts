import type { DocPageData } from '@/types/docs'

export default {
  title: 'Countdown',
  description: 'Countdown gives a live animated countdown. Use DuCountdown for a single unit (seconds, minutes, hours, or days), or DuCountdownGroup for a full days/hours/minutes/seconds display tied to a target date. Each unit carries `role="timer"`, so assistive tech knows the number is changing on its own.',
  category: 'Data Display',
  source: 'https://daisyui.com/components/countdown/',
  props: [
    {
      title: 'value',
      description: 'Static number to display. Takes precedence over `targetDate`.',
      type: 'number',
    },
    {
      title: 'targetDate',
      description: 'Date to count down to — the value updates every second',
      type: 'Date',
    },
    {
      title: 'format',
      description: 'Which unit of the remaining time to display',
      type: 'DuCountdownFormat',
      default: '"seconds"',
      options: ['days', 'hours', 'minutes', 'seconds'],
    },
    {
      title: 'separator',
      description: 'Separator rendered after the value',
      type: 'string',
      default: '":"',
    },
    {
      title: 'autoStart',
      description: 'Start the timer as soon as the component mounts',
      type: 'boolean',
      default: 'true',
    },
    {
      title: 'customClass',
      description: 'Additional CSS classes for the root element',
      type: 'string',
    },
  ],
  sections: [
    {
      title: 'Single value',
      description: 'DuCountdown with a static `:value` prop.',
      preview: `<DuCountdown :value="47" />`,
      code: `<DuCountdown :value="47" />`,
    },
    {
      title: 'Countdown from target date',
      description: 'Pass a `targetDate` and a `format` to show the remaining days, hours, minutes, or seconds.',
      links: [
        { label: 'JavaScript Date docs', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date' },
      ],
      preview: `<div class="flex gap-4 font-mono text-4xl">
  <div class="flex flex-col items-center">
    <DuCountdown :value="2" />
    <span class="text-sm mt-1">hours</span>
  </div>
  <div class="flex flex-col items-center">
    <DuCountdown :value="47" />
    <span class="text-sm mt-1">min</span>
  </div>
  <div class="flex flex-col items-center">
    <DuCountdown :value="30" />
    <span class="text-sm mt-1">sec</span>
  </div>
</div>`,
      code: `<script setup lang="ts">
const deadline = new Date(Date.now() + 1000 * 60 * 60 * 3) // 3 hours from now
</script>

<template>
  <div class="flex gap-4 font-mono text-4xl">
    <div class="flex flex-col items-center">
      <DuCountdown :targetDate="deadline" format="hours" />
      <span class="text-sm">hours</span>
    </div>
    <div class="flex flex-col items-center">
      <DuCountdown :targetDate="deadline" format="minutes" />
      <span class="text-sm">min</span>
    </div>
    <div class="flex flex-col items-center">
      <DuCountdown :targetDate="deadline" format="seconds" />
      <span class="text-sm">sec</span>
    </div>
  </div>
</template>`,
    },
    {
      title: 'Full countdown group',
      description: 'DuCountdownGroup renders days / hours / minutes / seconds all at once from a single `targetDate`.',
      preview: `<div class="flex items-center gap-2 font-mono text-4xl">
  <div class="flex flex-col items-center">
    <DuCountdown :value="2" />
    <span class="text-xs mt-1">days</span>
  </div>
  <span class="text-xl">:</span>
  <div class="flex flex-col items-center">
    <DuCountdown :value="10" />
    <span class="text-xs mt-1">hours</span>
  </div>
  <span class="text-xl">:</span>
  <div class="flex flex-col items-center">
    <DuCountdown :value="24" />
    <span class="text-xs mt-1">min</span>
  </div>
  <span class="text-xl">:</span>
  <div class="flex flex-col items-center">
    <DuCountdown :value="50" />
    <span class="text-xs mt-1">sec</span>
  </div>
</div>`,
      code: `<script setup lang="ts">
const deadline = new Date('2025-12-31T23:59:59')
</script>

<template>
  <DuCountdownGroup :targetDate="deadline" />
</template>`,
    },
    {
      title: 'Selective units',
      description: 'Hide specific units with `showDays`, `showHours`, `showMinutes`, `showSeconds` props.',
      preview: `<div class="flex items-center gap-2 font-mono text-4xl">
  <div class="flex flex-col items-center">
    <DuCountdown :value="2" />
    <span class="text-xs mt-1">h</span>
  </div>
  <span>:</span>
  <div class="flex flex-col items-center">
    <DuCountdown :value="47" />
    <span class="text-xs mt-1">m</span>
  </div>
  <span>:</span>
  <div class="flex flex-col items-center">
    <DuCountdown :value="30" />
    <span class="text-xs mt-1">s</span>
  </div>
</div>`,
      code: `<DuCountdownGroup
  :targetDate="deadline"
  :showDays="false"
  :labels="{ hours: 'h', minutes: 'm', seconds: 's' }"
/>`,
    },
    {
      title: 'Custom labels',
      description: 'Override the label text under each unit via the `labels` prop.',
      preview: `<div class="flex items-center gap-2 font-mono text-4xl">
  <div class="flex flex-col items-center">
    <DuCountdown :value="3" />
    <span class="text-xs mt-1">days</span>
  </div>
  <span>:</span>
  <div class="flex flex-col items-center">
    <DuCountdown :value="14" />
    <span class="text-xs mt-1">hours</span>
  </div>
  <span>:</span>
  <div class="flex flex-col items-center">
    <DuCountdown :value="22" />
    <span class="text-xs mt-1">min</span>
  </div>
  <span>:</span>
  <div class="flex flex-col items-center">
    <DuCountdown :value="9" />
    <span class="text-xs mt-1">sec</span>
  </div>
</div>`,
      code: `<DuCountdownGroup
  :targetDate="deadline"
  :labels="{ days: 'days', hours: 'hours', minutes: 'min', seconds: 'sec' }"
/>`,
    },
    {
      title: 'autoStart = false + manual control',
      description: 'Set `autoStart` to `false` to prevent auto-start on mount. Use a template ref to call `start()`, `stop()`, and `reset()` imperatively.',
      links: [
        { label: 'Vue template refs docs', href: 'https://vuejs.org/guide/essentials/template-refs.html' },
        { label: 'defineExpose docs', href: 'https://vuejs.org/api/sfc-script-setup.html#defineexpose' },
      ],
      script: `
      const countdownRef = ref(null)
      const seconds = ref(30)
      return { countdownRef, seconds }
      `,
      preview: `<div class="flex flex-col items-center gap-3">
  <DuCountdown
    ref="countdownRef"
    :value="seconds"
    :autoStart="false"
    @end="onEnd"
  />

  <div class="flex gap-2 mt-2">
    <DuButton size="sm" variant="success" @click="countdownRef?.start()">Start</DuButton>
    <DuButton size="sm" variant="warning" @click="countdownRef?.stop()">Pause</DuButton>
    <DuButton size="sm" variant="error" @click="countdownRef?.reset()">Reset</DuButton>
  </div>
</div>`,
      code: `<script setup lang="ts">
import { ref } from 'vue'

const countdownRef = ref<InstanceType<typeof DuCountdown> | null>(null)
const seconds = ref(30)
</script>

<template>
  <DuCountdown
    ref="countdownRef"
    :value="seconds"
    :autoStart="false"
    @end="onEnd"
  />

  <div class="flex gap-2 mt-2">
    <DuButton size="sm" variant="success" @click="countdownRef?.start()">Start</DuButton>
    <DuButton size="sm" variant="warning" @click="countdownRef?.stop()">Pause</DuButton>
    <DuButton size="sm" variant="error" @click="countdownRef?.reset()">Reset</DuButton>
  </div>
</template>`,
    },
    {
      title: 'End event',
      description: 'Listen to the `@end` event when the countdown reaches zero.',
      preview: `<DuCountdown :value="10" class="font-mono text-5xl" />`,
      code: `<script setup lang="ts">
const handleEnd = () => {
  console.log('Countdown finished!')
}
</script>

<template>
  <DuCountdown :value="10" @end="handleEnd" />
</template>`,
    },
  ],
} satisfies DocPageData
