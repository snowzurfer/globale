"use client"; // This is a client component 👈🏽

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Map } from "@submodules/ultraglobe/src/Map";
import { GoogleMap3DTileLayer } from "@submodules/ultraglobe/src/layers/GoogleMap3DTileLayer";

import { FunctionComponent, useEffect, useRef } from "react";
import {
  Color,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  Raycaster,
  SphereGeometry,
  Vector2,
  Vector3,
} from "three";

export interface Props {
  setHasClickedOnce: (hasClickedOnce: boolean) => void;
}

export const UltraMeshGlobe: FunctionComponent<Props> = ({
  setHasClickedOnce,
}) => {
  const camera = useThree((state) => state.camera);
  const scene = useThree((state) => state.scene);
  const glRenderer = useThree((state) => state.gl);

  const ultraglobeMapRef = useRef<Map>();

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
    if (!ceObject) {
      throw new Error("Couldn't find ceObject");
    }
    raycaster.layers.enable(ceObject.layers.mask);

    if (map.selectController) {
      map.selectController.selectCallback = (mouseUpLocation: Vector2) => {
        setHasClickedOnce(true);
        // Create a sphere colored white at the location of the debug one
        const geom = new SphereGeometry(5);
        const mesh = new Mesh(geom);
        mesh.position.copy(debugSphereMesh.position);
        // Pick a random, solid and nice color, but make it vary a lot
        mesh.material = new MeshBasicMaterial({
          color: `hsl(${Math.random() * 360}, 100%, 50%)`,
        });
        map.scene.add(mesh);
        spheres.push(mesh);
      };
    }

    // map.animateCallback = () => {
    //   const camera = map.camera;
    //   const selectController = map.selectController;
    //   if (!camera || !selectController || !ceObject) return;
    //   // Convert to 2D NDC
    //   const mousePosition = new Vector2(
    //     (selectController.mousePosition.x / window.innerWidth) * 2 - 1,
    //     -(selectController.mousePosition.y / window.innerHeight) * 2 + 1
    //   );

    //   raycaster.setFromCamera(mousePosition, camera);
    //   const intersects = raycaster.intersectObject(ceObject);
    //   const firstIntersection = intersects[0];
    //   if (firstIntersection) {
    //     debugSphereMesh.position.copy(firstIntersection.point);
    //   }

    //   // Make the spheres be at a constant size, based on the distance from the camera
    //   const cameraPosition = camera.position;
    //   spheres.forEach((sphere) => {
    //     const distance = sphere.position.distanceTo(cameraPosition);
    //     sphere.scale.setScalar(distance / 1000);
    //   });
    // };

    ultraglobeMapRef.current = map;

    console.log("Setup");
  }, [camera, glRenderer, scene, setHasClickedOnce]);

  useFrame((state, delta) => {
    const ultraglobeMap = ultraglobeMapRef.current;
    if (!ultraglobeMap) return;

    ultraglobeMap.update();
  });

  return null;
};

export const ThreeScene: FunctionComponent = () => {
  return (
    <Canvas
      // These arguments are all copied over from UltraGlobe
      camera={{
        position: [40000000, 0, 0],
        up: [0, 0, 1],
        far: 50000000,
        near: 0.01,
        fov: 30,
      }}
      gl={{
        autoClear: false,
        preserveDrawingBuffer: false,
        // This is important
        logarithmicDepthBuffer: true,
      }}
      onCreated={(state) => {
        const scene = state.scene;
        if (!scene) return;

        // We do this rather than using the `scene` prop because by doing
        // that it doesn't stick.
        scene.background = new Color(0x000000);
      }}
    >
      <UltraMeshGlobe setHasClickedOnce={() => {}} />
    </Canvas>
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
