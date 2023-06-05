import { useFrame, useThree } from "@react-three/fiber";
import {
  FunctionComponent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
// @ts-ignore
import { type Map } from "@jdultra/ultra-globe/src/Map";
import {
  type Object3D,
  Raycaster,
  Vector2,
  Vector3,
  type Group,
  Quaternion,
} from "three";
import { Pointer } from "./Pointer";
import { useGlobaleStore } from "@/app/store";

const upVector = new Vector3(0, 1, 0);

export type OnSelectCallback = (
  position: Vector3,
  quaternion: Quaternion
) => void;

export interface Props {
  ultraGlobeMapRef: MutableRefObject<Map | null>;
  onSelect?: OnSelectCallback;
  interactsWithVerticalSurfaces?: boolean;
  enabled?: boolean;
}

export const PointerPreview: FunctionComponent<Props> = ({
  ultraGlobeMapRef,
  onSelect,
  interactsWithVerticalSurfaces = false,
  enabled: active = true,
}) => {
  const gl = useThree((state) => state.gl);

  const selectedItem = useGlobaleStore((state) => state.selectedItem);
  const hoveredItem = useGlobaleStore((state) => state.hoveredItem);
  const showPointer = useGlobaleStore((state) => state.showPointer);

  const visible =
    active &&
    selectedItem === undefined &&
    hoveredItem === undefined &&
    showPointer;

  const pointerGroupRef = useRef<Group>(null!);
  /**
   * Reference to the tiles in the scene, used to interact with them.
   */
  const ceObjectRef = useRef<Object3D>();
  const [raycaster] = useState(() => new Raycaster());
  const setupSelectCallback = useRef(false);
  const [normalVector] = useState(() => new Vector3());
  const [worldQuaternion] = useState(() => new Quaternion());
  const [earthCenterToIntersection] = useState(() => new Vector3());
  const [targetGroupPosition] = useState(() => new Vector3());
  const [targetGroupQuaternion] = useState(() => new Quaternion());
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

  // Reset the select callback whenever onSelect changes
  useEffect(() => {
    setupSelectCallback.current = false;
  }, [onSelect]);

  useFrame((state, _delta) => {
    if (
      isPointerDown.current ||
      selectedItem !== undefined ||
      hoveredItem !== undefined
    )
      return;

    const map = ultraGlobeMapRef.current;
    if (!map) return;

    // This way we only initialize it once
    if (!ceObjectRef.current) {
      // A brittle way to get the tileset from the layers, but ok for now.
      const ceObject = map.layerManager.layers[0].tileset;
      if (!ceObject) return;
      raycaster.layers.enable(ceObject.layers.mask);

      ceObjectRef.current = ceObject;
    }

    const group = pointerGroupRef.current;

    if (!setupSelectCallback.current) {
      if (map.selectController) {
        map.selectController.selectCallback = (_mouseUpLocation: Vector2) => {
          // If we're hovering, don't select on the globe
          const store = useGlobaleStore.getState();
          if (
            store.hoveredItem !== undefined ||
            store.selectedItem !== undefined
          )
            return;

          const position = new Vector3().copy(group.position);
          const quaternion = new Quaternion().copy(group.quaternion);

          onSelect?.(position, quaternion);
        };

        setupSelectCallback.current = true;
      }
    }

    const pointer = state.pointer;
    const camera = state.camera;
    raycaster.setFromCamera(pointer, camera);
    // const zoomController = map.zoomController;
    // const intersection = new Vector3();
    // const dist = zoomController.distEllipsoid(
    //   raycaster.ray.origin,
    //   raycaster.ray.direction,
    //   map.planet.a,
    //   intersection
    // );

    // const firstIntersection = {
    //   point: intersection,
    //   object: null,
    //   face: null,
    // };
    // if (dist >= 0) {

    // Via the if statement above, we're ensured to have a ceObject by here
    const intersects = raycaster.intersectObject(ceObjectRef.current!);
    const firstIntersection = intersects[0];
    // if (dist >= 0) {
    if (firstIntersection) {
      targetGroupPosition.copy(firstIntersection.point);

      earthCenterToIntersection.copy(firstIntersection.point).normalize();
      normalVector.copy(earthCenterToIntersection);

      if (interactsWithVerticalSurfaces) {
        // Create a line from the point of collision to a few meters up, perpendicularly to the surface of collision
        firstIntersection.object.getWorldQuaternion(worldQuaternion);
        normalVector
          .copy(firstIntersection.face!.normal)
          .applyQuaternion(worldQuaternion)
          .normalize();

        // Only rotate if we're on a steep surface
        if (earthCenterToIntersection.dot(normalVector) <= 0.3) {
          // Project the normal onto a plane that's perpendicular to the earth's center
          normalVector.projectOnPlane(earthCenterToIntersection);
        }
      }

      // make the group's Y axis point in the same direction as the normal vector
      targetGroupQuaternion.setFromUnitVectors(upVector, normalVector);
    }

    if (active) {
      group.position.lerp(targetGroupPosition, 0.13);
      group.quaternion.slerp(targetGroupQuaternion, 0.3);
    }

    // Make the spheres be at a constant size, based on the distance from the camera
    const distance = group.position.distanceTo(camera.position);
    group.scale.setScalar(distance / 1000);
  });

  return <Pointer ref={pointerGroupRef} visible={visible} />;
};

// const zoomController = map.zoomController;
// const intersection = new Vector3();
// const dist = zoomController.distEllipsoid(
//   raycaster.ray.origin,
//   raycaster.ray.direction,
//   map.planet.a,
//   intersection
// );

// const firstIntersection = {
//   point: intersection,
//   object: null,
//   face: null,
// };
// if (dist >= 0) {
