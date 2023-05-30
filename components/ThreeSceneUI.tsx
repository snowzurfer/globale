import React, { FunctionComponent, useState } from "react";
// import { WelcomeModalView } from "./WelcomeModalView"; // import your modal component
import { SettingsModal } from "./SettingsModal";
import { useGlobaleStore } from "@/app/store";
// import { ItemsModal } from "./ItemsModal";

export const ThreeSceneUI: FunctionComponent = () => {
  const modal = useGlobaleStore((state) => state.modal);
  const setModal = useGlobaleStore((state) => state.setModal);

  let modalComponent = null;
  switch (modal) {
    case "settings":
      modalComponent = <SettingsModal onClose={() => setModal(undefined)} />;
      break;
    // case "items":
    //   modalComponent = <ItemsModal onClose={() => setModal(null)} />;
    //   break;
    default:
      modalComponent = null;
  }

  return (
    <div>
      <div className="fixed top-0 right-0 p-4 flex space-x-4">
        <button
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => setModal("settings")}
        >
          Settings
        </button>

        {/* <button
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          // onClick={() => setShowItems(true)}
        >
          Add Item
        </button> */}
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
