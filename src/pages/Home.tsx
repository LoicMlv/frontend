import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { PartySetupModal } from "../components/PartySetupModal";
import { api } from "../lib/api";

export default function Home() {
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [checking, setChecking] = useState(false);
  const [health, setHealth] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function checkHealth() {
    try {
      setChecking(true);
      setError(null);
      const h = await api.health();
      setHealth(JSON.stringify(h));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setChecking(false);
    }
  }

  async function handleCreateParty(values: any) {
    try {
      setError(null);
      // mappe les champs du form vers le payload backend
      const payload = {
        name: values.name,
        lang: values.lang,
        mode: values.mode,
        ruleSetId: values.ruleSetId,
        hostUserId: "u_host",                 // simplifié pour MVP
        mj: { type: "ai" as const, personaId: null },
        difficulty: values.difficulty,
        customRules: values.universe || values.premise ? {
          universe: values.universe ?? "",
          premise: values.premise ?? ""
        } : null
      };
      const { id: partyId } = await api.createParty(payload);
      const { id: sessionId } = await api.createSession(partyId, "Session 1");

      // Optionnel: stocker localement
      localStorage.setItem("partyId", partyId);
      localStorage.setItem("sessionId", sessionId);

      setOpen(false);
      nav(`/game/${partyId}?sessionId=${sessionId}`);
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-5xl mx-auto p-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">JDR – MJ IA</h1>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={checkHealth} disabled={checking}>
              {checking ? "..." : "Vérifier le backend"}
            </Button>
            <Button onClick={() => setOpen(true)}>Créer une partie</Button>
          </div>
        </header>

        {health && (
          <div className="mt-4 text-sm text-green-400">Santé backend: {health}</div>
        )}
        {error && (
          <div className="mt-4 text-sm text-red-400">{error}</div>
        )}

        <main className="mt-10">
          <p className="text-zinc-400">
            Lance une partie en cliquant sur “Créer une partie”. Un écran de jeu s’ouvrira avec la narration MJ,
            le chat joueurs et les boutons d’actions.
          </p>
        </main>
      </div>

      <PartySetupModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleCreateParty}
      />
    </div>
  );
}
