<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    rotate?: boolean
    flip?: boolean
    useCheckbox?: boolean
  }>(),
  {
    modelValue: false,
    rotate: false,
    flip: false,
    useCheckbox: true,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const internalActive = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  internalActive.value = val
})

const isActive = computed({
  get: () => internalActive.value,
  set: (value) => {
    internalActive.value = value
    emit('update:modelValue', value)
  },
})

const classes = computed(() => ({
  'swap-rotate': props.rotate,
  'swap-flip': props.flip,
}))
</script>

<template>
  <label v-if="useCheckbox" class="swap" :class="classes">
    <input
      type="checkbox"
      v-model="isActive"
      :indeterminate="$slots.indeterminate ? true : false"
    />
    <div class="swap-on">
      <slot name="on" />
    </div>
    <div class="swap-off">
      <slot name="off" />
    </div>
    <div v-if="$slots.indeterminate" class="swap-indeterminate">
      <slot name="indeterminate" />
    </div>
  </label>
  <div v-else class="swap" :class="[classes, { 'swap-active': isActive }]" @click="isActive = !isActive">
    <div class="swap-on">
      <slot name="on" />
    </div>
    <div class="swap-off">
      <slot name="off" />
    </div>
  </div>
</template> 