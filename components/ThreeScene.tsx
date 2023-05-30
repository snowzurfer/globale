import { Canvas } from "@react-three/fiber";
import { FunctionComponent, useCallback, useRef, useState } from "react";
import { Color, type Quaternion, Vector3 } from "three";
import { UltraGlobeMesh } from "./UltraGlobeMesh";
import { type Map } from "@submodules/ultraglobe/src/Map";
import { PointerPreview } from "./PointerPreview";
import { v4 as uuid4 } from "uuid";
import { useGlobaleStore, type SceneItem } from "@/app/store";
import { SceneItems } from "./SceneItems";

export const ThreeScene: FunctionComponent = () => {
  const ultraglobeMapRef = useRef<Map | null>(null);

  const showPointer = useGlobaleStore((state) => state.showPointer);
  const sceneItems = useGlobaleStore((state) => state.sceneItems);
  const addSceneItem = useGlobaleStore((state) => state.addSceneItem);

  const addItemOnSelect = useCallback(
    (cartesianPosition: Vector3, quaternion: Quaternion) => {
      const item: SceneItem = {
        id: uuid4(),
        pos: cartesianPosition.clone(),
        quat: quaternion.clone(),
      };

      addSceneItem(item);
      console.log("Added item", item);
    },
    [addSceneItem]
  );

  console.log("Scene items", sceneItems);

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
        // We do this rather than using the `scene` prop because by doing
        // that it doesn't stick.
        state.scene.background = new Color(0x000000);

        // We do this here because we can't set the lookAt from the props
        // of the Canvas
        //
        // This value was found from the original source code of UltraGlobe.
        state.camera.lookAt(new Vector3(0, 0, 10000));
      }}
    >
      <ambientLight />
      <directionalLight position={[90000000, 90000000, 90000000]} />
      <UltraGlobeMesh ref={ultraglobeMapRef} />
      <PointerPreview
        ultraGlobeMapRef={ultraglobeMapRef}
        onSelect={addItemOnSelect}
        visible={showPointer}
      />
      <SceneItems items={sceneItems} />
    </Canvas>
  );
};
