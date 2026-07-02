<script setup lang="ts">
import { computed } from "vue"
import { type DuTimelineProps } from './du-timeline.types'

const props = withDefaults(
  defineProps<DuTimelineProps>(),
  {
    items: undefined,
    direction: "timeline-vertical",
    modifier: undefined,
    customClass: "",
    responsive: false,
    validItems: undefined,
    hrClasses: undefined,
  },
)

const timelineClasses = computed(() => {
  const classes = ["timeline", props.direction]

  if (props.modifier) {
    classes.push(props.modifier)
  }

  if (props.customClass) {
    classes.push(props.customClass)
  }

  if (props.responsive) {
    classes.push("lg:timeline-horizontal")
  }

  return classes
})

const getLineClass = (index: number): string => {
  if (props.items && props.items[index] && props.items[index].hrClass) {
    return props.items[index].hrClass || ""
  }

  if (props.hrClasses && props.hrClasses[index]) {
    return props.hrClasses[index]
  }

  if (props.validItems && props.validItems[index] !== undefined) {
    return props.validItems[index] === true ? "bg-success" : props.validItems[index] === false ? "bg-error" : ""
  }

  if (
    props.items &&
    props.items[index] &&
    props.items[index].valid !== undefined
  ) {
    return props.items[index].valid === true ? "bg-success" : props.items[index].valid === false ? "bg-error" : ""
  }

  return ""
}
</script>

<template>
  <ul :class="timelineClasses">
    <!-- Dynamic items mode -->
    <template v-if="items">
      <li v-for="(item, index) in items" :key="index" :class="item.customClass">
        <hr v-if="index != 0" :class="getLineClass(index - 1)" />

        <div
          v-if="item.start || $slots[`start-${index}`]"
          class="timeline-start"
        >
          <slot :name="`start-${index}`" :item="item" :index="index">
            <slot name="start" :item="item" :index="index">
              {{ item.start }}
            </slot>
          </slot>
        </div>
        <div class="timeline-middle">
          <slot :name="`middle-${index}`" :item="item" :index="index">
            <slot name="middle" :item="item" :index="index">
              <template v-if="item.middle">{{ item.middle }}</template>
              <template v-else>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  :class="[
                    'w-5 h-5',
                    item.valid === true
                      ? 'text-success'
                      : item.valid === false
                        ? 'text-error'
                        : validItems && validItems[index] === true
                          ? 'text-success'
                          : validItems && validItems[index] === false
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
          </slot>
        </div>
        <div
          v-if="item.end || $slots[`end-${index}`]"
          class="timeline-end"
          :class="{ 'timeline-box': modifier === 'timeline-box' || true }"
        >
          <slot :name="`end-${index}`" :item="item" :index="index">
            <slot name="end" :item="item" :index="index">
              {{ item.end }}
            </slot>
          </slot>
        </div>
        <hr v-if="index < items.length - 1" :class="getLineClass(index)" />
      </li>
    </template>

    <!-- Manual mode -->
    <template v-else>
      <slot></slot>
    </template>
  </ul>
</template> 