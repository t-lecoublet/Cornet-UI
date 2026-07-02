export const DROPDOWN_PLACEMENTS = [
  'dropdown-start',
  'dropdown-center',
  'dropdown-end',
  'dropdown-top',
  'dropdown-bottom',
  'dropdown-left',
  'dropdown-right',
] as const

export type DuDropdownPlacement = (typeof DROPDOWN_PLACEMENTS)[number] 


export type DuDropdownPlacementValue = 'start' | 'center' | 'end' | 'top' | 'bottom' | 'left' | 'right'
export type DuDropdownPlacementInput = DuDropdownPlacementValue | string | DuDropdownPlacementValue[] | Partial<Record<DuDropdownPlacementValue, boolean>>