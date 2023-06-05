import { Html } from "@react-three/drei";
import { type FunctionComponent } from "react";

import { Group, Object3D, Camera } from "three";
import { Assign } from "utility-types";
import { ReactThreeFiber } from "@react-three/fiber";

export interface HtmlProps
  extends Omit<
    Assign<
      React.HTMLAttributes<HTMLDivElement>,
      ReactThreeFiber.Object3DNode<Group, typeof Group>
    >,
    "ref"
  > {
  prepend?: boolean;
  center?: boolean;
  fullscreen?: boolean;
  eps?: number;
  portal?: React.MutableRefObject<HTMLElement>;
  distanceFactor?: number;
  sprite?: boolean;
  transform?: boolean;
  zIndexRange?: Array<number>;
  as?: string;
  wrapperClass?: string;
  occlude?: React.RefObject<Object3D>[] | boolean | "raycast" | "blending";
  onOcclude?: (visible: boolean) => null;
  material?: React.ReactNode;
  geometry?: React.ReactNode;
  castShadow?: boolean;
  receiveShadow?: boolean;
}

export interface Props extends HtmlProps {
  text: string;
  onClick: () => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

export const Label: FunctionComponent<Props> = ({
  text,
  onPointerEnter,
  onPointerLeave,
  onClick,
  center = true,
  ...props
}) => {
  return (
    <Html {...props}>
      <div
        className="label bg-white rounded px-3 py-1 w-max"
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onClick={onClick}
      >
        <p className="label-text text-gray-600">{text}</p>
      </div>
    </Html>
  );
};
