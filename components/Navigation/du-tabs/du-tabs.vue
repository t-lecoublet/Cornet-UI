<script setup lang="ts">
// WAI-ARIA tabs pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
//
// daisyUI 5 already styles `.tab[aria-selected=true]` and reveals the
// `.tab-content` next to it, so the selected state is carried by the very
// attribute a screen reader reads — no second source of truth to drift.
//
// KNOWN GAP: that reveal is `.tabs > .tab + .tab-content`, so a panel has to be
// a child of the tablist — and a `tablist` may own only `tab`s. axe reports it
// (`aria-required-children`), and `aria-owns` does not satisfy the rule. Fixing
// it means rendering the panels outside `.tabs` and giving up daisyUI's panel
// box styling (borders, radius, the lift join), which is a product decision
// rather than an implementation one. Recorded in tests/a11y.spec.ts.
import { computed, ref, useSlots, watch } from 'vue'
import { useRovingIndex } from '../../core/navigation'
import { useComponentId, useControllableState } from '../../core/shared'
import { useSizeMapping } from '../../../composables/useSizeProps'
import { iconAsText, resolveIconKind } from '../../../composables/useIconSource'
import {
  type DuTabItem,
  type DuTabValue,
  type DuTabsEmit,
  type DuTabsProps,
} from './du-tabs.types'

const props = withDefaults(
  defineProps<DuTabsProps>(),
  {
    size: 'default',
    items: undefined,
    type: undefined,
    bottom: false,
    // No default: a `modelValue` that is always defined would mean the tabs are
    // permanently controlled and could never move on their own.
    modelValue: undefined,
    activation: 'automatic',
    ariaLabel: undefined,
  },
)

const emit = defineEmits<DuTabsEmit>()

const slots = useSlots()

const instanceId = useComponentId(undefined, 'tabs')
const tabId = (index: number) => `${instanceId}-tab-${index}`
const panelId = (index: number) => `${instanceId}-panel-${index}`

/** An item's identity: its own `value` when it has one, else its position. */
const valueOf = (item: DuTabItem, index: number): DuTabValue => item.value ?? index

const isDisabled = (item: DuTabItem) => item.disabled === true

/** Where an uncontrolled tab group starts: the item marked active, else the first usable one. */
const initialValue = computed<DuTabValue>(() => {
  const list = props.items ?? []
  const marked = list.findIndex((item) => item.active === true && !isDisabled(item))
  const first = marked >= 0 ? marked : list.findIndex((item) => !isDisabled(item))
  return first >= 0 ? valueOf(list[first]!, first) : 0
})

const selected = useControllableState<DuTabValue>(
  () => props.modelValue,
  (value) => emit('update:modelValue', value),
  initialValue.value,
)

const isSelected = (item: DuTabItem, index: number) => valueOf(item, index) === selected.value

function select(item: DuTabItem, index: number) {
  if (isDisabled(item)) {
    return
  }
  selected.value = valueOf(item, index)
  item.onClick?.()
}

/**
 * Whether this item has a panel to point at. `aria-controls` naming an element
 * that is not there is worse than omitting it: it is a broken reference, and
 * axe reports it as one.
 */
const hasPanel = (item: DuTabItem, index: number) => (
  Boolean(item.content) || slots.content != null || slots[`content-${index}`] != null
)

// --- keyboard ---------------------------------------------------------------
const tablist = ref<HTMLElement | null>(null)

const roving = useRovingIndex({
  items: () => [...(tablist.value?.querySelectorAll<HTMLElement>('[role="tab"]') ?? [])],
  orientation: () => 'horizontal',
  isDisabled: (el) => el.getAttribute('aria-disabled') === 'true',
})

function onKeydown(event: KeyboardEvent) {
  // daisyUI's `.tab + .tab-content` reveal keeps the panels inside the tablist
  // (see the header note), so keydowns from anywhere in a panel bubble here.
  // The tab keyboard interface only speaks for the tabs themselves: anything
  // typed inside a panel — spaces in a textarea, arrows to move the caret —
  // belongs to it.
  if (!(event.target instanceof Element) || event.target.closest('[role="tab"]') == null) {
    return
  }

  const list = props.items ?? []

  // Manual activation: the arrows only move focus, Enter or Space commits.
  if (event.key === 'Enter' || event.key === ' ') {
    const index = roving.activeIndex.value
    const item = list[index]
    if (item != null) {
      event.preventDefault()
      select(item, index)
    }
    return
  }

  if (!roving.onKeydown(event)) {
    return
  }
  event.preventDefault()

  if (props.activation === 'automatic') {
    const index = roving.activeIndex.value
    const item = list[index]
    if (item != null) {
      select(item, index)
    }
  }
}

/**
 * The tab stop follows the selection, not the last thing focused: Tab into a
 * tab list lands on the tab that is showing, which is the APG's rule and the
 * only one that makes sense to someone arriving from elsewhere on the page.
 */
function tabIndexFor(item: DuTabItem, index: number): 0 | -1 {
  return isSelected(item, index) && !isDisabled(item) ? 0 : -1
}

// Attached only in items mode: in manual mode the consumer owns the roles, and
// with them the keyboard.
watch([tablist, () => props.items != null && slots.default == null], ([el, owned], _old, onCleanup) => {
  if (el == null || !owned) {
    return
  }
  el.addEventListener('keydown', onKeydown)
  onCleanup(() => el.removeEventListener('keydown', onKeydown))
  // Sync flush: the ref is filled during mount, and the listener has to be in
  // place by the time the component is usable, not a tick later.
}, { immediate: true, flush: 'sync' })

// --- presentation -----------------------------------------------------------
const { sizeClass } = useSizeMapping(props, 'tabs')

const TYPE_CLASSES: Record<string, string> = {
  lift: 'tabs-lift',
  border: 'tabs-border',
  box: 'tabs-box',
}

const typeClass = computed(() => TYPE_CLASSES[props.type ?? ''] ?? '')

const placementClass = computed(() => (props.bottom ? 'tabs-bottom' : ''))


defineSlots<{
  default?: () => unknown
  tab?: (props: { item: DuTabItem, index: number }) => unknown
  icon?: (props: { item: DuTabItem }) => unknown
  content?: (props: { item: DuTabItem, index: number }) => unknown
  [key: string]: ((props: { item: DuTabItem, index: number }) => unknown) | undefined
}>()
</script>

<template>
  <div
    ref="tablist"
    :class="['tabs', sizeClass, typeClass, placementClass]"
    :role="$slots.default ? undefined : 'tablist'"
    :aria-label="ariaLabel"
  >
    <!-- Manual mode: the consumer writes the whole thing, roles included. -->
    <slot v-if="$slots.default" />

    <template v-else-if="items">
      <template v-for="(item, index) in items" :key="index">
        <!-- `.tab-content` must stay the adjacent sibling of its `.tab`:
             that is how daisyUI reveals the selected panel. -->
        <button
          :id="tabId(index)"
          type="button"
          role="tab"
          :class="['tab', item.disabled && 'tab-disabled', item.class]"
          :aria-selected="isSelected(item, index)"
          :aria-controls="hasPanel(item, index) ? panelId(index) : undefined"
          :aria-disabled="item.disabled ? true : undefined"
          :tabindex="tabIndexFor(item, index)"
          @click="select(item, index)"
        >
          <slot v-if="$slots[`tab-${index}`]" :name="`tab-${index}`" :item="item" :index="index" />
          <slot v-else-if="$slots.tab" name="tab" :item="item" :index="index" />
          <template v-else>
            <slot name="icon" :item="item">
              <component
                :is="item.icon"
                v-if="resolveIconKind(item.icon) === 'component'"
                class="w-5 h-5"
              />
              <img
                v-else-if="resolveIconKind(item.icon) === 'image'"
                class="w-5 h-5"
                :src="iconAsText(item.icon)"
                :alt="item.label"
              />
              <div
                v-else-if="resolveIconKind(item.icon) === 'html'"
                v-html="iconAsText(item.icon)"
              ></div>
            </slot>
            {{ item.label }}
          </template>
        </button>

        <div
          v-if="hasPanel(item, index)"
          :id="panelId(index)"
          role="tabpanel"
          class="tab-content"
          :aria-labelledby="tabId(index)"
          tabindex="0"
        >
          <slot v-if="$slots[`content-${index}`]" :name="`content-${index}`" :item="item" :index="index" />
          <slot v-else-if="$slots.content" name="content" :item="item" :index="index" />
          <template v-else>{{ item.content }}</template>
        </div>
      </template>
    </template>
  </div>
</template>
