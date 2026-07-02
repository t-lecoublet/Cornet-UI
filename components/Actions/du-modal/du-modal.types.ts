export const MODAL_PLACEMENTS = [
  'modal-top',
  'modal-middle',
  'modal-bottom',
  'modal-start',
  'modal-end',
  'modal-bottom sm:modal-middle'
] as const

export type DuModalPlacement = (typeof MODAL_PLACEMENTS)[number] 