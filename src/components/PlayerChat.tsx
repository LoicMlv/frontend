import React, { useRef, useEffect, useState } from "react";
import type { ChatMessage } from "../lib/types";
import { Panel } from "./ui/Panel";
import { Button } from "./ui/button";

type Props = {
  chat: ChatMessage[];
  onSend: (text: string) => void;
  placeholder?: string;
};

export const PlayerChat: React.FC<Props> = ({ chat, onSend, placeholder = "Message (MJ ou joueurs)..." }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [text, setText] = useState("");

  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" });
  }, [chat]);

  function submit() {
    const t = text.trim();
    if (!t) return;
    onSend(t);
    setText("");
  }

  return (
    <Panel className="h-full">
      <div ref={ref} className="h-[60vh] md:h-[70vh] overflow-y-auto pr-1 space-y-2">
        {chat.map((m) => (
          <div key={m.id}>
            <div className="text-xs text-zinc-500">{new Date(m.at).toLocaleTimeString()} — {m.author}</div>
            <div>{m.text}</div>
          </div>
        ))}
        {chat.length === 0 && <div className="text-zinc-500">Aucun message.</div>}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          className="flex-1 rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-2 text-zinc-100 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
        <Button onClick={submit}>Envoyer</Button>
      </div>
    </Panel>
  );
};
