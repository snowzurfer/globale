import { FunctionComponent } from "react";
// import { WelcomeModalView } from "./WelcomeModalView"; // import your modal component
import { SettingsModal } from "./SettingsModal";
import { useGlobaleStore } from "@/app/store";
import { ItemsModal } from "./ItemsModal";
import { Cog6ToothIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import { ObjectEditorPanel } from "./ObjectEditor";

export const ThreeSceneUI: FunctionComponent = () => {
  const modal = useGlobaleStore((state) => state.modal);
  const setModal = useGlobaleStore((state) => state.setModal);
  const selectedItem = useGlobaleStore((state) => state.selectedItem);
  const setSelectedItem = useGlobaleStore((state) => state.setSelectedItem);

  let modalComponent = null;
  switch (modal) {
    case "settings":
      modalComponent = (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <SettingsModal onClose={() => setModal(undefined)} />
        </div>
      );
      break;
    case "items":
      modalComponent = (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <ItemsModal onClose={() => setModal(undefined)} />
        </div>
      );
      break;
    default:
      modalComponent = null;
  }

  return (
    <div>
      <div className="fixed top-0 right-0 p-4 flex space-x-4">
        <button
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          // Toggle items modal
          onClick={() => {
            if (modal === "items") {
              setModal(undefined);
            } else {
              setModal("items");
            }
          }}
        >
          <div className="flex gap-2">
            <Squares2X2Icon className="w-5 h-5 " /> <span>Items</span>
          </div>
        </button>

        <button
          className="px-4 py-2 text-sm font-medium text-white bg-gray-500 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          onClick={() => {
            if (modal === "settings") {
              setModal(undefined);
            } else {
              setModal("settings");
            }
          }}
        >
          <Cog6ToothIcon className="w-5 h-5" />
        </button>
      </div>

      {selectedItem && (
        <div className="fixed right-0 top-12 p-4">
          <ObjectEditorPanel
            sceneItem={selectedItem}
            onClose={() => setSelectedItem(undefined)}
          />
        </div>
      )}

      {modalComponent}
    </div>
  );
};
