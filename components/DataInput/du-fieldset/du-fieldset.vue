<script setup lang="ts">
import { type DuFieldsetProps } from './du-fieldset.types'

withDefaults(
  defineProps<DuFieldsetProps>(),
  {},
)
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend" v-if="legend">{{ legend }}</legend>
    <slot />
    <p class="fieldset-label" v-if="label">{{ label }}</p>
  </fieldset>
</template> 