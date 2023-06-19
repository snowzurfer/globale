/**
 * "Low Poly pine tree" (https://skfb.ly/o6s9O) by eucalyp555 is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
 */

import { useGlobaleStore, type SceneItem } from "@/app/store";
import { useKeepScale } from "@/hooks/useKeepScale";
import { type GroupProps } from "@react-three/fiber";
import {
  FunctionComponent,
  Suspense,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { Matrix4, type Group, Quaternion, Vector3, Euler } from "three";
import { Pointer } from "./Pointer";
import { RotatingBox } from "./RotatingBox";
import { Gltf, PivotControls } from "@react-three/drei";
import { throttle } from "lodash";
import { AnimatedModel } from "./AnimatedModel";
import { Label } from "./Label";

export interface Props {
  items: SceneItem[];
}

export interface SceneItemElementProps extends GroupProps {
  item: SceneItem;
  index: number;
}

export const SceneItemElement: FunctionComponent<SceneItemElementProps> = ({
  item: sceneItem,
  scale,
  index,
  ...props
}) => {
  const groupRef = useRef<Group>(null!);

  const user = useGlobaleStore((state) => state.user);
  const setHoveredItem = useGlobaleStore((state) => state.setHoveredItem);
  const selectedItem = useGlobaleStore((state) => state.selectedItem);
  const setSelectedItem = useGlobaleStore((state) => state.setSelectedItem);
  const setInteractingWithItemFromScene = useGlobaleStore(
    (state) => state.setInteractingWithItemFromScene
  );
  const updateSceneItem = useGlobaleStore((state) => state.updateSceneItem);

  useKeepScale({
    objectRef: groupRef,
    active: sceneItem.scaleInvariant,
    originalScale: scale,
  });

  const handleOnClick = () => {
    console.log("Clicked");
    // If the user doesn't own this item, don't do anything.
    if (sceneItem.creatorUserId !== user?.id) return;

    setSelectedItem(sceneItem.id);
  };

  const handleOnPointerEnter = () => {
    console.log("Hovering");
    setHoveredItem(sceneItem.id);
  };
  const handleOnPointerLeave = () => setHoveredItem(undefined);

  let itemComponent;
  switch (sceneItem.item.name) {
    case "Pointer":
      itemComponent = <Pointer topColor={sceneItem.item.color} />;
      break;
    case "Box":
      itemComponent = (
        <RotatingBox position={[0, 40, 0]} color={sceneItem.item.color} />
      );
      break;
    case "Ferrari Dino":
      itemComponent = (
        <Suspense fallback={null}>
          <Gltf src="/ferrari_dino_246/scene.gltf" />
        </Suspense>
      );
    case "Shrek":
      itemComponent = <AnimatedModel path={sceneItem.item.model!} />;
      break;
    case "Standing Dragon":
      itemComponent = <AnimatedModel path={sceneItem.item.model!} scale={30} />;
      break;
    case "Label":
      itemComponent = (
        <Label
          text={sceneItem.item.text!}
          onClick={handleOnClick}
          onPointerEnter={handleOnPointerEnter}
          onPointerLeave={handleOnPointerLeave}
        />
      );
      break;
    default:
      itemComponent = null;
  }

  const [cachedMatrix] = useState(() => new Matrix4());
  const [cachedRotationMatrix] = useState(() => new Matrix4());
  const [cachedQuaternion] = useState(() => new Quaternion());

  const matrix = useMemo(() => {
    return cachedMatrix
      .makeTranslation(
        sceneItem.positionAndRotation.pos[0],
        sceneItem.positionAndRotation.pos[1],
        sceneItem.positionAndRotation.pos[2]
      )
      .multiply(
        cachedRotationMatrix.makeRotationFromQuaternion(
          cachedQuaternion.fromArray(sceneItem.positionAndRotation.quat)
        )
      );
  }, [sceneItem.positionAndRotation.pos, sceneItem.positionAndRotation.quat]);

  const throttledHandleDrag = useMemo(
    () =>
      throttle((worldMatrix: Matrix4, item: SceneItem, index: number) => {
        // Extract position and rotation from the world matrix.
        const position = new Vector3().setFromMatrixPosition(worldMatrix);
        const rotation = new Quaternion().setFromRotationMatrix(worldMatrix);

        updateSceneItem(
          {
            ...item,
            positionAndRotation: {
              pos: position.toArray(),
              quat: rotation.toArray() as [number, number, number, number],
            },
          },
          index
        );
      }, 30),
    []
  );

  const handleOnDrag = useCallback(
    (worldMatrix: Matrix4, item: SceneItem, index: number) => {
      throttledHandleDrag(worldMatrix, item, index);
    },
    [throttledHandleDrag]
  );

  const pivotActive = sceneItem.id === selectedItem?.itemId;

  return (
    <PivotControls
      fixed={true}
      scale={40}
      matrix={matrix}
      visible={pivotActive}
      disableRotations={!pivotActive}
      disableSliders={!pivotActive}
      disableAxes={!pivotActive}
      onDragStart={() => setInteractingWithItemFromScene(true)}
      onDrag={(_l, _deltaL, w, _deltaW) => {
        handleOnDrag(w, sceneItem, index);
      }}
      onDragEnd={() => setInteractingWithItemFromScene(false)}
      depthTest={false}
    >
      <group
        ref={groupRef}
        scale={scale}
        onPointerEnter={handleOnPointerEnter}
        onPointerLeave={handleOnPointerLeave}
        onClick={handleOnClick}
      >
        <group
          scale={
            sceneItem.scaleInvariant
              ? sceneItem.item.scaleInvariantBaseScale
              : sceneItem.item.baseScale
          }
        >
          {itemComponent}
        </group>
      </group>
    </PivotControls>
  );
};

export const SceneItems: FunctionComponent<Props> = ({ items }) => {
  return (
    <group>
      {items.map((item, index) => (
        <SceneItemElement key={item.id} item={item} index={index} />
      ))}
    </group>
  );
};
