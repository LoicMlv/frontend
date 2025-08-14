import React from "react";
import { Button } from "./ui/button";
import { Panel } from "./ui/Panel";

type Props = {
  onShowCharacter: () => void;
  onShowHistory: () => void;
  onShowActions: () => void;
};

export const GameControls: React.FC<Props> = ({ onShowCharacter, onShowHistory, onShowActions }) => {
  return (
    <Panel className="mt-3">
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={onShowCharacter}>Voir personnage</Button>
        <Button variant="secondary" onClick={onShowHistory}>Historique actions</Button>
        <Button onClick={onShowActions}>Actions</Button>
      </div>
    </Panel>
  );
};
