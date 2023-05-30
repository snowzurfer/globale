import { type Quaternion, type Vector3 } from "three";
import { create } from "zustand";

export interface User {
  id: string;
  email?: string;
}

export interface SceneItem {
  id: string;
  pos: Vector3;
  quat: Quaternion;
  scaleInvariant?: boolean;
}

export interface GlobaleStore {
  user?: User;
  setUser: (user: User) => void;
  isSignedIn: boolean;
  setIsSignedIn: (isSignedIn: boolean) => void;
 
  hasClickedOnce: boolean;
  setHasClickedOnce: (hasClickedOnce: boolean) => void;  

  showPointer: boolean;
  setShowPointer: (showPointer: boolean) => void;

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

  showPointer: true,
  setShowPointer: (showPointer) => set({ showPointer }),

  sceneItems: [],
  addSceneItem: (item) =>
    set((state) => ({ sceneItems: [...state.sceneItems, item] })),
}));
