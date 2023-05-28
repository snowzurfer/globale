"use client"; // This is a client component 👈🏽

import { ThreeScene } from "@/components/ThreeScene";
import { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default function Home() {
  const [hasClickedOnce, setHasClickedOnce] = useState(false);

  return (
    <main
      className="w-full h-screen"
      onContextMenu={(e) => {
        e.preventDefault();
      }}
    >
      <div className="absolute inset-0">
        <ErrorBoundary fallback={<p>Something went wrong</p>}>
          <ThreeScene />
        </ErrorBoundary>

        {!hasClickedOnce && (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
            <div className="bg-white mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 pointer-events-auto rounded-lg">
              <div className="mx-auto max-w-3xl">
                {/* <div className="bg-white m-8 p-4 rounded-lg shadow-lg pointer-events-auto"> */}
                <h1 className="text-2xl font-bold mb-2">
                  🌏 Welcome to globale! 🌍
                </h1>
                <p className="mb-2">
                  This is a synchronized 3D globe editor rendering Google Maps
                  3D Tiles, using{" "}
                  <a
                    href="https://github.com/ebeaufay/UltraGlobe"
                    className="text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    UltraGlobe
                  </a>
                  ,{" "}
                  <a
                    href="https://docs.pmnd.rs/react-three-fiber/getting-started/introduction"
                    className="text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    react-three-fiber
                  </a>{" "}
                  and{" "}
                  <a
                    href="https://github.com/pmndrs/drei"
                    className="text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    drei
                  </a>
                  .
                </p>
                <p className="mb-2">
                  The code is{" "}
                  <a
                    href="https://github.com/snowzurfer/globale"
                    className="text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    open source
                  </a>{" "}
                  🤖.
                </p>
                <p className="mb-2">
                  Click anywhere on the globe to add ThreeJS objects! They are
                  synchronized and persisted 🔁.
                </p>

                <div className="flex flex-col items-center justify-center">
                  <button
                    type="button"
                    className="rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                    onClick={() => setHasClickedOnce(true)}
                  >
                    Let&apos;s go!
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
