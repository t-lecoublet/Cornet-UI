<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    id?: string
    open?: boolean
    closeButton?: boolean
    closeOnEscape?: boolean
    closeBackdrop?: boolean
    placement?: 'top' | 'middle' | 'bottom' | 'start' | 'end' | 'responsive'
    classBox?: string
  }>(),
  {
    id: undefined,
    open: false,
    closeButton: false,
    closeOnEscape: true,
    closeBackdrop: true,
    placement: 'middle',
    classBox: '',
  },
)

const dialogRef = ref<HTMLDialogElement | null>(null)

const placementClass = computed(() => {
  switch (props.placement) {
    case 'top':
      return 'modal-top'
    case 'middle':
      return 'modal-middle'
    case 'bottom':
      return 'modal-bottom'
    case 'start':
      return 'modal-start'
    case 'end':
      return 'modal-end'
    case 'responsive':
      return 'modal-bottom sm:modal-middle'
    default:
      return ''
  }
})

const showModal = () => {
  if (dialogRef.value) {
    dialogRef.value.showModal()
  }
}

const closeModal = () => {
  if (dialogRef.value) {
    dialogRef.value.close()
  }
}

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

defineExpose({
  showModal,
  closeModal,
})

onMounted(() => {
  if (props.open && dialogRef.value) {
    showModal()
  }
})

watch(
  () => props.open,
  (newValue: boolean) => {
    if (newValue && dialogRef.value) {
      showModal()
    } else if (!newValue && dialogRef.value) {
      closeModal()
    }
  },
)

function handleEscapeKey(_event: KeyboardEvent) {
  if (props.closeOnEscape) {
    closeModal()
  }
}
</script>

<template>
  <dialog
    ref="dialogRef"
    :id="id"
    :class="['modal', placementClass]"
    @keydown.esc.prevent="handleEscapeKey"
    @close="emit('update:open', false)"
  >
    <div :class="['modal-box', classBox]">
      <form v-if="closeButton" method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
      </form>
      <slot></slot>
      <div class="modal-action" v-if="$slots.actions"><slot name="actions"> </slot></div>
    </div>
    <form v-if="closeBackdrop" method="dialog" class="modal-backdrop">
      <button>Close</button>
    </form>
  </dialog>
</template> 