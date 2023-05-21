"use client"; // This is a client component 👈🏽

import { Map } from "@submodules/ultraglobe/src/Map";
import { GoogleMap3DTileLayer } from "@submodules/ultraglobe/src/layers/GoogleMap3DTileLayer";

import {
  MouseEvent,
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { BoxGeometry, Mesh, Vector3 } from "three";

export const UltraMeshGlobe: FunctionComponent = () => {
  const divRef = useRef<HTMLDivElement>(null);

  const mapRef = useRef<Map>();

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

    mapRef.current = map;

    console.log("Setup map");
  }, []);

  const clickCallback = useCallback((e: MouseEvent<HTMLDivElement>) => {
    console.log("Clicked", e);

    const map = mapRef.current;
    if (!map) return;

    const result = new Vector3();
    map.screenPixelRayCast(e.clientX, e.clientY, result);
    console.log("Result", result);

    // Create a huge box at the position of result
    const boxGeometry = new BoxGeometry(1000, 1000, 1000);
    const boxMesh = new Mesh(boxGeometry);
    boxMesh.position.copy(result);

    map.scene.add(boxMesh);
  }, []);

  return (
    <div
      id="ultrameshDiv"
      onContextMenu={(e) => {
        e.preventDefault();
      }}
      ref={divRef}
      className="w-full h-full"
      onClick={clickCallback}
    />
  );
};
