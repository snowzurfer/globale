import { useGlobaleStore, type SceneItemAndIndex } from "@/app/store";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { type FunctionComponent } from "react";
import { SettingsSection } from "./SettingsModal";
import { SwitchWithlabel } from "./SwitchWithLabel";

export interface Props {
  sceneItem: SceneItemAndIndex;
  onClose: () => void;
}

export const ObjectEditorPanel: FunctionComponent<Props> = ({
  sceneItem,
  onClose,
}) => {
  // Return a floating panel that is of fixed size, extends in length
  // and the width is fixed.

  const updateSceneItem = useGlobaleStore((state) => state.updateSceneItem);
  const sceneItems = useGlobaleStore((state) => state.sceneItems);

  return (
    <div className="w-64 bg-white shadow-lg rounded-md flex flex-col p-4 gap-2">
      <div className="flex flex-row justify-between gap-1 w-full mb-4">
        <h1 className="text-lg font-semibold text-gray-800 line-clamp-1">
          {sceneItem.itemId}
        </h1>
        <button
          type="button"
          className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={onClose}
        >
          <span className="sr-only">Close</span>
          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <SwitchWithlabel
        label="Scale Invariant"
        labelClassName="text-xs"
        enabled={sceneItems[sceneItem.index].scaleInvariant ?? true}
        setEnabled={() => {
          updateSceneItem(
            {
              ...sceneItems[sceneItem.index],
              scaleInvariant: !sceneItems[sceneItem.index].scaleInvariant,
            },
            sceneItem.index
          );
        }}
      />
      <div className="flex flex-row items-center justify-between w-full">
        <span className="text-xs text-gray-500">Color</span>
        <input
          type="color"
          className="w-8 h-8 rounded-md"
          value={sceneItems[sceneItem.index].color}
          onChange={(e) => {
            updateSceneItem(
              {
                ...sceneItems[sceneItem.index],
                color: e.target.value,
              },
              sceneItem.index
            );
          }}
        />
      </div>

      <div className="w-full">
        <p className="text-xs text-center text-gray-500">Created by: Nathan</p>
      </div>
    </div>
  );
};
