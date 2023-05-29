"use client"; // This is a client component 👈🏽

import { useFrame, useThree } from "@react-three/fiber";
import { Map } from "@submodules/ultraglobe/src/Map";
import { GoogleMap3DTileLayer } from "@submodules/ultraglobe/src/layers/GoogleMap3DTileLayer";
import { forwardRef, useEffect, useRef } from "react";

export const UltraGlobeMesh = forwardRef<Map>(({}, ref) => {
  const camera = useThree((state) => state.camera);
  const scene = useThree((state) => state.scene);
  const glRenderer = useThree((state) => state.gl);

  const ultraglobeMapRef = useRef<Map | null>(null);

  useEffect(() => {
    let map = new Map({ renderer: glRenderer, scene, camera });
    var googleMaps3DTiles = new GoogleMap3DTileLayer({
      id: 0,
      name: "Google Maps 3D Tiles",
      visible: true,
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      loadOutsideView: true,
      displayCopyright: true,
      geometricErrorMultiplier: 3,
    });
    map.setLayer(googleMaps3DTiles, 0);

    // let spheres: Object3D[] = [];

    // if (map.selectController) {
    //   map.selectController.selectCallback = (mouseUpLocation: Vector2) => {
    //     setHasClickedOnce(true);
    //     // Create a sphere colored white at the location of the debug one
    //     const geom = new SphereGeometry(5);
    //     const mesh = new Mesh(geom);
    //     mesh.position.copy(debugSphereMesh.position);
    //     // Pick a random, solid and nice color, but make it vary a lot
    //     mesh.material = new MeshBasicMaterial({
    //       color: `hsl(${Math.random() * 360}, 100%, 50%)`,
    //     });
    //     map.scene.add(mesh);
    //     spheres.push(mesh);
    //   };
    // }

    if (ref) {
      if (typeof ref === "function") {
        ref(map);
      } else {
        ref.current = map;
      }
    }

    ultraglobeMapRef.current = map;

    console.log("Setup");
  }, [camera, glRenderer, ref, scene]);

  useFrame(() => {
    const ultraglobeMap = ultraglobeMapRef.current;
    if (!ultraglobeMap) return;

    ultraglobeMap.update();
  });

  return null;
});

UltraGlobeMesh.displayName = "UltraGlobeMesh";

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
