"use client"; // This is a client component 👈🏽

import { ThreeScene, UltraMeshGlobe } from "@/components/UltraMeshGlobe";
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
          {/* <UltraMeshGlobe setHasClickedOnce={setHasClickedOnce} /> */}
          <ThreeScene />
        </ErrorBoundary>

        {!hasClickedOnce && (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
            <div className="bg-white p-4 rounded-lg shadow-lg pointer-events-auto">
              <h1 className="text-2xl font-bold mb-2">
                Welcome to ⛰️ globale!
              </h1>
              <p className="mb-2">
                This is a [WIP] demo of a 3D globe 🌍 with Google Maps 3D Tiles,
                using {" "}
                <a
                  href="https://github.com/ebeaufay/UltraGlobe"
                  className="text-blue-600 dark:text-blue-500 hover:underline"
                >
                  UltraGlobe
                </a>{" "}
                and{" "}
                <a
                  href="https://github.com/mrdoob/three.js/"
                  className="text-blue-600 dark:text-blue-500 hover:underline"
                >
                  ThreeJS
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
                Click anywhere on the globe to dismiss this message and add
                ThreeJS objects!.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
