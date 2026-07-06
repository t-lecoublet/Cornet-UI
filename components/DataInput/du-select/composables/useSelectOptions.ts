interface SelectOptionsAdapterProps {
  trackBy: string
  labelBy: string
  options: any[]
}

/** Adapts arbitrary option values/objects to a consistent value/label shape via trackBy/labelBy. */
export function useSelectOptions(props: SelectOptionsAdapterProps) {
  function optionValue(opt: any): any {
    if (opt && typeof opt === 'object') return opt[props.trackBy] ?? opt.value ?? opt.id ?? opt
    return opt
  }

  function optionLabel(opt: any): string {
    if (opt && typeof opt === 'object') return opt[props.labelBy] ?? opt.label ?? opt.name ?? String(opt)
    return String(opt)
  }

  function labelFromOption(opt: any): string {
    return optionLabel(opt)
  }

  function optionFromValue(v: any): any {
    return props.options.find((o) => optionValue(o) === v) ?? v
  }

  function labelFromValue(val: any): string {
    const o = props.options.find((o) => optionValue(o) === val)
    return o ? optionLabel(o) : String(val)
  }

  function keyForOption(opt: any, i: number): string {
    return `${String(optionValue(opt))}__${i}`
  }

  function valKey(val: any, idx: number): string {
    return `${String(val)}__${idx}`
  }

  return { optionValue, optionLabel, labelFromOption, labelFromValue, keyForOption, valKey, optionFromValue }
}
