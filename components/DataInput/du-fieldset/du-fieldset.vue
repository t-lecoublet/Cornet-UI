<script setup lang="ts">
import { type FIELDSETProps } from './du-fieldset.types'

withDefaults(
  defineProps<FIELDSETProps>(),
  {},
)
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">{{ legend }}</legend>
    <slot />
    <p class="fieldset-label" v-if="label">{{ label }}</p>
  </fieldset>
</template> 