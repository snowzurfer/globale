import { FunctionComponent, PropsWithChildren } from "react";
// import firebase from 'firebase/app';
// import 'firebase/auth';
import { XMarkIcon } from "@heroicons/react/24/outline";
import { SwitchWithlabel } from "./SwitchWithLabel";
import { useGlobaleStore } from "@/app/store";

export interface SettingsSectionProps extends PropsWithChildren {
  title: string;
}

export const SettingsSection: FunctionComponent<SettingsSectionProps> = ({
  title,
  children,
}) => {
  return (
    <div className="flex flex-col items-start w-full mb-3">
      <h2 className="text-xl text-gray-800 font-semibold mb-2">{title}</h2>
      <div className="flex flex-col w-full gap-2">{children}</div>
    </div>
  );
};

export const SettingsModal: FunctionComponent<{ onClose: () => void }> = ({
  onClose,
}) => {

  const showPointer = useGlobaleStore((state) => state.showPointer);
  const setShowPointer = useGlobaleStore((state) => state.setShowPointer);

  const clickToAdd = useGlobaleStore((state) => state.clickToAdd);
  const setClickToAdd = useGlobaleStore((state) => state.setClickToAdd);

  const handleSignIn = async () => {
    // const provider = new firebase.auth.GoogleAuthProvider();
    // await firebase.auth().signInWithPopup(provider);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="relative w-full max-w-lg px-6 py-4 bg-white shadow-lg rounded-md text-center flex flex-col items-start">
        <div className="flex flex-row justify-between w-full mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
          <button
            type="button"
            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <SettingsSection title="Editor">
          <SwitchWithlabel
            label="Show pointer"
            enabled={showPointer}
            setEnabled={setShowPointer}
          />
          <SwitchWithlabel
            label="Click to add item"
            enabled={clickToAdd}
            setEnabled={setClickToAdd}
          />
        </SettingsSection>

        <SettingsSection title="Account">
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            // onClick={handleSignIn}
          >
            Log in with Google
          </button>
        </SettingsSection>

        <p className="mt-6 font-secondary w-full text-center text-xs text-gray-400">
          Made by{" "}
          <a
            href="https://albertotaiuti.com/"
            className="text-blue-500 dark:text-blue-400 hover:underline"
          >
            Alberto Taiuti
          </a>
        </p>
      </div>
    </div>
  );
};