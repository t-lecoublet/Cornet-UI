<script setup lang="ts">
import { computed, provide } from "vue";
import DuButton from "../../Actions/du-button/du-button.vue";
import { type DuFilterProps } from "./du-filter.types";

const props = withDefaults(
  defineProps<DuFilterProps>(),
  {
    items: undefined,
    name: undefined,
  },
);

const filterName = computed(() => {
  return props.name || `filter-${Math.random().toString(36).substring(2, 9)}`;
});

provide("filterName", filterName);
</script>

<template>
  <div class="filter">
    <DuButton
      customClass="btn filter-reset"
      v-bind="props.buttonsArgs"
      :checked="true"
      label="×"
    />

    <!-- Dynamic items mode -->
    <template v-if="items">
      <DuButton
        v-for="(item, index) in items"
        :key="index"
        v-bind="props.buttonsArgs || item.buttonsArgs"
        :class="[item.customClass]"
        :checked="item.checked"
        :aria-label="item.title"
      />
    </template>

    <!-- Manual mode -->
    <template v-else>
      <slot></slot>
    </template>
  </div>
</template> 