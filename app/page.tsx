"use client"; // This is a client component 👈🏽

import { ThreeScene } from "@/components/ThreeScene";
import { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useGlobaleStore } from "./store";
import { WelcomeModalView } from "@/components/WelcomeModalView";

export default function Home() {
  const hasClickedOnce = useGlobaleStore((state) => state.hasClickedOnce);
  const setHasClickedOnce = useGlobaleStore((state) => state.setHasClickedOnce);
  return (
    <main className="w-full h-screen" onContextMenu={(e) => e.preventDefault()}>
      <div className="absolute inset-0">
        <ErrorBoundary fallback={<p>Something went wrong</p>}>
          <ThreeScene />
        </ErrorBoundary>

        {!hasClickedOnce && (
          <WelcomeModalView setHasClickedOnce={setHasClickedOnce} />
        )}
      </div>
    </main>
  );
}
