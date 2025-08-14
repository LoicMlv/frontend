export type MJMessage = {
    id: string;
    at: string;        // ISO
    author: "mj" | "system" | string;
    text: string;
    kind?: "narration" | "dialog" | "system";
  };
  
  export type ChatMessage = {
    id: string;
    at: string;
    author: string;    // user id or name
    text: string;
  };
  
  export type InitiativeEntry = {
    id: string;
    name: string;
    order: number;
    hp?: number | null;
    isPlayer?: boolean;
  };
  
  export type CharacterView = {
    id: string;
    name: string;
    concept?: string;
    lore?: string;
    stats: Array<{ label: string; name: string; value: number; max?: number }>;
    skills?: Array<{ label: string; name: string; value: number }>;
    inventory?: Array<{ id: string; name: string; qty: number; note?: string }>;
    conditions?: Array<{ key: string; note?: string }>;
    money?: { gold?: number; silver?: number; copper?: number };
  };
  
  export type PartyCreateForm = {
    name: string;
    lang: "fr" | "en";
    mode: "strict" | "relaxed";
    ruleSetId: string;
    difficulty: "easy" | "medium" | "hard";
    universe?: string;      // free text or preset
    premise?: string;       // pitch / sujet
    aiPlayers: number;      // 0..6
    humanPlayers: number;   // 1..6
    importCharacterFile?: File | null;
    createCharacterNow?: boolean;
  };
  