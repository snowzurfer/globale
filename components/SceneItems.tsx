/**
 * "Low Poly pine tree" (https://skfb.ly/o6s9O) by eucalyp555 is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
 */

import { type SceneItem } from "@/app/store";
import { useKeepScale } from "@/hooks/useKeepScale";
import { type GroupProps } from "@react-three/fiber";
import { FunctionComponent, useEffect, useRef } from "react";
import { type Group } from "three";
import { Pointer } from "./Pointer";
import { RotatingBox } from "./RotatingBox";

export interface Props {
  items: SceneItem[];
}

export interface SceneItemElementProps extends GroupProps {
  item: SceneItem;
}

export const SceneItemElement: FunctionComponent<SceneItemElementProps> = ({
  item,
  ...props
}) => {
  const groupRef = useRef<Group>(null!);

  useKeepScale({ objectRef: groupRef, active: item.scaleInvariant });

  let itemComponent;
  switch (item.type) {
    case "pointer":
      itemComponent = <Pointer topColor={"#00A3E1"} />;
      break;
    case "box":
      itemComponent = <RotatingBox position={[0, 40, 0]} />;
      break;
    default:
      itemComponent = null;
  }

  return (
    <group ref={groupRef} {...props}>
      {itemComponent}
    </group>
  );
};

export const SceneItems: FunctionComponent<Props> = ({ items }) => {
  return (
    <group>
      {items.map((item) => (
        <SceneItemElement
          key={item.id}
          item={item}
          position={item.positionAndRotation.pos}
          quaternion={item.positionAndRotation.quat}
        />
      ))}
    </group>
  );
};
