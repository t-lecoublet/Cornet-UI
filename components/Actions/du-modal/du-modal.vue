<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { type DuModalProps } from './du-modal.types'

const props = withDefaults(
  defineProps<DuModalProps>(),
  {
    id: undefined,
    open: false,
    closeButton: false,
    closeOnEscape: true,
    closeBackdrop: true,
    placement: 'middle',
    classBox: '',
    ariaLabel: undefined,
    ariaLabelledby: undefined,
    closeLabel: 'Close',
  },
)

// The dialog carries a click handler for backdrop dismissal, which has no
// keyboard equivalent to miss: Escape closes it, natively and explicitly.
// (The lint exemption is in eslint.config.js — an inline one would have to
// sit above the root element, and a leading template comment makes the
// component a fragment that cannot inherit a consumer's attributes.)
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

// Escape belongs to the innermost thing that is open. A select or a search
// closes its list on the key and marks it handled before it bubbles up here;
// a dropdown listens on the document, after this listener, so its expanded
// trigger is what says the key is its own. Either way the dialog stays open.
function escapeClaimedInside(event: KeyboardEvent): boolean {
  return event.defaultPrevented
    || dialogRef.value?.querySelector('[aria-haspopup][aria-expanded="true"]') != null
}

function handleEscapeKey(event: KeyboardEvent) {
  const claimed = escapeClaimedInside(event)
  // Left alone, the browser closes the dialog itself: closing goes through
  // closeOnEscape and the check above instead.
  event.preventDefault()
  if (props.closeOnEscape && !claimed) {
    closeModal()
  }
}
</script>

<template>
  <dialog
    ref="dialogRef"
    :id="id"
    :class="['modal', placementClass]"
    :aria-label="ariaLabel"
    :aria-labelledby="ariaLabelledby"
    @keydown.esc="handleEscapeKey"
    @close="emit('update:open', false)"
  >
    <div :class="['modal-box', classBox]">
      <form v-if="closeButton" method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" :aria-label="closeLabel">
          ✕
        </button>
      </form>
      <slot></slot>
      <div class="modal-action" v-if="$slots.actions"><slot name="actions"> </slot></div>
    </div>
    <form v-if="closeBackdrop" method="dialog" class="modal-backdrop">
      <button>{{ closeLabel }}</button>
    </form>
  </dialog>
</template> 