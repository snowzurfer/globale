import { FunctionComponent, PropsWithChildren } from "react";
// import firebase from 'firebase/app';
// import 'firebase/auth';
import { SwitchWithlabel } from "./SwitchWithLabel";
import { useGlobaleStore } from "@/app/store";
import { Modal } from "./Modal";
import { clsxm } from "@/clsxm";

export interface SettingsSectionProps extends PropsWithChildren {
  title: string;
  titleClassName?: string;
}

export const SettingsSection: FunctionComponent<SettingsSectionProps> = ({
  title,
  children,
  titleClassName,
}) => {
  return (
    <div className="flex flex-col items-start w-full mb-3">
      <h2
        className={clsxm(
          "text-xl text-gray-800 font-semibold mb-2",
          titleClassName
        )}
      >
        {title}
      </h2>
      <div className="flex flex-col w-full gap-2">{children}</div>
    </div>
  );
};

export const SettingsModal: FunctionComponent<{ onClose: () => void }> = ({
  onClose,
}) => {
  const showPointer = useGlobaleStore((state) => state.showPointer);
  const setShowPointer = useGlobaleStore((state) => state.setShowPointer);

  const pointerInteractsWithVerticalSurfaces = useGlobaleStore(
    (state) => state.pointerInteractsWithVerticalSurfaces
  );
  const setPointerInteractsWithVerticalSurfaces = useGlobaleStore(
    (state) => state.setPointerInteractsWithVerticalSurfaces
  );

  const clickToAdd = useGlobaleStore((state) => state.clickToAdd);
  const setClickToAdd = useGlobaleStore((state) => state.setClickToAdd);

  const handleSignIn = async () => {
    // const provider = new firebase.auth.GoogleAuthProvider();
    // await firebase.auth().signInWithPopup(provider);
    onClose();
  };

  return (
    <Modal title="Settings" onClose={onClose}>
      <div className="flex flex-col items-start w-full">
        <SettingsSection title="Editor">
          <SwitchWithlabel
            label="Show pointer"
            enabled={showPointer}
            setEnabled={setShowPointer}
          />
          <SwitchWithlabel
            label="Pointer interacts with vertical surfaces"
            enabled={pointerInteractsWithVerticalSurfaces}
            setEnabled={setPointerInteractsWithVerticalSurfaces}
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
          Created by{" "}
          <a
            href="https://albertotaiuti.com/"
            className="text-blue-500 dark:text-blue-400 hover:underline"
          >
            Alberto Taiuti
          </a>
        </p>
        <p className="mt-2 font-secondary w-full text-center text-xs text-gray-400">
          <a
            href="https://github.com/snowzurfer/globale"
            className="text-blue-500 dark:text-blue-400 hover:underline"
          >
            Credits & Code
          </a>
        </p>
      </div>
    </Modal>
  );
};
