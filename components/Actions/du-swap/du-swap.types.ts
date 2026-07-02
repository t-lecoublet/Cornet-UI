export const SWAP_PROPERTIES = ['swap-rotate', 'swap-flip', 'swap-active'] as const

export type DuSwapProperty = (typeof SWAP_PROPERTIES)[number] 