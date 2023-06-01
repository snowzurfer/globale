import { FunctionComponent, PropsWithChildren } from "react";
// import firebase from 'firebase/app';
// import 'firebase/auth';
import { firAuth } from "@/app/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
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

  const user = useGlobaleStore((state) => state.user);

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(firAuth, provider);
      console.log("Login result: ", result);
    } catch (error) {
      console.log("Login error: ", error);
      return;
    }
  };

  const handleSignOut = async () => {
    try {
      await firAuth.signOut();
    } catch (error) {
      console.log("Logout error: ", error);
      return;
    }
  };

  return (
    <Modal title="Settings" onClose={onClose}>
      <div id="firebaseui-auth-container" />
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
          {user && (
            <div className="flex flex-col items-start w-full gap-2">
              <p className="text-sm text-gray-500 ">User ID: {user.id}</p>
              <p className="text-sm text-gray-500 ">Username: {user.username}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
              <button
                className="w-full px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={handleSignOut}
              >
                Log out
              </button>
            </div>
          )}
          {!user && (
            <div className="flex flex-col items-start w-full gap-2">
              <button
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={handleSignIn}
              >
                Log in with Google
              </button>
            </div>
          )}
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
