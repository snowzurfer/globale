import { Canvas } from "@react-three/fiber";
import {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Color, type Quaternion, Vector3 } from "three";
import { UltraGlobeMesh } from "./UltraGlobeMesh";
// @ts-ignore
import { type Map } from "@jdultra/ultra-globe/src/Map";
import { PointerPreview } from "./PointerPreview";
import { useGlobaleStore, type SceneItem } from "@/app/store";
import { SceneItems } from "./SceneItems";
import { v4 as uuid4 } from "uuid";
import { Box } from "@react-three/drei";
import { ref, set } from "firebase/database";
import { firRealtimeDB } from "@/app/firebase";

export const ThreeScene: FunctionComponent = () => {
  const ultraglobeMapRef = useRef<Map | null>(null);

  const showPointer = useGlobaleStore((state) => state.showPointer);
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
      // setShowAddItemMenu(true, {
      //   pos: cartesianPosition.toArray(),
      //   quat: quaternion.toArray() as [number, number, number, number],
      // });
      const item: SceneItem = {
        id: uuid4(),
        positionAndRotation: {
          pos: cartesianPosition.toArray(),
          quat: quaternion.toArray() as [number, number, number, number],
        },
        type: itemToAdd,
        // color: "#00A3E1",
        color: "purple",
        scaleInvariant: true,
        creatorUserId: user?.id ?? "anonymous",
      };

      addSceneItem(item, true);

      console.log("Opened addition menu");
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
        visible={showPointer}
        interactsWithVerticalSurfaces={pointerInteractsWithVerticalSurfaces}
        enabled={!showAddItemMenu}
      />
      <SceneItems items={sceneItems} />
      <Box args={[400000, 400000, 400000]} position={[7398100, 0, 0]}>
        <meshBasicMaterial color="red" />
      </Box>
      <Box args={[400000, 400000, 400000]} position={[0, 7398100, 0]}>
        <meshBasicMaterial color="green" />
      </Box>
      <Box args={[400000, 400000, 400000]} position={[0, 0, 7398100]}>
        <meshBasicMaterial color="blue" />
      </Box>
    </Canvas>
  );
};
