import React, { FunctionComponent, useState } from "react";
// import { WelcomeModalView } from "./WelcomeModalView"; // import your modal component
import { SettingsModal } from "./SettingsModal";
import { useGlobaleStore } from "@/app/store";
import { ItemsModal } from "./ItemsModal";
import { Cog6ToothIcon, Squares2X2Icon } from "@heroicons/react/24/outline";

export const ThreeSceneUI: FunctionComponent = () => {
  const modal = useGlobaleStore((state) => state.modal);
  const setModal = useGlobaleStore((state) => state.setModal);

  let modalComponent = null;
  switch (modal) {
    case "settings":
      modalComponent = <SettingsModal onClose={() => setModal(undefined)} />;
      break;
    case "items":
      modalComponent = <ItemsModal onClose={() => setModal(undefined)} />;
      break;
    default:
      modalComponent = null;
  }

  return (
    <div>
      <div className="fixed top-0 right-0 p-4 flex space-x-4">
        <button
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => setModal("items")}
        >
          <div className="flex gap-2"><Squares2X2Icon className="w-5 h-5 "/> <span>Items</span></div>
        </button>

        <button
            className="px-4 py-2 text-sm font-medium text-white bg-gray-500 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          onClick={() => setModal("settings")}
        >
          <Cog6ToothIcon className="w-5 h-5" />
        </button>
      </div>


      {/* {showWelcome && (
        <WelcomeModalView setHasClickedOnce={() => setShowWelcome(false)} />
      )} */}
      {/* {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />} */}
      {/* {showItems && <ItemsModal onClose={() => setShowItems(false)} />} */}
      {modalComponent}
    </div>
  );
};
