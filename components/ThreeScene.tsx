import { Canvas } from "@react-three/fiber";
import { FunctionComponent, useCallback, useRef, useState } from "react";
import { Color, Vector3 } from "three";
import { UltraGlobeMesh } from "./UltraGlobeMesh";
import { type Map } from "@submodules/ultraglobe/src/Map";
import { PointerPreview } from "./PointerPreview";
import { v4 as uuid4 } from "uuid";
import { Sphere } from "@react-three/drei";

export interface SceneItem {
  id: string;
  pos: Vector3;
}

export const ThreeScene: FunctionComponent = () => {
  const ultraglobeMapRef = useRef<Map | null>(null);

  const [sceneItems, setSceneItems] = useState<SceneItem[]>([]);

  const addItemOnSelect = useCallback((cartesianPosition: Vector3) => {
    const item: SceneItem = {
      id: uuid4(),
      pos: new Vector3().copy(cartesianPosition),
    };

    setSceneItems((values) => [...values, item]);
  }, []);

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
      />

      {sceneItems.map((item) => (
        <Sphere args={[5]} key={item.id} position={item.pos}>
          <meshBasicMaterial color="blue" />
        </Sphere>
      ))}
    </Canvas>
  );
};
