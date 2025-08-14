import React, { useEffect, useRef } from "react";
import type { MJMessage } from "../lib/types";
import { Panel } from "./ui/Panel";

type Props = { messages: MJMessage[] };

export const GameNarration: React.FC<Props> = ({ messages }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  return (
    <Panel className="h-full">
      <div ref={ref} className="h-[60vh] md:h-[70vh] overflow-y-auto pr-2 space-y-3">
        {messages.map((m) => (
          <div key={m.id} className="leading-relaxed">
            <div className="text-xs text-zinc-500">{new Date(m.at).toLocaleTimeString()} — {m.author.toUpperCase()}</div>
            <div className="whitespace-pre-wrap">{m.text}</div>
          </div>
        ))}
        {messages.length === 0 && <div className="text-zinc-500">Le MJ n’a pas encore parlé…</div>}
      </div>
    </Panel>
  );
};
