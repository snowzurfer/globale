import { FunctionComponent, PropsWithChildren, useState } from "react";
// import firebase from 'firebase/app';
// import 'firebase/auth';
import { XMarkIcon } from "@heroicons/react/24/outline";
import { SwitchWithlabel } from "./SwitchWithLabel";
import {
  ALL_SCENE_ITEM_TYPES,
  SceneItemType,
  useGlobaleStore,
} from "@/app/store";
import { Modal } from "./Modal";

export const ItemsModal: FunctionComponent<{ onClose: () => void }> = ({
  onClose,
}) => {
  const itemToAdd = useGlobaleStore((state) => state.itemToAdd);
  const setItemToAdd = useGlobaleStore((state) => state.setItemToAdd);

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setItemToAdd(event.target.value as SceneItemType);
  };

  return (
    <Modal title="Items" onClose={onClose}>
      <div className="flex flex-col items-start w-full">
        <fieldset>
          <legend className="text-base font-semibold text-gray-900">
            Select a side
          </legend>
          <div className="mt-4 divide-y divide-gray-200 border-b border-t border-gray-200">
            {ALL_SCENE_ITEM_TYPES.map((type, idx) => (
              <div key={idx} className="relative flex items-start py-4">
                <div className="min-w-0 flex-1 text-sm leading-6">
                  <label
                    htmlFor={`side-${type}`}
                    className="select-none font-medium text-gray-900"
                  >
                    {type}
                  </label>
                </div>
                <div className="ml-3 flex h-6 items-center">
                  <input
                    id={`side-${type}`}
                    name="plan"
                    type="radio"
                    value={type}
                    checked={itemToAdd === type}
                    onChange={handleTypeChange}
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
              </div>
            ))}
          </div>
        </fieldset>
      </div>
    </Modal>
  );
};
