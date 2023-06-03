import { FunctionComponent } from "react";
// import firebase from 'firebase/app';
// import 'firebase/auth';
import {
  ALL_SCENE_ITEM_TYPES,
  SceneItemType,
  useGlobaleStore,
} from "@/app/store";
import { Modal } from "./Modal";
import { clsxm } from "@/clsxm";

export const ItemsModal: FunctionComponent<{ onClose: () => void }> = ({
  onClose,
}) => {
  const itemToAdd = useGlobaleStore((state) => state.itemToAdd);
  const setItemToAdd = useGlobaleStore((state) => state.setItemToAdd);

  const handleTypeChange = (item: SceneItemType) => {
    setItemToAdd(item);
  };

  return (
    <Modal title="Items" onClose={onClose}>
      <div className="flex gap-2 overflow-auto">
        {ALL_SCENE_ITEM_TYPES.map((type, idx) => (
          <div
            key={idx}
            className={clsxm(
              "flex flex-col justify-end w-32 h-32 bg-gray-300 flex-shrink-0 rounded-md p-2 pointe-events-auto",
              itemToAdd === type && "bg-blue-500"
            )}
            onClick={() => handleTypeChange(type)}
          >
            <label
              htmlFor={`side-${type}`}
              className="select-none font-medium text-gray-900 w-full"
            >
              {type}
            </label>
          </div>
        ))}
      </div>
    </Modal>
  );
};
