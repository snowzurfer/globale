"use client"; // This is a client component 👈🏽

import { UltraMeshGlobe } from "@/components/UltraMeshGlobe";

export default function Home() {
  // Make the page be full screen
  return (
    <main
      className="w-full h-screen"
      onContextMenu={e => {
        e.preventDefault();
      }}
    >
      <UltraMeshGlobe />
    </main>
  );
}
