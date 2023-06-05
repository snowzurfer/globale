import {
  useGlobaleStore,
  type SceneItemAndIndex,
  convertCartesianToGeo,
  convertGeoToCartesian,
} from "@/app/store";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { type FunctionComponent } from "react";
import { SwitchWithlabel } from "./SwitchWithLabel";

export interface Props {
  sceneItem: SceneItemAndIndex;
  onClose: () => void;
}

// Return a floating panel that is of fixed size, extends in length
// and the width is fixed.
export const ObjectEditorPanel: FunctionComponent<Props> = ({
  sceneItem,
  onClose,
}) => {
  const updateSceneItem = useGlobaleStore((state) => state.updateSceneItem);
  const sceneItems = useGlobaleStore((state) => state.sceneItems);
  const deleteItem = useGlobaleStore((state) => state.deleteItem);

  // Convert the positions to long , lat, alt
  const [lng, lat, alt] = convertCartesianToGeo(
    sceneItems[sceneItem.index].positionAndRotation.pos
  );

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
      {sceneItems[sceneItem.index].item.color && (
        <div className="flex flex-row items-center justify-between w-full">
          <span className="text-xs text-gray-500">Color</span>
          <input
            type="color"
            className="w-8 h-8 rounded-md"
            value={sceneItems[sceneItem.index].item.color}
            onChange={(e) => {
              updateSceneItem(
                {
                  ...sceneItems[sceneItem.index],
                  item: {
                    ...sceneItems[sceneItem.index].item,
                    color: e.target.value,
                  },
                },
                sceneItem.index
              );
            }}
          />
        </div>
      )}
      <div className="flex flex-col items-center justify-between w-full gap-1">
        <span className="text-xs text-gray-500 w-full text-left">Pos</span>
        <input
          type="number"
          className="w-full h-8 rounded-md text-xs text-gray-400"
          value={lat}
          onChange={(e) => {
            updateSceneItem(
              {
                ...sceneItems[sceneItem.index],
                positionAndRotation: {
                  ...sceneItems[sceneItem.index].positionAndRotation,
                  pos: [
                    parseInt(e.target.value),
                    sceneItems[sceneItem.index].positionAndRotation.pos[1],
                    sceneItems[sceneItem.index].positionAndRotation.pos[2],
                  ],
                },
              },
              sceneItem.index
            );
          }}
        />
        <input
          type="number"
          className="w-full h-8 rounded-md text-xs text-gray-400"
          value={lng}
          onChange={(e) => {
            updateSceneItem(
              {
                ...sceneItems[sceneItem.index],
                positionAndRotation: {
                  ...sceneItems[sceneItem.index].positionAndRotation,
                  pos: [
                    sceneItems[sceneItem.index].positionAndRotation.pos[0],
                    parseInt(e.target.value),
                    sceneItems[sceneItem.index].positionAndRotation.pos[2],
                  ],
                },
              },
              sceneItem.index
            );
          }}
        />
        <input
          type="number"
          className="w-full h-8 rounded-md text-xs text-gray-400"
          value={alt}
          onChange={(e) => {
            // Convert back to cartesian
            const [x, y, z] = convertGeoToCartesian([
              lat,
              lng,
              parseFloat(e.target.value),
            ]);

            updateSceneItem(
              {
                ...sceneItems[sceneItem.index],
                positionAndRotation: {
                  ...sceneItems[sceneItem.index].positionAndRotation,
                  pos: [x, y, z],
                },
              },
              sceneItem.index
            );
          }}
        />
      </div>
      {sceneItems[sceneItem.index].item.text !== undefined && (
        <div className="flex flex-col ">
          <input
            type="text"
            name="text"
            id="text"
            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Label"
            aria-describedby="label"
            value={sceneItems[sceneItem.index].item.text}
            onChange={(e) => {
              updateSceneItem(
                {
                  ...sceneItems[sceneItem.index],
                  item: {
                    ...sceneItems[sceneItem.index].item,
                    text: e.target.value,
                  },
                },
                sceneItem.index
              );
            }}
          />
        </div>
      )}
      <div className="flex flex-row items-center justify-between w-full gap-1">
        <button
          className="w-full h-8 rounded-md text-xs bg-red-500 text-white"
          onClick={async () => {
            await deleteItem(sceneItem.itemId, true);
            onClose();
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};
