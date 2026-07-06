export const DU_ALERT_VARIANTS = ["default", "success", "error", "warning", "info"] as const;
export type DuAlertVariant = (typeof DU_ALERT_VARIANTS)[number];

export const DU_ALERT_DIRECTIONS = ["default", "vertical", "horizontal", "responsive"] as const;
export type DuAlertDirection = (typeof DU_ALERT_DIRECTIONS)[number];

export interface DuAlertProps {
  variant?: DuAlertVariant;
  direction?: DuAlertDirection;
  soft?: boolean;
  outline?: boolean;
  dash?: boolean;
  dismissible?: boolean;
  autoDismissible?: boolean;
  icon?: boolean;
} 