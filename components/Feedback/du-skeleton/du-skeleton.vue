<script setup lang="ts">
import { type DuSkeletonProps } from "./du-skeleton.types";

const props = defineProps<DuSkeletonProps>();
</script>

<template>
  <div :class="['skeleton', props.class]">
    <slot></slot>
  </div>
</template> 