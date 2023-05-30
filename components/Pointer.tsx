import {
  extend,
  type Object3DNode,
  type GroupProps,
  type MaterialNode,
  Color,
} from "@react-three/fiber";
import { forwardRef } from "react";
import { Vector2, type Group } from "three";
import { MeshLineGeometry, MeshLineMaterial, raycast } from "meshline";
import { Sphere } from "@react-three/drei";

extend({ MeshLineGeometry, MeshLineMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: Object3DNode<MeshLineGeometry, typeof MeshLineGeometry>;
    meshLineMaterial: MaterialNode<MeshLineMaterial, typeof MeshLineMaterial>;
  }
}

export interface Props extends GroupProps {
  topColor?: Color;
}

export const Pointer = forwardRef<Group, Props>(
  ({ topColor = "red", ...props }, ref) => {
    return (
      <group ref={ref} {...props}>
        <mesh raycast={raycast}>
          <meshLineGeometry points={[0, 0, 0, 0, 40, 0]} />
          <meshLineMaterial
            lineWidth={8}
            color="white"
            transparent
            sizeAttenuation={0}
            resolution={new Vector2(512, 512)}
            dashArray={0.1}
            dashRatio={0.5}
          />
        </mesh>
        <Sphere args={[5]} position={[0, 40, 0]}>
          <meshLambertMaterial color={topColor} />
        </Sphere>
      </group>
    );
  }
);

Pointer.displayName = "Pointer";
