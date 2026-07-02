export const DU_TOAST_HORIZONTAL_POSITIONS = ["start", "center", "end"] as const;
export type DuToastHorizontalPosition = (typeof DU_TOAST_HORIZONTAL_POSITIONS)[number];

export const DU_TOAST_VERTICAL_POSITIONS = ["top", "middle", "bottom"] as const;
export type DuToastVerticalPosition = (typeof DU_TOAST_VERTICAL_POSITIONS)[number];

export interface DuToastProps {
  horizontalPosition?: DuToastHorizontalPosition;
  verticalPosition?: DuToastVerticalPosition;
  to?: string;
} 