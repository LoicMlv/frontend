import React, { useRef, useState } from "react";
import { Modal } from "./ui/Modal";
import { TextInput } from "./ui/TextInput";
import { TextArea } from "./ui/TextArea";
import { Button } from "./ui/button";
import type { PartyCreateForm } from "../lib/types";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: PartyCreateForm) => void;
  defaultRuleSetId?: string;
};

export const PartySetupModal: React.FC<Props> = ({ open, onClose, onSubmit, defaultRuleSetId = "rules_d20_v1" }) => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [values, setValues] = useState<PartyCreateForm>({
    name: "",
    lang: "fr",
    mode: "strict",
    ruleSetId: defaultRuleSetId,
    difficulty: "medium",
    universe: "",
    premise: "",
    aiPlayers: 0,
    humanPlayers: 1,
    importCharacterFile: null,
    createCharacterNow: true,
  });

  function set<K extends keyof PartyCreateForm>(k: K, v: PartyCreateForm[K]) {
    setValues((old) => ({ ...old, [k]: v }));
  }

  function submit() {
    onSubmit(values);
  }

  return (
    <Modal open={open} onClose={onClose} title="Créer une partie" size="xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="space-y-3">
          <TextInput label="Nom de la partie" value={values.name} onChange={(e) => set("name", e.target.value)} />

          <div className="grid grid-cols-3 gap-2">
            <label className="block">
              <span className="text-sm text-zinc-300">Langue</span>
              <select className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-2"
                value={values.lang} onChange={(e) => set("lang", e.target.value as any)}>
                <option value="fr">Français</option>
                <option value="en">Anglais</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm text-zinc-300">Mode</span>
              <select className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-2"
                value={values.mode} onChange={(e) => set("mode", e.target.value as any)}>
                <option value="strict">Strict</option>
                <option value="relaxed">Allégé</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm text-zinc-300">Difficulté</span>
              <select className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-2"
                value={values.difficulty} onChange={(e) => set("difficulty", e.target.value as any)}>
                <option value="easy">Facile</option>
                <option value="medium">Normal</option>
                <option value="hard">Difficile</option>
              </select>
            </label>
          </div>

          <TextInput label="RuleSet ID" value={values.ruleSetId} onChange={(e) => set("ruleSetId", e.target.value)} />
          <TextArea label="Univers (optionnel)" rows={4} value={values.universe} onChange={(e) => set("universe", e.target.value)} />
          <TextArea label="Sujet / Pitch (optionnel)" rows={4} value={values.premise} onChange={(e) => set("premise", e.target.value)} />
        </section>

        <section className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <TextInput label="Joueurs IA" type="number" min={0} max={6}
              value={values.aiPlayers} onChange={(e) => set("aiPlayers", Number(e.target.value))} />
            <TextInput label="Joueurs réels" type="number" min={1} max={6}
              value={values.humanPlayers} onChange={(e) => set("humanPlayers", Number(e.target.value))} />
          </div>

          <label className="block space-y-1">
            <span className="text-sm text-zinc-300">Importer un personnage (JSON)</span>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              className="block w-full text-sm text-zinc-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700"
              onChange={(e) => set("importCharacterFile", e.target.files?.[0] ?? null)}
            />
          </label>

          <label className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={!!values.createCharacterNow}
              onChange={(e) => set("createCharacterNow", e.target.checked)}
            />
            <span>Créer un personnage maintenant</span>
          </label>

          <div className="pt-2 flex gap-2">
            <Button onClick={submit}>Créer</Button>
            <Button variant="ghost" onClick={onClose}>Annuler</Button>
          </div>
        </section>
      </div>
    </Modal>
  );
};
