<script lang="ts" setup>
import { computed } from "vue";
import DuJoin from "../../Layout/du-join/du-join.vue";
import { type DuPaginationProps } from './du-pagination.types';
import { useSizeMapping } from "../../../composables/useSizeProps";
import { useVariantMapping } from "../../../composables/useVariantProps";
import { usePaginationPages } from "./composables/usePaginationPages";

const props = withDefaults(
  defineProps<DuPaginationProps>(),
  {
    modelValue: 1,
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

const { sizeClass } = useSizeMapping({ size: props.size }, "btn");
const { colorClass } = useVariantMapping({ variant: props.variant }, "btn");

const outlineClass = computed(() => {
  return props.outline ? "btn-outline" : "";
});

const softClass = computed(() => {
  return props.soft ? "btn-soft" : "";
});

const { totalPages, pages } = usePaginationPages(props);

function changePage(page: number | string) {
  if (typeof page === "number") {
    emit("update:modelValue", page);
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
          { 'btn-disabled': modelValue <= 1 },
        ]" @click="changePage(1)" :disabled="modelValue <= 1" :aria-label="firstAriaLabel">
          <slot name="first">{{ firstLabel }}</slot>
        </button>

        <button v-if="showPrevious" class="join-item btn" :class="[
          sizeClass,
          colorClass,
          outlineClass,
          softClass,
          { 'btn-disabled': modelValue <= 1 },
        ]" @click="changePage(modelValue - 1)" :disabled="modelValue <= 1" :aria-label="previousAriaLabel">
          <slot name="previous">{{ previousLabel }}</slot>
        </button>

        <button v-for="(page, i) in pages" :key="`${page}-${i}`" class="join-item btn" :class="[
          sizeClass,
          colorClass,
          outlineClass,
          softClass,
          { 'btn-active': page === modelValue },
          { 'btn-disabled': page === '...' },
        ]" @click="changePage(page)" :disabled="page === '...'"
          :aria-current="page === modelValue ? 'page' : undefined"
          :aria-hidden="page === '...' ? 'true' : undefined"
          :tabindex="page === '...' ? -1 : undefined">
          <slot :name="`page-${page}`">{{ page }}</slot>
        </button>

        <button v-if="showNext" class="join-item btn" :class="[
          sizeClass,
          colorClass,
          outlineClass,
          softClass,
          { 'btn-disabled': modelValue >= totalPages },
        ]" @click="changePage(modelValue + 1)" :disabled="modelValue >= totalPages" :aria-label="nextAriaLabel">
          <slot name="next">{{ nextLabel }}</slot>
        </button>

        <button v-if="showLast" class="join-item btn" :class="[
          sizeClass,
          colorClass,
          outlineClass,
          { 'btn-disabled': modelValue >= totalPages },
          softClass,
        ]" @click="changePage(totalPages)" :disabled="modelValue >= totalPages" :aria-label="lastAriaLabel">
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