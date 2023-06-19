import { Vector3 as r3fVector3, useFrame } from "@react-three/fiber";
import { useState, type RefObject } from "react";
import { Vector3, type Object3D } from "three";

export interface Args {
  objectRef: RefObject<Object3D>;
  originalScale?: r3fVector3;
  active?: boolean;
}

export const useKeepScale = ({
  objectRef,
  active = true,
  originalScale = 1,
}: Args) => {
  const [worldPosition] = useState(() => new Vector3());

  useFrame(({ camera }) => {
    const object = objectRef.current;
    if (!object) return;
    if (!active) {
      if (originalScale) {
        // Narrow down the react-three-fiber vector3
        // it can either be A Vector3, a scalar, or a tuple of 3 numbers or a readonly tuple of 3 numbers
        if (originalScale instanceof Vector3) {
          object.scale.copy(originalScale);
        } else if (Array.isArray(originalScale)) {
          object.scale.set(...originalScale);
        } else if (typeof originalScale === "number") {
          object.scale.setScalar(originalScale);
        } else {
          object.scale.set(...originalScale);
        }
      }
      return;
    }

    object.getWorldPosition(worldPosition);
    const distance = worldPosition.distanceTo(camera.position);
    object.scale.setScalar(distance / 1000);
  });
};
