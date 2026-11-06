<script lang="ts" setup>
import { computed, reactive } from "vue";
import DuJoin from "../../Layout/du-join/du-join.vue";
import { type DuPaginationProps } from './du-pagination.types';
import { useSizeMapping } from "../../../composables/useSizeProps";
import { useVariantMapping } from "../../../composables/useVariantProps";
import { usePaginationPages } from "./composables/usePaginationPages";
import { useControllableState } from "../../core/shared";

const props = withDefaults(
  defineProps<DuPaginationProps>(),
  {
    modelValue: undefined,
    perPage: 10,
    showNext: true,
    showPrevious: true,
    showFirst: false,
    showLast: false,
    size: "default",
    nextLabel: "»",
    previousLabel: "«",
    firstLabel: "«« ",
    lastLabel: " »»",
    variant: "default",
    outline: false,
    manual: false,
    showEllipsis: true,
    maxPages: 0,
    soft: false,
    ariaLabel: "Pagination",
    previousAriaLabel: "Previous page",
    nextAriaLabel: "Next page",
    firstAriaLabel: "First page",
    lastAriaLabel: "Last page",
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
}>();

const { sizeClass } = useSizeMapping(props, "btn");
const { colorClass } = useVariantMapping(props, "btn");

const outlineClass = computed(() => {
  return props.outline ? "btn-outline" : "";
});

const softClass = computed(() => {
  return props.soft ? "btn-soft" : "";
});

// Without `v-model` the pagination keeps its own page (§5): it used to default
// `modelValue` to 1 and only emit, so an uncontrolled pagination never moved.
const current = useControllableState(
  () => props.modelValue,
  (value) => emit("update:modelValue", value),
  1,
);

const { totalPages, pages } = usePaginationPages(reactive({
  get modelValue() { return current.value; },
  get total() { return props.total; },
  get perPage() { return props.perPage; },
  get maxPages() { return props.maxPages; },
  get showEllipsis() { return props.showEllipsis; },
}));

function changePage(page: number | string) {
  if (typeof page === "number") {
    current.value = page;
  }
}
</script>

<template>
  <nav :aria-label="ariaLabel">
    <DuJoin>
      <template v-if="manual">
        <slot></slot>
      </template>

      <template v-else>
        <button v-if="showFirst" class="join-item btn" :class="[
          sizeClass,
          colorClass,
          outlineClass,
          softClass,
          { 'btn-disabled': current <= 1 },
        ]" @click="changePage(1)" :disabled="current <= 1" :aria-label="firstAriaLabel">
          <slot name="first">{{ firstLabel }}</slot>
        </button>

        <button v-if="showPrevious" class="join-item btn" :class="[
          sizeClass,
          colorClass,
          outlineClass,
          softClass,
          { 'btn-disabled': current <= 1 },
        ]" @click="changePage(current - 1)" :disabled="current <= 1" :aria-label="previousAriaLabel">
          <slot name="previous">{{ previousLabel }}</slot>
        </button>

        <button v-for="(page, i) in pages" :key="`${page}-${i}`" class="join-item btn" :class="[
          sizeClass,
          colorClass,
          outlineClass,
          softClass,
          { 'btn-active': page === current },
          { 'btn-disabled': page === '...' },
        ]" @click="changePage(page)" :disabled="page === '...'"
          :aria-current="page === current ? 'page' : undefined"
          :aria-hidden="page === '...' ? 'true' : undefined"
          :tabindex="page === '...' ? -1 : undefined">
          <slot :name="`page-${page}`">{{ page }}</slot>
        </button>

        <button v-if="showNext" class="join-item btn" :class="[
          sizeClass,
          colorClass,
          outlineClass,
          softClass,
          { 'btn-disabled': current >= totalPages },
        ]" @click="changePage(current + 1)" :disabled="current >= totalPages" :aria-label="nextAriaLabel">
          <slot name="next">{{ nextLabel }}</slot>
        </button>

        <button v-if="showLast" class="join-item btn" :class="[
          sizeClass,
          colorClass,
          outlineClass,
          { 'btn-disabled': current >= totalPages },
          softClass,
        ]" @click="changePage(totalPages)" :disabled="current >= totalPages" :aria-label="lastAriaLabel">
          <slot name="last">{{ lastLabel }}</slot>
        </button>
      </template>
    </DuJoin>
  </nav>
</template>

<style scoped>
/* .btn.btn-disabled {
  background-color: color-mix(in oklab, var(--btn-bg) 75%, var(--color-base-100));
  --btn-fg: color-mix(in oklch, var(--btn-fg) 50%, var(--color-base-content));
} */

.btn.btn-active {
  --btn-bg: color-mix(in oklab, var(--btn-color) 50%, var(--color-base-100));
  --btn-fg: color-mix(in oklch, var(--color-base-content) 90%, #0000);
}

/* .btn.btn-outline.btn-disabled {
  --btn-bg: #0000;
  --btn-fg: color-mix(in oklch, var(--btn-color) 35%, #0000);
  --btn-border: var(--btn-color);
} */
</style>