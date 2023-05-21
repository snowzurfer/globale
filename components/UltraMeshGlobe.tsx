"use client"; // This is a client component 👈🏽

import { Map } from "@submodules/ultraglobe/src/Map";
import { GoogleMap3DTileLayer } from "@submodules/ultraglobe/src/layers/GoogleMap3DTileLayer";

import { FunctionComponent, useEffect, useRef } from "react";

export const UltraMeshGlobe: FunctionComponent = () => {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!divRef.current) return;

    let map = new Map({ divID: "ultrameshDiv" });
    var googleMaps3DTiles = new GoogleMap3DTileLayer({
      id: 0,
      name: "Google Maps 3D Tiles",
      visible: true,
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      loadOutsideView: true,
      displayCopyright: true,
    });
    map.setLayer(googleMaps3DTiles, 0);

    console.log("Setup map");
  }, []);

  return (
    <div
      id="ultrameshDiv"
      onContextMenu={e => {
        e.preventDefault();
      }}
      ref={divRef}
      className="w-full h-full"
    />
  );
};
