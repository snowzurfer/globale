"use client"; // This is a client component 👈🏽

import { Map } from "@submodules/ultraglobe/src/Map";
import { GoogleMap3DTileLayer } from "@submodules/ultraglobe/src/layers/GoogleMap3DTileLayer";

import { FunctionComponent, useEffect, useRef } from "react";
import {
  Mesh,
  MeshBasicMaterial,
  Object3D,
  Raycaster,
  SphereGeometry,
  Vector2,
  Vector3,
} from "three";

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

    // A debug box that's moved to the mouse pointer's position
    const debugBoxGeometry = new SphereGeometry(5);
    const debugSphereMesh = new Mesh(debugBoxGeometry);
    const basicMaterial = new MeshBasicMaterial({ color: "hotpink" });
    debugSphereMesh.material = basicMaterial;
    map.scene.add(debugSphereMesh);

    let spheres: Object3D[] = [];

    const raycaster = new Raycaster();
    const ceObject = map.scene.children.find(
      (child: Object3D) => child.constructor.name === "ce"
    );
    if (ceObject) {
      raycaster.layers.enable(ceObject.layers.mask);
    }

    if (map.selectController) {
      map.selectController.selectCallback = (mouseUpLocation: Vector2) => {
        // Create a sphere colored white at the location of the debug one
        const geom = new SphereGeometry(5);
        const mesh = new Mesh(geom);
        mesh.position.copy(debugSphereMesh.position);
        // Pick a random, solid and nice color
        // mesh.material = new MeshBasicMaterial({ color: "white" });
        mesh.material = new MeshBasicMaterial({
          color: `hsl(${Math.random() * 360}, 100%, 50%)`,
        });
        map.scene.add(mesh);
        spheres.push(mesh);
      };
    }

    map.animateCallback = () => {
      const camera = map.camera;
      const selectController = map.selectController;
      if (!camera || !selectController || !ceObject) return;
      // Convert to 2D NDC
      const mousePosition = new Vector2(
        (selectController.mousePosition.x / window.innerWidth) * 2 - 1,
        -(selectController.mousePosition.y / window.innerHeight) * 2 + 1
      );

      raycaster.setFromCamera(mousePosition, camera);
      const intersects = raycaster.intersectObject(ceObject);
      const firstIntersection = intersects[0];
      if (firstIntersection) {
        debugSphereMesh.position.copy(firstIntersection.point);
      }
    };
    mapRef.current = map;

    console.log("Setup");
  }, []);

  return (
    <div
      id="ultrameshDiv"
      onContextMenu={(e) => {
        e.preventDefault();
      }}
      ref={divRef}
      className="w-full h-full"
    />
  );
};


// Lefover code from debugging

// const map = mapRef.current;
// if (!map) return;
// const camera = map.camera;
// const selectController = map.selectController;
// // Get the object named "ce" from map.scene.children
// // "ce" isn't in the `name` property, but the name of the actual type of object
// let ceObject = map.scene.children.find((child: Object3D) => child.constructor.name === "ce");
// console.log("ceObject", ceObject);

// if (!camera || !selectController || !ceObject) return;
// // raycaster.setFromCamera()
// console.log("Pointer position: ", selectController.mousePosition);
// // Convert to NDC
// const mousePosition = new Vector2(
//   (selectController.mousePosition.x / window.innerWidth) * 2 - 1,
//   -(selectController.mousePosition.y / window.innerHeight) * 2 + 1
// );

// raycaster.setFromCamera(mousePosition, camera);
// const intersects = raycaster.intersectObject(ceObject);
// console.log("scene children", map.scene.children)
// console.log("Intersects", intersects);

// const firstIntersection = intersects[0];
// if (firstIntersection) {
