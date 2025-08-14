import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Game from "./pages/game";
import AuthPage from "./pages/Auth";
import { RequireAuth } from "./components/RequireAuth";

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
      <Route path="/game/:partyId" element={<RequireAuth><Game /></RequireAuth>} />
    </Routes>
  );
}
