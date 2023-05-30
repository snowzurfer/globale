import { create } from "zustand";

export interface User {
  id: string;
  email?: string;
}

export type SceneItemType = "sphere" | "box" | "model" | "pointer" | "label";
export const ALL_SCENE_ITEM_TYPES: SceneItemType[] = [
  "sphere",
  "box",
  "model",
  "pointer",
  "label",
];

export interface PositionAndRotation {
  pos: [number, number, number];
  quat: [number, number, number, number];
}

export interface SceneItem {
  id: string;
  positionAndRotation: PositionAndRotation;
  type: SceneItemType;
  /**
   * Optional field for model type
   */
  model?: string;
  scaleInvariant?: boolean;
}

export type ModalType = "settings" | "credits" | "items";

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

  pointerInteractsWithVerticalSurfaces: boolean;
  setPointerInteractsWithVerticalSurfaces: (
    pointerInteractsWithVerticalSurfaces: boolean
  ) => void;

  clickToAdd: boolean;
  setClickToAdd: (clickToAdd: boolean) => void;

  sceneItems: SceneItem[];
  addSceneItem: (item: SceneItem) => void;

  showAddItemMenu: boolean;
  pointerPosition: PositionAndRotation;
  setShowAddItemMenu: (
    showAddItemMenu: boolean,
    pointerPosition: PositionAndRotation
  ) => void;
  itemToAdd: SceneItemType;
  setItemToAdd: (itemToAdd: SceneItemType) => void;
}

export const useGlobaleStore = create<GlobaleStore>()((set, get) => ({
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

  pointerInteractsWithVerticalSurfaces: false,
  setPointerInteractsWithVerticalSurfaces: (
    pointerInteractsWithVerticalSurfaces
  ) => set({ pointerInteractsWithVerticalSurfaces }),

  clickToAdd: true,
  setClickToAdd: (clickToAdd) => set({ clickToAdd }),

  sceneItems: [],
  addSceneItem: (item) =>
    set((state) => ({ sceneItems: [...state.sceneItems, item] })),

  showAddItemMenu: false,
  pointerPosition: {
    pos: [0, 0, 0],
    quat: [0, 0, 0, 1],
  },
  setShowAddItemMenu: (showAddItemMenu, pointerPosition) => {
    // get().pointerCartesianPosition.copy(pointerCartesianPosition);
    set({ pointerPosition, showAddItemMenu });
  },

  itemToAdd: "pointer",
  setItemToAdd: (itemToAdd) => set({ itemToAdd }),
}));
