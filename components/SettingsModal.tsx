import { FunctionComponent, PropsWithChildren } from "react";
import { firAuth } from "@/app/firebase";
import {
  GoogleAuthProvider,
  linkWithPopup,
  signInWithPopup,
} from "firebase/auth";
import { SwitchWithlabel } from "./SwitchWithLabel";
import { useGlobaleStore, deleteUser } from "@/app/store";
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
  const deleteItem = useGlobaleStore((state) => state.deleteItem);
  const promoteAnonymousUser = useGlobaleStore(
    (state) => state.promoteAnonymousUser
  );

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    try {
      // If the user was anonymous, copy their data to the new account
      if (user && user.isAnonymous) {
        const firUser = firAuth.currentUser;
        if (!firUser) throw new Error("No firebase user");

        const result = await linkWithPopup(firUser, provider);
        promoteAnonymousUser(result.user);
        console.log("Account linking result: ", result);
      } else {
        const result = await signInWithPopup(firAuth, provider);
        console.log("Login result: ", result);
      }
    } catch (error) {
      console.log("Login error: ", error);
      return;
    }
  };

  const handleSignOut = async () => {
    try {
      // If the user was anonymous, delete their data from firebase
      if (user && user.isAnonymous) {
        // Loop through all items that have the user as the owner and delete them
        // Make a copy of the items array because we will be modifying it
        const items = [...useGlobaleStore.getState().sceneItems];
        for (const item of items) {
          if (item.creatorUserId === user.id) {
            console.log("Trying to delete item: ", item);
            await deleteItem(item.id, true);
          }
        }

        await deleteUser(user.id);
      }

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
            <div className="flex flex-col items-start w-full gap-2 text-sm text-gray-500">
              <p>User ID: {user.id}</p>
              <p>Username: {user.username}</p>
              {/* <p className="text-xs text-gray-400">{user.email}</p> */}
              {user.isAnonymous && <p>(Signed in Anonymously)</p>}
              {user.isAnonymous && (
                <div className="flex flex-col items-start w-full">
                  <button
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={handleSignIn}
                  >
                    Log in with Google
                  </button>
                </div>
              )}
              <button
                className="w-full px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={handleSignOut}
              >
                {user.isAnonymous ? "Log out and delete account" : "Log out"}
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
