export interface DocClassnameEntry {
  class: string
  desc: string
  default?: boolean
}

export interface DocClassnames {
  component?: DocClassnameEntry[]
  style?: DocClassnameEntry[]
  color?: DocClassnameEntry[]
  size?: DocClassnameEntry[]
  modifier?: DocClassnameEntry[]
  placement?: DocClassnameEntry[]
  animation?: DocClassnameEntry[]
}

export interface DocProp {
  title: string
  description: string
  type: string
  default?: string
  options?: string[]
  required?: boolean
}

export interface DocSlot {
  title: string
  description: string
  links?: DocLink[]
  preview?: string
  code?: string
}

export interface DocLink {
  label: string
  href: string
}

export interface DocSection {
  title: string
  description?: string
  links?: DocLink[]
  preview?: string
  code: string
  script?: string
  lang?: string
  showFor?: ('gitlab' | 'github' | 'npm')[]
}

export interface DocPageData {
  title: string
  description: string
  category: string
  source?: string
  props?: DocProp[]
  slots?: DocSlot[]
  classnames?: DocClassnames
  sections: DocSection[]
}
