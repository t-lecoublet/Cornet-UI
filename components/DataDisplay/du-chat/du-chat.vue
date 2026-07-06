<script setup lang="ts">
import { provide } from "vue";
import { type DuChatProps } from './du-chat.types';
import { type Variant } from '../../../composables/useVariantProps';

const props = withDefaults(
  defineProps<DuChatProps>(),
  {
    items: undefined,
    placement: "start",
    customClass: "",
  },
);

provide("defaultChatPlacement", props.placement);

const getPlacementClass = (itemPlacement: string | undefined) => {
  const finalPlacement = itemPlacement || props.placement;
  return finalPlacement === "end" ? "chat-end" : "chat-start";
};

// Mirrors useVariantMapping's convention (props.variant here is a plain,
// unprefixed Variant like du-chat-item.vue's — not already-prefixed).
const getBubbleClass = (variant: Variant | undefined) => {
  return variant && variant !== "default" ? `chat-bubble-${variant}` : "";
};
</script>

<template>
  <!-- Dynamic items mode -->
  <template v-if="items">
    <div
      v-for="(item, index) in items"
      :key="index"
      :class="[
        'chat',
        getPlacementClass(item.placement),
        item.customClass || customClass,
      ]"
    >
      <div
        v-if="item.image || $slots[`image-${index}`]"
        class="chat-image avatar"
      >
        <div class="w-10 rounded-full">
          <slot :name="`image-${index}`" :item="item" :index="index">
            <img v-if="item.image" :src="item.image" alt="Chat avatar" />
          </slot>
        </div>
      </div>

      <div v-if="item.header || $slots[`header-${index}`]" class="chat-header">
        <slot :name="`header-${index}`" :item="item" :index="index">
          {{ item.header }}
        </slot>
      </div>

      <div
        :class="['chat-bubble', getBubbleClass(item.variant)]"
      >
        <slot :name="`message-${index}`" :item="item" :index="index">
          {{ item.message }}
        </slot>
      </div>

      <div v-if="item.footer || $slots[`footer-${index}`]" class="chat-footer">
        <slot :name="`footer-${index}`" :item="item" :index="index">
          {{ item.footer }}
        </slot>
      </div>
    </div>
  </template>

  <!-- Manual mode -->
  <template v-else>
    <slot></slot>
  </template>
</template> 