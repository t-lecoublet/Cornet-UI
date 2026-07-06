export interface DuStatItem {
  title?: string
  value?: string | number
  description?: string
  figure?: any
  figureClass?: string
  valueClass?: string
  descClass?: string
  titleClass?: string
  actions?: any
  [key: string]: any
}

export interface DuStatProps {
  figureClass?: string
  valueClass?: string
  descClass?: string
  titleClass?: string
}