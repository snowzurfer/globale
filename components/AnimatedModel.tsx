import { Clone, useAnimations, useGLTF } from "@react-three/drei";
import { type GroupProps } from "@react-three/fiber";
import { type FunctionComponent, useRef, useEffect } from "react";
import { Mesh, type Group, SkinnedMesh } from "three";

export interface Props extends GroupProps {
  play?: boolean;
  path: string;
}

export const AnimatedModel: FunctionComponent<Props> = ({
  play = true,
  path,
  ...props
}) => {
  const shrekRef = useRef<Group>(null!);

  const { scene, animations } = useGLTF(path);
  const { actions, mixer } = useAnimations(animations, shrekRef);
  useEffect(() => {
    for (const name in actions) {
      actions[name]?.play();
    }
  });

  useEffect(() => {
    if (play) {
      for (const name in actions) {
        actions[name]?.play();
      }
    } else {
      for (const name in actions) {
        actions[name]?.stop();
      }
    }
  }, [play]);

  return <primitive object={scene} ref={shrekRef} {...props} />;
};
