export type TileType = "me" | "users-count";

export interface TileInstance {
  id: string;
  type: TileType;
  // grid coords (react-grid-layout)
  x: number;
  y: number;
  w: number;
  h: number;
  // optional per-tile config payload
  config?: Record<string, unknown>;
}

export interface DashboardLayout {
  version: 1;
  userId: string;
  tiles: TileInstance[];
}

export const DEFAULT_LAYOUT: Omit<DashboardLayout, "userId"> = {
  version: 1,
  tiles: [
    { id: "me-1", type: "me", x: 0, y: 0, w: 4, h: 3 },
    { id: "users-1", type: "users-count", x: 4, y: 0, w: 3, h: 2 },
  ],
};
