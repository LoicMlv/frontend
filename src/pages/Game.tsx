import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { GameNarration } from "../components/GameNarration";
import { PlayerChat } from "../components/PlayerChat";
import { GameControls } from "../components/GameControls";
import { CombatOverlay } from "../components/CombatOverlay";
import { CharacterSheetModal } from "../components/CharacterSheetModal";
import { HistoryModal } from "../components/HistoryModal";
import { Button } from "../components/ui/button"; 
import { useAuth, clearAuth } from "../lib/auth"; 
import type { MJMessage, ChatMessage, CharacterView, InitiativeEntry } from "../lib/types";
import { api } from "../lib/api";

export default function Game() {
  const { user, setUser } = useAuth();
  const { partyId = "" } = useParams();
  const nav = useNavigate();
  const location = useLocation();
  const sessionId = useMemo(
    () => new URLSearchParams(location.search).get("sessionId") ?? localStorage.getItem("sessionId") ?? "",
    [location.search]
  );

  const [error, setError] = useState<string | null>(null);

  // UI State
  const [narration, setNarration] = useState<MJMessage[]>([]);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [showChar, setShowChar] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [combatVisible, setCombatVisible] = useState(false);
  const [initiative, setInitiative] = useState<InitiativeEntry[]>([]);
  const [characterId, setCharacterId] = useState<string | null>(null);
  const [character, setCharacter] = useState<CharacterView | null>(null);

  useEffect(() => {
    if (!partyId || !sessionId) {
      setError("partyId/sessionId manquants — reviens à l’accueil.");
    } else {
      setError(null);
    }
  }, [partyId, sessionId]);

  // helper pour pousser un message MJ dans le flux
  function pushMJ(text: string, author: "mj" | "system" = "mj") {
    setNarration((m) =>
      m.concat([{ id: crypto.randomUUID(), at: new Date().toISOString(), author, text }])
    );
  }

  // Créer un perso démo
  async function createDemoCharacter() {
    try {
      setError(null);
      if (!partyId) throw new Error("partyId manquant.");

      const body = {
        name: "Alfred",
        concept: "Rôdeur pragmatique",
        level: 2,
        stats: [
          { name: "Force", label: "FOR", value: 12 },
          { name: "Dex", label: "DEX", value: 16 },
          { name: "HP", label: "HP", value: 18, max: 18 },
        ],
        skills: [{ name: "Discrétion", label: "STE", value: 3 }],
        inventory: [{ id: "itm_sword", name: "Épée courte", qty: 1, stats: { dmg: "1d6" } }],
        money: { gold: 12 },
        conditions: [],
        tags: ["niveau_2"],
      };

      const { id } = await api.createCharacter(partyId, body);
      setCharacterId(id);
      setCharacter({
        id,
        name: body.name,
        concept: body.concept,
        stats: body.stats,
        skills: body.skills,
        inventory: body.inventory?.map((i) => ({ id: i.id, name: i.name, qty: i.qty })),
        money: body.money ?? {},
      });
      pushMJ(`Un nouveau personnage rejoint l'aventure : ${body.name}.`);
    } catch (e: any) {
      setError(e.message);
    }
  }

  // Lancer une action d'attaque (démo)
  async function doAttack() {
    try {
      setError(null);
      if (!partyId || !sessionId) throw new Error("partyId/sessionId manquants.");
      if (!characterId) throw new Error("Crée d'abord un personnage.");

      const r = await api.action(partyId, {
        type: "attack",
        actorId: characterId,
        sessionId,
        causedBy: user?.userId || "u_anonymous",
        targetId: characterId, // démo: on se cible pour passer le validator
      });
      pushMJ(`Jet d'attaque : ${JSON.stringify(r.result)}.`);
    } catch (e: any) {
      setError(e.message);
    }
  }

  // Simuler un début de combat (overlay)
  function startCombatDemo() {
    setCombatVisible(true);
    setInitiative([
      { id: "mj", name: "MJ", order: 20, isPlayer: false },
      { id: characterId ?? "p1", name: character?.name ?? "Héros", order: 15, hp: 18, isPlayer: true },
      { id: "gob", name: "Gobelin", order: 10, hp: 8, isPlayer: false },
    ]);
  }

  function onSendChat(text: string) {
    setChat((c) => c.concat([{ id: crypto.randomUUID(), at: new Date().toISOString(), author: user?.name ?? "Moi", text }]));
  }

  function goHome() {
    nav("/");
  }

  function logout() {
    clearAuth();
    setUser(null);
    nav("/auth?redirect=/");
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-7xl mx-auto p-4">
        <header className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs text-zinc-400">Party</div>
            <div className="font-semibold truncate max-w-[60vw]">{partyId}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-zinc-400 mr-2">{user?.name}</div>
            <Button variant="secondary" onClick={goHome}>Accueil</Button>
            <Button variant="ghost" onClick={logout}>Se déconnecter</Button>
          </div>
        </header>

        {error && <div className="mb-3 text-red-400 text-sm">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <GameNarration messages={narration} />
            <div className="mt-3 flex flex-wrap gap-2">
              <Button onClick={createDemoCharacter}>Créer un personnage démo</Button>
              <Button onClick={doAttack}>Attaque (démo)</Button>
              <Button variant="secondary" onClick={startCombatDemo}>Démarrer combat (overlay)</Button>
              <Button variant="ghost" onClick={() => setShowChar(true)} disabled={!characterId}>Voir personnage</Button>
              <Button variant="ghost" onClick={() => setShowHistory(true)}>Historique</Button>
            </div>
          </div>
          <div>
            <PlayerChat chat={chat} onSend={onSendChat} />
          </div>
        </div>
      </div>

      <CombatOverlay visible={combatVisible} order={initiative} />
      <CharacterSheetModal open={showChar} onClose={() => setShowChar(false)} character={character} />
      <HistoryModal open={showHistory} onClose={() => setShowHistory(false)} items={[]} />
    </div>
  );
}
