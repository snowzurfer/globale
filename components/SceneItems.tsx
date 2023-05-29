/**
 * "Low Poly pine tree" (https://skfb.ly/o6s9O) by eucalyp555 is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
 */

import { FunctionComponent, useEffect, useRef } from "react";
import { type Object3D, type Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export interface SceneItem {
  id: string;
  pos: Vector3;
}

export interface Props {
  items: SceneItem[];
}

export const SceneItems: FunctionComponent<Props> = ({ items }) => {
  const objects = useRef<Object3D[]>(null!);

  useEffect(() => {
    objects.current.forEach((object: Object3D) => {
      object.removeFromParent();
    });
    objects.current.length = 0;

    items.forEach((item) => {
      // const;
    });
  }, []);

  return null;
};
