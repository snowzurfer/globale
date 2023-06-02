"use client"; // This is a client component 👈🏽

import { ThreeScene } from "@/components/ThreeScene";
import { ErrorBoundary } from "react-error-boundary";
import { useGlobaleStore } from "./store";
import { WelcomeModalView } from "@/components/WelcomeModalView";
import { ThreeSceneUI } from "@/components/ThreeSceneUI";

const Home = () => {
  const hasClickedOnce = useGlobaleStore((state) => state.hasClickedOnce);
  const googleTilesAPIKey = useGlobaleStore((state) => state.googleTilesAPIKey);
  const setHasClickedOnce = useGlobaleStore((state) => state.setHasClickedOnce);
  const user = useGlobaleStore((state) => state.user);

  const setup = hasClickedOnce && googleTilesAPIKey && user;

  return (
    <main className="w-full h-screen" onContextMenu={(e) => e.preventDefault()}>
      <div className="absolute inset-0">
        <ErrorBoundary fallback={<p>Something went wrong</p>}>
          <ThreeScene />
        </ErrorBoundary>

        {!setup && <WelcomeModalView setHasClickedOnce={setHasClickedOnce} />}

        {setup && <ThreeSceneUI />}
      </div>
    </main>
  );
};

export default Home;
