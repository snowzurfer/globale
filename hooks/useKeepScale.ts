import { useFrame } from "@react-three/fiber";
import { type RefObject } from "react";
import { type Object3D } from "three";

export interface Args {
  objectRef: RefObject<Object3D>;
  active?: boolean;
}

export const useKeepScale = ({ objectRef, active = true }: Args) => {
  useFrame(({ camera }) => {
    const object = objectRef.current;
    if (!active || !object) return;

    const distance = object.position.distanceTo(camera.position);
    object.scale.setScalar(distance / 1000);
  });
};
