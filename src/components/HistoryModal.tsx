import React from "react";
import { Modal } from "./ui/Modal";

type HistoryItem = {
  id: string;
  at: string;
  type: string;   // e.g. "attack", "skill_check"
  text: string;   // short summary
};

type Props = { open: boolean; onClose: () => void; items: HistoryItem[] };

export const HistoryModal: React.FC<Props> = ({ open, onClose, items }) => {
  return (
    <Modal open={open} onClose={onClose} title="Historique des actions" size="lg">
      <div className="max-h-[60vh] overflow-y-auto space-y-2">
        {items.map((it) => (
          <div key={it.id} className="border-b border-zinc-800 pb-2">
            <div className="text-xs text-zinc-500">{new Date(it.at).toLocaleString()} — {it.type}</div>
            <div>{it.text}</div>
          </div>
        ))}
        {items.length === 0 && <div className="text-zinc-500">Aucune action.</div>}
      </div>
    </Modal>
  );
};
