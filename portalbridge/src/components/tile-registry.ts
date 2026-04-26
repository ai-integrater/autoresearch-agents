import type { ComponentType } from "react";
import type { TileType } from "@/types";
import { MeTile } from "./tiles/me-tile";
import { UsersCountTile } from "./tiles/users-count-tile";

interface TileDefinition {
  type: TileType;
  label: string;
  defaultSize: { w: number; h: number };
  Component: ComponentType;
  // Set to true once the tile requires admin consent.
  requiresAdminConsent?: boolean;
}

export const TILE_REGISTRY: Record<TileType, TileDefinition> = {
  "me": {
    type: "me",
    label: "My profile",
    defaultSize: { w: 4, h: 3 },
    Component: MeTile,
  },
  "users-count": {
    type: "users-count",
    label: "User count",
    defaultSize: { w: 3, h: 2 },
    Component: UsersCountTile,
    requiresAdminConsent: true,
  },
};

export const ALL_TILE_TYPES: TileType[] = Object.keys(TILE_REGISTRY) as TileType[];
