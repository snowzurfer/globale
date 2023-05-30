import { type Quaternion, type Vector3 } from "three";
import { create } from "zustand";

export interface User {
  id: string;
  email?: string;
}

export type SceneItemType = "sphere" | "box" | "model" | "pointer" | "label";

export interface SceneItem {
  id: string;
  pos: Vector3;
  quat: Quaternion;
  type: SceneItemType;
  /**
   * Optional field for model type
   */
  model?: string;
  scaleInvariant?: boolean;
}

export type ModalType = "settings" | "credits";

export interface GlobaleStore {
  user?: User;
  setUser: (user: User) => void;
  isSignedIn: boolean;
  setIsSignedIn: (isSignedIn: boolean) => void;

  hasClickedOnce: boolean;
  setHasClickedOnce: (hasClickedOnce: boolean) => void;

  modal?: ModalType;
  setModal: (modal?: ModalType) => void;

  showPointer: boolean;
  setShowPointer: (showPointer: boolean) => void;

  clickToAdd: boolean;
  setClickToAdd: (clickToAdd: boolean) => void;

  sceneItems: SceneItem[];
  addSceneItem: (item: SceneItem) => void;
}

export const useGlobaleStore = create<GlobaleStore>()((set) => ({
  user: undefined,
  isSignedIn: false,
  setUser: (user) => set({ user }),
  setIsSignedIn: (isSignedIn: boolean) => set({ isSignedIn }),

  hasClickedOnce: false,
  setHasClickedOnce: (hasClickedOnce) => set({ hasClickedOnce }),

  modal: undefined,
  setModal: (modal) => set({ modal }),

  showPointer: true,
  setShowPointer: (showPointer) => set({ showPointer }),

  clickToAdd: true,
  setClickToAdd: (clickToAdd) => set({ clickToAdd }),

  sceneItems: [],
  addSceneItem: (item) =>
    set((state) => ({ sceneItems: [...state.sceneItems, item] })),
}));
