export const DU_JOIN_DIRECTIONS = ["horizontal", "vertical"] as const;
export type DuJoinDirection = (typeof DU_JOIN_DIRECTIONS)[number];

export interface DuJoinProps {
  as?: string;
  direction?: DuJoinDirection;
} 