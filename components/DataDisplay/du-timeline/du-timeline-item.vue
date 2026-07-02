<script setup lang="ts">
import { computed } from "vue"
import { type DuTimelineItemData } from './du-timeline.types'

const props = withDefaults(
  defineProps<DuTimelineItemData>(),
  {
    start: "",
    middle: "",
    end: "",
    customClass: "",
    valid: undefined,
    hrClass: "",
  },
)

const lineClass = computed(() => {
  if (props.hrClass) {
    return props.hrClass
  }

  if (props.valid === true) {
    return "bg-primary"
  } else if (props.valid === false) {
    return "bg-error"
  }

  return ""
})
</script>

<template>
  <li :class="customClass">
    <hr v-if="$parent?.$slots?.default" :class="lineClass" />

    <div v-if="start || $slots.start" class="timeline-start">
      <slot name="start">
        {{ start }}
      </slot>
    </div>
    <div class="timeline-middle">
      <slot name="middle">
        <template v-if="middle">{{ middle }}</template>
        <template v-else>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            :class="[
              'w-5 h-5',
              valid === true
                ? 'text-primary'
                : valid === false
                  ? 'text-error'
                  : '',
            ]"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
              clip-rule="evenodd"
            />
          </svg>
        </template>
      </slot>
    </div>
    <div
      v-if="end || $slots.end"
      class="timeline-end"
      :class="{ 'timeline-box': $slots.end || end }"
    >
      <slot name="end">
        {{ end }}
      </slot>
    </div>
    <hr v-if="$slots.default || $parent?.$slots?.default" :class="lineClass" />
    <slot></slot>
  </li>
</template> 