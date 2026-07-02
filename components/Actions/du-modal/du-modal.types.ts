export const MODAL_PLACEMENTS = [
  'modal-top',
  'modal-middle',
  'modal-bottom',
  'modal-start',
  'modal-end',
  'modal-bottom sm:modal-middle'
] as const

export type DuModalPlacement = (typeof MODAL_PLACEMENTS)[number]

export interface DuModalProps {
  id?: string
  open?: boolean
  closeButton?: boolean
  closeOnEscape?: boolean
  closeBackdrop?: boolean
  placement?: 'top' | 'middle' | 'bottom' | 'start' | 'end' | 'responsive'
  classBox?: string
  /** Accessible name of the dialog (use when there is no visible title). */
  ariaLabel?: string
  /** id of the element naming the dialog (e.g. your title element). */
  ariaLabelledby?: string
  /** Accessible label of the close button and backdrop. */
  closeLabel?: string
}