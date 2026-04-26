"use client";

import { useEffect, useMemo, useState } from "react";
import GridLayout, { type Layout } from "react-grid-layout";
import { useAccount } from "@azure/msal-react";
import { layoutStore } from "@/lib/layout-store";
import { TILE_REGISTRY, ALL_TILE_TYPES } from "./tile-registry";
import type { DashboardLayout, TileInstance, TileType } from "@/types";

const COLS = 12;
const ROW_HEIGHT = 64;

export function DashboardGrid() {
  const account = useAccount();
  const userId = account?.homeAccountId ?? "anonymous";

  const [layout, setLayout] = useState<DashboardLayout | null>(null);
  const [width, setWidth] = useState<number>(1200);

  useEffect(() => {
    layoutStore.load(userId).then(setLayout);
  }, [userId]);

  useEffect(() => {
    const onResize = () => setWidth(Math.max(360, window.innerWidth - 64));
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const gridItems = useMemo<Layout[]>(
    () =>
      (layout?.tiles ?? []).map((t) => ({
        i: t.id,
        x: t.x,
        y: t.y,
        w: t.w,
        h: t.h,
        minW: 2,
        minH: 2,
      })),
    [layout],
  );

  if (!layout) {
    return <p className="text-sm text-zinc-500">Loading layout…</p>;
  }

  const handleLayoutChange = (next: Layout[]) => {
    const updated: DashboardLayout = {
      ...layout,
      tiles: layout.tiles.map((t) => {
        const match = next.find((n) => n.i === t.id);
        return match ? { ...t, x: match.x, y: match.y, w: match.w, h: match.h } : t;
      }),
    };
    setLayout(updated);
    void layoutStore.save(updated);
  };

  const addTile = (type: TileType) => {
    const def = TILE_REGISTRY[type];
    const id = `${type}-${Date.now()}`;
    const maxY = Math.max(0, ...layout.tiles.map((t) => t.y + t.h));
    const tile: TileInstance = {
      id,
      type,
      x: 0,
      y: maxY,
      w: def.defaultSize.w,
      h: def.defaultSize.h,
    };
    const updated = { ...layout, tiles: [...layout.tiles, tile] };
    setLayout(updated);
    void layoutStore.save(updated);
  };

  const removeTile = (id: string) => {
    const updated = { ...layout, tiles: layout.tiles.filter((t) => t.id !== id) };
    setLayout(updated);
    void layoutStore.save(updated);
  };

  const resetLayout = async () => {
    const fresh = await layoutStore.reset(userId);
    setLayout(fresh);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {ALL_TILE_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => addTile(type)}
            className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-zinc-300 hover:border-accent hover:text-white"
          >
            + {TILE_REGISTRY[type].label}
          </button>
        ))}
        <button
          onClick={resetLayout}
          className="ml-auto rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
        >
          Reset layout
        </button>
      </div>

      <GridLayout
        className="layout"
        layout={gridItems}
        cols={COLS}
        rowHeight={ROW_HEIGHT}
        width={width}
        onLayoutChange={handleLayoutChange}
        draggableHandle=".tile-drag-handle"
        compactType="vertical"
      >
        {layout.tiles.map((tile) => {
          const def = TILE_REGISTRY[tile.type];
          if (!def) return null;
          const Component = def.Component;
          return (
            <div key={tile.id} className="group relative">
              <div className="tile-drag-handle absolute left-0 right-0 top-0 z-10 h-6 cursor-move rounded-t-xl" />
              <button
                onClick={() => removeTile(tile.id)}
                className="absolute right-2 top-2 z-20 rounded px-1.5 py-0.5 text-xs text-zinc-500 opacity-0 transition group-hover:opacity-100 hover:bg-border hover:text-white"
                aria-label="Remove tile"
              >
                ×
              </button>
              <Component />
            </div>
          );
        })}
      </GridLayout>
    </div>
  );
}
