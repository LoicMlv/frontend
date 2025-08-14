import React from "react";
import { Modal } from "./ui/Modal";
import type { CharacterView } from "../lib/types";

type Props = { open: boolean; onClose: () => void; character?: CharacterView | null };

export const CharacterSheetModal: React.FC<Props> = ({ open, onClose, character }) => {
  if (!character) return <Modal open={open} onClose={onClose} title="Personnage"><div>Chargement…</div></Modal>;

  return (
    <Modal open={open} onClose={onClose} title={`Fiche — ${character.name}`} size="xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <section className="md:col-span-2 space-y-4">
          {character.concept && <div><div className="text-sm text-zinc-400">Concept</div><div>{character.concept}</div></div>}
          {character.lore && <div><div className="text-sm text-zinc-400">Lore</div><div className="whitespace-pre-wrap">{character.lore}</div></div>}

          <div>
            <div className="text-sm text-zinc-400">Stats</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-1">
              {character.stats.map((s, i) => (
                <div key={i} className="rounded-xl border border-zinc-800 px-3 py-2">
                  <div className="text-xs text-zinc-500">{s.name} ({s.label})</div>
                  <div className="text-lg font-semibold">{s.value}{s.max ? ` / ${s.max}` : ""}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          {character.skills && character.skills.length > 0 && (
            <div>
              <div className="text-sm text-zinc-400">Compétences</div>
              <ul className="mt-1 space-y-1">
                {character.skills.map((k, i) => (
                  <li key={i} className="flex justify-between border-b border-zinc-800/40 py-1">
                    <span>{k.name} ({k.label})</span><span className="font-medium">{k.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {character.inventory && (
            <div>
              <div className="text-sm text-zinc-400">Inventaire</div>
              <ul className="mt-1 space-y-1">
                {character.inventory.map((it) => (
                  <li key={it.id} className="flex justify-between border-b border-zinc-800/40 py-1">
                    <span>{it.name} ×{it.qty}</span>
                    {it.note && <span className="text-zinc-400">{it.note}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {character.conditions && character.conditions.length > 0 && (
            <div>
              <div className="text-sm text-zinc-400">Conditions</div>
              <ul className="mt-1 space-y-1">
                {character.conditions.map((c, i) => (
                  <li key={i}>• {c.key}{c.note ? ` — ${c.note}` : ""}</li>
                ))}
              </ul>
            </div>
          )}

          {character.money && (
            <div className="text-sm text-zinc-400">
              <div>Argent</div>
              <div className="text-zinc-100">
                {character.money.gold ?? 0} or • {character.money.silver ?? 0} argent • {character.money.copper ?? 0} cuivre
              </div>
            </div>
          )}
        </aside>
      </div>
    </Modal>
  );
};
