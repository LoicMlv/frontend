import React from "react";
import type { InitiativeEntry } from "../lib/types";
import { cn } from "../lib/cn";

type Props = { visible: boolean; order: InitiativeEntry[] };

export const CombatOverlay: React.FC<Props> = ({ visible, order }) => {
  return (
    <div className={cn(
      "fixed left-1/2 -translate-x-1/2 bottom-6 z-40 w-[90vw] md:w-[60vw] rounded-2xl border border-zinc-800 bg-zinc-900/95 backdrop-blur shadow-xl p-3",
      !visible && "hidden"
    )}>
      <div className="text-sm font-semibold mb-2">Initiative</div>
      <div className="flex flex-wrap gap-2">
        {order
          .sort((a, b) => a.order - b.order)
          .map((e) => (
            <div key={e.id} className={cn(
              "px-3 py-1.5 rounded-xl border text-sm",
              e.isPlayer ? "border-blue-400/30 bg-blue-400/10" : "border-zinc-700 bg-zinc-800/60"
            )}>
              <span className="font-medium">{e.name}</span>
              {typeof e.hp === "number" && <span className="ml-2 text-zinc-400">HP: {e.hp}</span>}
            </div>
          ))}
      </div>
    </div>
  );
};
