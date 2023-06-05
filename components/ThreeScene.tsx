import { Canvas } from "@react-three/fiber";
import { FunctionComponent, useCallback, useEffect, useRef } from "react";
import { Color, type Quaternion, Vector3, Group } from "three";
import { UltraGlobeMesh } from "./UltraGlobeMesh";
// @ts-ignore
import { type Map } from "@jdultra/ultra-globe/src/Map";
import { PointerPreview } from "./PointerPreview";
import { useGlobaleStore, type SceneItem, ALL_SCENE_ITEMS } from "@/app/store";
import { SceneItems } from "./SceneItems";
import { v4 as uuid4 } from "uuid";
import { Box, Gltf, useAnimations, useGLTF } from "@react-three/drei";
import { AnimatedModel } from "./AnimatedModel";

export const ThreeScene: FunctionComponent = () => {
  const ultraglobeMapRef = useRef<Map | null>(null);

  const sceneItems = useGlobaleStore((state) => state.sceneItems);
  const addSceneItem = useGlobaleStore((state) => state.addSceneItem);
  const pointerInteractsWithVerticalSurfaces = useGlobaleStore(
    (state) => state.pointerInteractsWithVerticalSurfaces
  );
  const itemToAdd = useGlobaleStore((state) => state.itemToAdd);
  const showAddItemMenu = useGlobaleStore((state) => state.showAddItemMenu);
  const user = useGlobaleStore((state) => state.user);

  const addItemOnSelect = useCallback(
    (cartesianPosition: Vector3, quaternion: Quaternion) => {
      if (itemToAdd === undefined) return;
      console.log("Adding item: ", itemToAdd, "to scene.");

      const item: SceneItem = {
        id: uuid4(),
        positionAndRotation: {
          pos: cartesianPosition.toArray(),
          quat: quaternion.toArray() as [number, number, number, number],
        },
        item: ALL_SCENE_ITEMS[itemToAdd],
        scaleInvariant: true,
        creatorUserId: user?.id ?? "anonymous",
      };

      console.log("Adding item: ", item, "to scene.");

      addSceneItem(item, true);
    },
    [addSceneItem, itemToAdd, user?.id]
  );

  return (
    <Canvas
      // These arguments are all copied over from UltraGlobe
      camera={{
        position: [0, 0, 40000000],
        up: [0, 1, 0],
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
        // We do this rather than using the `scene` prop because by doing
        // that it doesn't stick.
        state.scene.background = new Color(0x000000);

        // We do this here because we can't set the lookAt from the props
        // of the Canvas
        //
        // This value was found from the original source code of UltraGlobe.
        state.camera.lookAt(new Vector3(0, 10000, 0));
      }}
    >
      <ambientLight />
      <directionalLight position={[90000000, 90000000, 90000000]} />
      <UltraGlobeMesh ref={ultraglobeMapRef} />
      <PointerPreview
        ultraGlobeMapRef={ultraglobeMapRef}
        onSelect={addItemOnSelect}
        interactsWithVerticalSurfaces={pointerInteractsWithVerticalSurfaces}
        enabled={!showAddItemMenu}
      />
      <SceneItems items={sceneItems} />
      {/* <Box args={[400000, 400000, 400000]} position={[7398100, 0, 0]}>
        <meshBasicMaterial color="red" />
      </Box> */}
      <Box args={[400000, 400000, 400000]} position={[0, 7398100, 0]}>
        <meshBasicMaterial color="green" />
      </Box>
      <Box args={[400000, 400000, 400000]} position={[0, 0, 7398100]}>
        <meshBasicMaterial color="blue" />
      </Box>
    </Canvas>
  );
};

// const Shrek = () => {
//   const shrekRef = useRef<Group>(null!);

//   const { scene, animations } = useGLTF("/shrek_hip_hop_dance.glb");
//   const { actions, mixer} = useAnimations(animations, shrekRef);
//   // const { ref, mixer, names, actions, clips } = useAnimations(animations)
//   useEffect(() => {
//     // console.log("animations", animations)
//     for (const name in actions) {
//       actions[name]?.play();
//     }
//   })

//   return (
//     <primitive object={scene}
//     ref={shrekRef}
//     position={[7398100, 0, 0]}
//     scale={[1000000, 1000000, 1000000]} />
//   )
// }
