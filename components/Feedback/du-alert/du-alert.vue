<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { type DuAlertProps } from "./du-alert.types";


const props = withDefaults(
  defineProps<DuAlertProps>(),
  {
    variant: "default",
    direction: "default",
    soft: false,
    outline: false,
    dash: false,
    dismissible: false,
    autoDismissible: false,
    icon: true,
  },
);

const emit = defineEmits<{
  close: [];
}>();

// Détermine si l'alerte est visible
const visible = ref(true);

const dismiss = () => {
  visible.value = false;
  emit("close");
};

onMounted(() => {
  if (props.autoDismissible) {
    setTimeout(dismiss, 5000);
  }
});

// Détermine la classe CSS en fonction du type d'alerte
const alertColorClass = computed(() => {
  return {
    default: "",
    success: "alert-success",
    error: "alert-error",
    warning: "alert-warning",
    info: "alert-info",
  }[props.variant];
});

const directionClass = computed(() => {
  return {
    default: "",
    vertical: "alert-vertical",
    horizontal: "alert-horizontal",
    responsive: "alert-vertical sm:alert-horizontal",
  }[props.direction];
});

const softClass = computed(() => {
  return props.soft ? "alert-soft" : "";
});

const outlineClass = computed(() => {
  return props.outline ? "alert-outline" : "";
});

const dashClass = computed(() => {
  return props.dash ? "alert-dash" : "";
});

// SVG en fonction du type d'alerte
const svgIcons = {
  default: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info h-6 w-6 shrink-0">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>`,
  success: `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>`,
  error: `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>`,
  warning: `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>`,
  info: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="h-6 w-6 shrink-0 stroke-current">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>`,
};
</script>

<template>
  <div role="alert" v-if="visible" :class="[
    'alert',
    alertColorClass,
    softClass,
    outlineClass,
    dashClass,
    directionClass,
  ]">
    <template v-if="icon"><span v-html="svgIcons[variant]"></span></template>
    <slot>Default alert</slot>
    <div v-if="$slots.actions || dismissible">
      <slot name="actions"></slot>
      <button v-if="dismissible" @click="dismiss" class="btn btn-sm btn-square btn-ghost">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15">
          <path fill="currentColor"
            d="M3.64 2.27L7.5 6.13l3.84-3.84A.92.92 0 0 1 12 2a1 1 0 0 1 1 1a.9.9 0 0 1-.27.66L8.84 7.5l3.89 3.89A.9.9 0 0 1 13 12a1 1 0 0 1-1 1a.92.92 0 0 1-.69-.27L7.5 8.87l-3.85 3.85A.92.92 0 0 1 3 13a1 1 0 0 1-1-1a.9.9 0 0 1 .27-.66L6.16 7.5L2.27 3.61A.9.9 0 0 1 2 3a1 1 0 0 1 1-1c.24.003.47.1.64.27" />
        </svg>
      </button>
    </div>
  </div>
</template>