// src/lib/api.ts
export const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:4000/v1";
import { loadAuth } from "./auth";

async function http<T>(path: string, opts?: RequestInit): Promise<T> {
    const auth = loadAuth();
    const headers: Record<string, string> = { "Content-Type": "application/json", ...(opts?.headers as any || {}) };
    if (auth?.userId) headers["X-User-Id"] = auth.userId;
  
    const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status}: ${txt || res.statusText}`);
    }
    return res.json();
}

export type CreatePartyPayload = {
  name: string;
  lang: "fr" | "en";
  mode: "strict" | "relaxed";
  ruleSetId: string;
  hostUserId: string;
  mj: { type: "ai" | "human"; personaId?: string | null };
  difficulty: "easy" | "medium" | "hard";
  customRules?: Record<string, unknown> | null;
};

export const api = {
  health: () => http<{ ok: boolean; mongo: boolean }>("/health".replace("/v1","")),
  createParty: (payload: CreatePartyPayload) =>
    http<{ id: string }>("/parties", { method: "POST", body: JSON.stringify(payload) }),
  getParty: (partyId: string) => http(`/parties/${partyId}`),

  createSession: (partyId: string, title: string) =>
    http<{ id: string }>(`/parties/${partyId}/sessions`, {
      method: "POST",
      body: JSON.stringify({ title }),
    }),

  endSession: (sessionId: string, summary?: string) =>
    http(`/sessions/${sessionId}/end`, {
      method: "PATCH",
      body: JSON.stringify({ summary: summary ?? null }),
    }),

  listEvents: (partyId: string, sessionId?: string, limit = 50) =>
    http(`/parties/${partyId}/events${sessionId ? `?sessionId=${sessionId}&limit=${limit}` : ""}`),

  createCharacter: (
    partyId: string,
    body: {
      name: string;
      concept: string;
      level?: number;
      stats: Array<{ name: string; label: string; value: number; max?: number }>;
      skills?: Array<{ name: string; label: string; value: number }>;
      inventory?: Array<{ id: string; name: string; qty: number; stats?: Record<string, unknown> }>;
      money?: { gold?: number; silver?: number; copper?: number };
      conditions?: Array<{ key: string; severity?: number; notes?: string }>;
      tags?: string[];
    }
  ) => http<{ id: string }>(`/parties/${partyId}/characters`, { method: "POST", body: JSON.stringify(body) }),

  action: (partyId: string, body: {
    type: "attack" | "skill_check";
    actorId: string;
    sessionId: string;
    targetId?: string;
    causedBy?: string;
    params?: Record<string, unknown>;
  }) => http<{ eventId: string; result: unknown; stateChanges: unknown[]; rolls: unknown[] }>(
    `/parties/${partyId}/actions`,
    { method: "POST", body: JSON.stringify(body) }
  ),

  createSnapshot: (partyId: string, sessionId: string, indexUntilEventId: string, state: unknown) =>
    http<{ id: string }>(`/parties/${partyId}/sessions/${sessionId}/snapshots`, {
      method: "POST",
      body: JSON.stringify({ indexUntilEventId, state }),
    }),
  getLatestSnapshot: (partyId: string, sessionId: string) =>
    http(`/parties/${partyId}/sessions/${sessionId}/snapshots/latest`),
};
