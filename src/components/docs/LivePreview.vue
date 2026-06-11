<script lang="ts">
import { defineComponent, compile, h, ref, reactive, computed, watch, type Component, type Ref } from 'vue'
import * as CornetComponents from 'cornet-ui'

const duComponents = Object.fromEntries(
  Object.entries(CornetComponents).filter(
    ([name, comp]) =>
      name.startsWith('Du') && comp && typeof comp === 'object' && !Array.isArray(comp),
  ),
) as Record<string, Component>

const WRAPPER = `<div class="flex items-center justify-center flex-wrap gap-3 min-h-20 w-full">`

function useResize(initialWidth = 500, min = 240, max = 900): {
  width: Ref<number>
  onResizeStart: (e: PointerEvent) => void
} {
  const width = ref(initialWidth)

  function onResizeStart(e: PointerEvent) {
    const startX = e.clientX
    const startWidth = width.value

    function onMove(ev: PointerEvent) {
      width.value = Math.max(min, Math.min(max, startWidth + ev.clientX - startX))
    }
    function onEnd() {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', onEnd)
    }

    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', onEnd)
    e.preventDefault()
  }

  return { width, onResizeStart }
}

export default defineComponent({
  props: {
    code: { type: String, required: true },
    script: { type: String, default: '' },
  },
  components: duComponents,
  setup(props) {
    if (props.script) {
      // eslint-disable-next-line no-new-func
      const setupFn = new Function('ref', 'reactive', 'computed', 'watch', 'useResize', props.script)

      const DynamicComp = defineComponent({
        components: duComponents,
        setup() {
          return setupFn(ref, reactive, computed, watch, useResize)
        },
        template: `${WRAPPER}${props.code}</div>`,
      })

      return () => h(DynamicComp)
    }

    return (...args: any[]) => {
      const fn = compile(
        `${WRAPPER}${props.code}</div>`,
      ) as unknown as (...a: any[]) => unknown
      return fn(...args)
    }
  },
})
</script>