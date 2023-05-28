import { Sphere } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { FunctionComponent, MutableRefObject, useEffect, useRef, useState } from "react";
import { type Map } from "@submodules/ultraglobe/src/Map";
import { type Object3D, type Mesh, Raycaster } from "three";

export interface Props {
  ultraGlobeMapRef: MutableRefObject<Map | null>;
}

export const PointerPreview: FunctionComponent<Props> = ({
  ultraGlobeMapRef,
}) => {
  const pointerSphereRef = useRef<Mesh>(null!);
  /**
   * Reference to the tiles in the scene, used to interact with them.
   */
  const ceObjectRef = useRef<Object3D>();
  const [raycaster] = useState(() => new Raycaster());

  useFrame((state, _delta) => {
    const map = ultraGlobeMapRef.current;
    if (!map) return;

    // This way we only initialize it once
    if (!ceObjectRef.current) {
      const ceObject = map.scene.children.find(
        (child: Object3D) => child.constructor.name === "ce"
      );
      if (!ceObject) return;
      raycaster.layers.enable(ceObject.layers.mask);

      ceObjectRef.current = ceObject;
    }

    const pointer = state.pointer;
    const camera = state.camera;
    const sphere = pointerSphereRef.current;
    raycaster.setFromCamera(pointer, camera);

    // Via the if statement above, we're ensured to have a ceObject by here
    const intersects = raycaster.intersectObject(ceObjectRef.current!);
    const firstIntersection = intersects[0];
    if (firstIntersection) {
      sphere.position.copy(firstIntersection.point);
    }

    // Make the spheres be at a constant size, based on the distance from the camera
    const distance = sphere.position.distanceTo(camera.position);
    sphere.scale.setScalar(distance / 1000);
  });

  return (
    <Sphere args={[5]} ref={pointerSphereRef}>
      <meshBasicMaterial color={"hotpink"} />
    </Sphere>
  );
};
