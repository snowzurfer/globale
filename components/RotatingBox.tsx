import { Box } from "@react-three/drei";
import { Color, MeshProps, useFrame } from "@react-three/fiber";
import { FunctionComponent, useRef, useState } from "react";
import { Mesh } from "three";

export interface Props extends Omit<MeshProps, "args"> {
  color?: Color;
  size?: number;
}

/**
 * A component that shows a box rotating around the Y axis
 * and slowly moving up and down.
 */
export const RotatingBox: FunctionComponent<Props> = ({
  color = "#049ef4",
  size = 13,
  ...props
}) => {
  const ref = useRef<Mesh>(null!);

  // Unphase the objects so they don't all move in sync
  const [offset] = useState(Math.random() * Math.PI * 2);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + offset;
    const y = Math.sin(t) * 12;
    const rotation = t * 0.5;

    ref.current.position.y = y + 40;
    ref.current.rotation.y = rotation;
  });

  return (
    <Box ref={ref} args={[size, size, size]} {...props}>
      <meshStandardMaterial
        color={color}
        roughness={0.4}
        metalness={0.835}
        transparent
        opacity={0.8}
      />
    </Box>
  );
};
