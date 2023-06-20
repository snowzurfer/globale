import { FunctionComponent } from "react";
import { ALL_SCENE_ITEMS, SceneItemType, useGlobaleStore } from "@/app/store";
import { Modal } from "./Modal";
import { clsxm } from "@/clsxm";

export const ItemsModal: FunctionComponent<{ onClose: () => void }> = ({
  onClose,
}) => {
  const itemToAdd = useGlobaleStore((state) => state.itemToAdd);
  const setItemToAdd = useGlobaleStore((state) => state.setItemToAdd);

  return (
    <Modal title="Items" onClose={onClose}>
      <div className="flex gap-2 overflow-auto">
        {Object.entries(ALL_SCENE_ITEMS).map(([key, item]) => (
          <div
            key={key}
            className={clsxm(
              "flex flex-col justify-end w-32 bg-gray-300 flex-shrink-0 rounded-md p-2 pointe-events-auto",
              itemToAdd === key && "bg-blue-500"
            )}
            onClick={() => setItemToAdd(key)}
          >
            <label
              htmlFor={`side-${item.name}`}
              className="select-none font-medium text-gray-900 w-full"
            >
              {item.name}
            </label>
          </div>
        ))}
      </div>
    </Modal>
  );
};
