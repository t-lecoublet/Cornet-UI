<script setup lang="ts">
import { computed } from 'vue'
import { useSizeMapping } from '../../../composables/useSizeProps'
import { type Variant, useVariantMapping } from '../../../composables/useVariantProps'
import { type DuFabProps } from './du-fab.types'
import DuButton from '../du-button/du-button.vue'
import DuTooltip from '../../Feedback/du-tooltip/du-tooltip.vue'

const props = withDefaults(
  defineProps<DuFabProps>(),
  {
    items: undefined,
    modifier: undefined,
    customClass: '',
    size: 'lg',
    variant: 'primary',
    circle: true,
    mainAction: undefined,
    closeButton: undefined,
    absolute: true,
    position: 'bottom-right',
  },
)

const { sizeClass } = useSizeMapping(props, 'btn')
const { colorClass } = useVariantMapping(props, 'btn')

const modifierClass = computed(() => {
  return props.modifier ? props.modifier : ''
})

const positionClass = computed(() => {
  if (!props.absolute) return ''
  
  switch (props.position) {
    case 'bottom-right':
      return 'absolute bottom-4 right-4'
    case 'bottom-left':
      return 'absolute bottom-4 left-4'
    case 'top-right':
      return 'absolute top-4 right-4'
    case 'top-left':
      return 'absolute top-4 left-4'
    default:
      return 'absolute bottom-4 right-4'
  }
})

const fabClasses = computed(() => {
  return [
    'fab',
    modifierClass.value,
    positionClass.value,
    'z-50',
    props.customClass,
  ]
})

const getTooltipPosition = (position?: 'left' | 'top' | 'right' | 'bottom') => {
  return position || 'left'
}
</script>

<template>
  <!-- Dynamic items mode -->
  <template v-if="items || mainAction">
    <div :class="fabClasses">
      <!-- Main trigger button -->
      <div
        tabindex="0"
        role="button"
        :class="[
          'btn',
          sizeClass,
          colorClass,
          props.circle ? 'btn-circle' : '',
        ]"
      >
        <slot name="trigger">
          <slot name="trigger-icon">F</slot>
        </slot>
      </div>

      <!-- Close button (optional) -->
      <div
        v-if="closeButton"
        class="fab-close"
      >
        <slot name="close-button" :closeButton="closeButton">
          {{ closeButton.label || 'Close' }}
          <span
            :class="[
              'btn',
              sizeClass,
              'btn-circle',
              closeButton.variant ? `btn-${closeButton.variant}` : 'btn-error',
              closeButton.customClass,
            ]"
          >
            <slot name="close-icon">{{ closeButton.icon || '✕' }}</slot>
          </span>
        </slot>
      </div>

      <!-- Main action button (optional) -->
      <DuButton
        v-if="mainAction"
        as="button"
        customClass="fab-main-action"
        :size="props.size"
        :variant="(mainAction.variant as Variant) || 'default'"
        circle
        @click="mainAction.onClick"
      >
        <slot name="main-action" :mainAction="mainAction">
          <slot name="main-action-icon" :mainAction="mainAction">
            <component
              class="w-6 h-6"
              :is="mainAction.icon"
              v-if="typeof mainAction.icon === 'object' || typeof mainAction.icon === 'function'"
            />
            <img
              v-else-if="typeof mainAction.icon === 'string' && mainAction.icon.startsWith('http')"
              :src="mainAction.icon"
              :alt="mainAction.label"
              class="w-6 h-6"
            />
            <div
              v-else-if="typeof mainAction.icon === 'string'"
              v-html="mainAction.icon"
            ></div>
            <template v-else>
              {{ mainAction.label || 'M' }}
            </template>
          </slot>
        </slot>
      </DuButton>

      <!-- Speed dial buttons -->
      <template v-for="(item, index) in items" :key="index">
        <!-- With tooltip wrapper -->
        <DuTooltip
          v-if="item.tooltip"
          :dataTip="item.tooltip"
          :position="getTooltipPosition(item.tooltipPosition)"
        >
          <DuButton
            as="button"
            :size="props.size"
            :circle="props.circle"
            :customClass="item.customClass"
            @click="item.onClick"
          >
            <slot name="item" :item="item" :index="index">
              <slot :name="`item-${index}`" :item="item" :index="index">
                <component
                  class="w-6 h-6"
                  :is="item.icon"
                  v-if="typeof item.icon === 'object' || typeof item.icon === 'function'"
                />
                <img
                  v-else-if="typeof item.icon === 'string' && item.icon.startsWith('http')"
                  :src="item.icon"
                  :alt="item.label"
                  class="w-6 h-6"
                />
                <div
                  v-else-if="typeof item.icon === 'string'"
                  v-html="item.icon"
                ></div>
                <template v-else>
                  {{ item.label || index + 1 }}
                </template>
              </slot>
            </slot>
          </DuButton>
        </DuTooltip>

        <!-- Without tooltip wrapper -->
        <template v-else>
          <!-- With label wrapper -->
          <div v-if="item.label && !props.modifier">
            {{ item.label }}
            <DuButton
              as="button"
              :size="props.size"
              :circle="props.circle"
              :customClass="item.customClass"
              @click="item.onClick"
            >
              <slot name="item" :item="item" :index="index">
                <slot :name="`item-${index}`" :item="item" :index="index">
                  <component
                    class="w-6 h-6"
                    :is="item.icon"
                    v-if="typeof item.icon === 'object' || typeof item.icon === 'function'"
                  />
                  <img
                    v-else-if="typeof item.icon === 'string' && item.icon.startsWith('http')"
                    :src="item.icon"
                    :alt="item.label"
                    class="w-6 h-6"
                  />
                  <div
                    v-else-if="typeof item.icon === 'string'"
                    v-html="item.icon"
                  ></div>
                  <template v-else>
                    {{ index + 1 }}
                  </template>
                </slot>
              </slot>
            </DuButton>
          </div>

          <!-- Without label wrapper -->
          <DuButton
            v-else
            as="button"
            :size="props.size"
            :circle="props.circle"
            :customClass="item.customClass"
            @click="item.onClick"
          >
            <slot name="item" :item="item" :index="index">
              <slot :name="`item-${index}`" :item="item" :index="index">
                <component
                  class="w-6 h-6"
                  :is="item.icon"
                  v-if="typeof item.icon === 'object' || typeof item.icon === 'function'"
                />
                <img
                  v-else-if="typeof item.icon === 'string' && item.icon.startsWith('http')"
                  :src="item.icon"
                  :alt="item.label"
                  class="w-6 h-6"
                />
                <div
                  v-else-if="typeof item.icon === 'string'"
                  v-html="item.icon"
                ></div>
                <template v-else>
                  {{ item.label || index + 1 }}
                </template>
              </slot>
            </slot>
          </DuButton>
        </template>
      </template>
    </div>
  </template>

  <!-- Manual mode -->
  <template v-else>
    <div :class="fabClasses">
      <slot></slot>
    </div>
  </template>
</template>
