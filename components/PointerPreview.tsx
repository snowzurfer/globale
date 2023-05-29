import { Sphere } from "@react-three/drei";
import {
  type MaterialNode,
  type Object3DNode,
  extend,
  useFrame,
  useThree,
} from "@react-three/fiber";
import {
  FunctionComponent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { type Map } from "@submodules/ultraglobe/src/Map";
import {
  type Object3D,
  Raycaster,
  Vector2,
  Vector3,
  type Group,
  Quaternion,
} from "three";
import { MeshLineGeometry, MeshLineMaterial, raycast } from "meshline";
import { is } from "@react-three/fiber/dist/declarations/src/core/utils";

extend({ MeshLineGeometry, MeshLineMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: Object3DNode<MeshLineGeometry, typeof MeshLineGeometry>;
    meshLineMaterial: MaterialNode<MeshLineMaterial, typeof MeshLineMaterial>;
  }
}

const upVector = new Vector3(0, 1, 0);

export interface Props {
  ultraGlobeMapRef: MutableRefObject<Map | null>;
  onSelect?: (position: Vector3) => void;
}

export const PointerPreview: FunctionComponent<Props> = ({
  ultraGlobeMapRef,
  onSelect,
}) => {
  const gl = useThree((state) => state.gl);

  const pointerGroupRef = useRef<Group>(null!);
  /**
   * Reference to the tiles in the scene, used to interact with them.
   */
  const ceObjectRef = useRef<Object3D>();
  const [raycaster] = useState(() => new Raycaster());
  let [setupSelectCallback] = useState(() => false);
  let [normalVector] = useState(() => new Vector3());
  let [worldQuaternion] = useState(() => new Quaternion());
  let [earthCenterToIntersection] = useState(() => new Vector3());
  const isPointerDown = useRef(false);

  // Detect when the user is tapping or clicking the canvas
  useEffect(() => {
    const domElement = gl.domElement;
    const handlePointerDown = (_event: MouseEvent) => {
      isPointerDown.current = true;
    };

    domElement.addEventListener("pointerdown", handlePointerDown);

    const handlePointerUp = (_event: MouseEvent) => {
      isPointerDown.current = false;
    };

    domElement.addEventListener("pointerup", handlePointerUp);

    return () => {
      domElement.removeEventListener("click", handlePointerDown);
      domElement.removeEventListener("click", handlePointerUp);
    };
  }, [gl.domElement]);

  useFrame((state, _delta) => {
    if (isPointerDown.current) return;

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

    const group = pointerGroupRef.current;

    if (!setupSelectCallback) {
      if (map.selectController) {
        map.selectController.selectCallback = (mouseUpLocation: Vector2) => {
          const position = new Vector3().copy(group.position);
          onSelect?.(position);
        };
      }
    }

    const pointer = state.pointer;
    const camera = state.camera;
    raycaster.setFromCamera(pointer, camera);

    // Via the if statement above, we're ensured to have a ceObject by here
    const intersects = raycaster.intersectObject(ceObjectRef.current!);
    const firstIntersection = intersects[0];
    if (firstIntersection) {
      group.position.copy(firstIntersection.point);

      // Create a line from the point of collision to a few meters up, perpendicularly to the surface of collision
      firstIntersection.object.getWorldQuaternion(worldQuaternion);
      normalVector
        .copy(firstIntersection.face!.normal)
        .applyQuaternion(worldQuaternion)
        .normalize();

      earthCenterToIntersection.copy(firstIntersection.point).normalize();

      if (earthCenterToIntersection.dot(normalVector) > 0.3) {
        normalVector.copy(earthCenterToIntersection);
      } else {
        // Project the normal onto a plane that's perpendicular to the earth's center
        normalVector.projectOnPlane(earthCenterToIntersection);
      }

      // make the group's Y axis point in the same direction as the normal vector
      group.quaternion.setFromUnitVectors(upVector, normalVector);
    }

    // Make the spheres be at a constant size, based on the distance from the camera
    const distance = group.position.distanceTo(camera.position);
    group.scale.setScalar(distance / 1000);
  });

  return (
    <>
      <group ref={pointerGroupRef}>
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
          <meshLambertMaterial color="red" />
        </Sphere>
      </group>
    </>
  );
};
