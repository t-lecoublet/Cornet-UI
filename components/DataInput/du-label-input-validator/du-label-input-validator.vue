<script setup lang="ts">
import DuInputField from "../du-input-field/du-input-field.vue";
import DuLabel from "../du-label/du-label.vue";
import { type LabelInputValidatorProps } from "./du-label-input-validator.types";

defineOptions({ inheritAttrs: false })

const model = defineModel<string>()

withDefaults(defineProps<LabelInputValidatorProps>(), {
  type: "floating-label",
  required: false,
  placeholder: "",
  inputType: "text",
  disabled: false,
});
</script>

<template>
  <DuLabel :type="type" class="validator">
    <slot name="before" />
    <template v-if="type !== 'floating-label'">
      <slot />
    </template>
    <DuInputField
      v-bind="$attrs"
      v-model="model"
      :required="required"
      :pattern="pattern"
      :minlength="minlength"
      :maxlength="maxlength"
      :title="title"
      :type="inputType"
      :placeholder="placeholder"
      :disabled="disabled"
      :invalid="invalid"
      :size="size"
      :variant="variant"
      :ghost="ghost"
      :suggestionName="suggestionName"
      :suggestionList="suggestionList"
    />
    <span v-if="type === 'floating-label'">
      <slot />
    </span>
    <slot name="after" />
  </DuLabel>
  <p class="validator-hint" v-if="$slots.hint">
    <slot name="hint" />
  </p>
</template>
