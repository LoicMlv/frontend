import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth, saveAuth } from "../lib/auth";
import { Button } from "../components/ui/button";
import { TextInput } from "../components/ui/TextInput";
import { Panel } from "../components/ui/Panel";

export default function AuthPage() {
  const nav = useNavigate();
  const [sp] = useSearchParams();
  const { setUser } = useAuth();

  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const n = name.trim();
    if (n.length < 2 || n.length > 32) {
      setError("Le nom doit faire entre 2 et 32 caractères.");
      return;
    }
    const user = { userId: "u_" + crypto.randomUUID(), name: n, createdAt: new Date().toISOString(), email: "" };
    saveAuth(user);
    setUser(user);

    const redirect = sp.get("redirect") || "/";
    nav(redirect);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
      <Panel className="w-full max-w-md">
        <h1 className="text-xl font-semibold mb-4">Se connecter</h1>
        <form onSubmit={submit} className="space-y-3">
          <TextInput
            label="Votre nom (affiché aux autres)"
            placeholder="Ex: Arthaniel"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {error && <div className="text-sm text-red-400">{error}</div>}
          <Button type="submit" className="w-full">Continuer</Button>
        </form>
        <p className="text-xs text-zinc-500 mt-3">
          Aucun mot de passe — un identifiant local est créé sur cet appareil.
        </p>
      </Panel>
    </div>
  );
}
