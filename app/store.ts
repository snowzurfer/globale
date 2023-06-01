import { create } from "zustand";
import { onAuthStateChanged } from "firebase/auth";
import { firAuth } from "./firebase";
import { generateUsername } from "friendly-username-generator";

export interface User {
  id: string;
  username: string;
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
   * Optional field for color
   */
  color?: string;
  /**
   * Optional field for model type
   */
  model?: string;
  scaleInvariant: boolean;
}

export interface SceneItemAndIndex {
  itemId: SceneItem["id"];
  index: number;
}

export type ModalType = "settings" | "credits" | "items";

export interface GlobaleStore {
  user?: User;
  setUser: (user: User) => void;

  googleTilesAPIKey?: string;
  setGoogleTilesAPIKey: (googleTilesAPIKey?: string) => void;

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
  updateSceneItem: (item: SceneItem, atIndex: number) => void;

  showAddItemMenu: boolean;
  pointerPosition: PositionAndRotation;
  setShowAddItemMenu: (
    showAddItemMenu: boolean,
    pointerPosition: PositionAndRotation
  ) => void;
  itemToAdd: SceneItemType;
  setItemToAdd: (itemToAdd: SceneItemType) => void;
  hoveredItem?: SceneItemAndIndex;
  setHoveredItem: (itemId?: SceneItem["id"]) => void;
  selectedItem?: SceneItemAndIndex;
  setSelectedItem: (itemId?: SceneItem["id"]) => void;
}

export const useGlobaleStore = create<GlobaleStore>()((set, get) => ({
  user: undefined,
  setUser: (user) => set({ user }),

  googleTilesAPIKey: undefined,
  setGoogleTilesAPIKey: (googleTilesAPIKey) => set({ googleTilesAPIKey }),

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
    set({ pointerPosition, showAddItemMenu });
  },

  itemToAdd: "pointer",
  setItemToAdd: (itemToAdd) => set({ itemToAdd }),
  updateSceneItem: (item, atIndex) =>
    set((state) => {
      const newSceneItems = [...state.sceneItems];
      newSceneItems[atIndex] = item;
      return { sceneItems: newSceneItems };
    }),

  hoveredItem: undefined,
  setHoveredItem: (itemId) => {
    if (itemId) {
      const index = get().sceneItems.findIndex((item) => item.id === itemId);
      if (index !== -1) {
        set({ hoveredItem: { itemId, index } });
      }
    } else {
      set({ hoveredItem: undefined });
    }
  },

  selectedItem: undefined,
  setSelectedItem: (itemId) => {
    if (itemId) {
      const index = get().sceneItems.findIndex((item) => item.id === itemId);
      if (index !== -1) {
        set({ selectedItem: { itemId, index } });
      }
    } else {
      set({ selectedItem: undefined });
    }
  },
}));

// Subscribe to firebase auth changes and update the store
onAuthStateChanged(firAuth, (user) => {
  console.log("onAuthStateChanged", user);
  if (user) {
    useGlobaleStore.setState({
      user: { id: user.uid, username: generateUsername() },
    });
    console.log("Set state for user");
  } else {
    useGlobaleStore.setState({ user: undefined });
  }
});
