import { Canvas } from "@react-three/fiber";
import { FunctionComponent, useRef } from "react";
import { Color, Vector3 } from "three";
import { UltraMeshGlobe } from "./UltraMeshGlobe";
import { type Map } from "@submodules/ultraglobe/src/Map";
import { PointerPreview } from "./PointerPreview";

export const ThreeScene: FunctionComponent = () => {
  const ultraglobeMapRef = useRef<Map | null>(null);

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
        state.camera.lookAt(new Vector3(-0, 0, 10000));
      }}
    >
      <UltraMeshGlobe ref={ultraglobeMapRef} setHasClickedOnce={() => {}} />
      <PointerPreview ultraGlobeMapRef={ultraglobeMapRef} />
    </Canvas>
  );
};
