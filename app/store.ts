import { create } from "zustand";
import { onAuthStateChanged } from "firebase/auth";
import { firAuth, firRealtimeDB } from "./firebase";
import { generateUsername } from "friendly-username-generator";
import proj4 from "proj4";
import { get, onValue, ref, remove, set } from "firebase/database";

export interface User {
  id: string;
  username: string;
  email?: string;
  isAnonymous: boolean;
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
  creatorUserId: string;
}

export interface SceneItemAndIndex {
  itemId: SceneItem["id"];
  index: number;
}

export type ModalType = "settings" | "credits" | "items";

const HAS_CLICKED_ONCE_KEY = "hasClickedOnce";

export interface GlobaleStore {
  user?: User;
  setUser: (user: User) => void;

  googleTilesAPIKey?: string;
  setGoogleTilesAPIKey: (googleTilesAPIKey?: string) => Promise<void>;

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

  isDoingBlockingUpdateToFirebase: boolean;
  setIsDoingBlockingUpdateToFirebase: (
    isDoingBlockingUpdateToFirebase: boolean
  ) => void;

  sceneItems: SceneItem[];
  addSceneItem: (item: SceneItem, toFirebase?: Boolean) => Promise<void>;
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
  deleteItem: (itemId: SceneItem["id"], toFirebase?: Boolean) => Promise<void>;
}

export const useGlobaleStore = create<GlobaleStore>()((set, get) => ({
  user: undefined,
  setUser: (user) => set({ user }),

  googleTilesAPIKey: undefined,
  setGoogleTilesAPIKey: async (googleTilesAPIKey) => {
    // Store to firebase if logged in
    const user = get().user;
    if (user) {
      await setGoogleTilesAPIKeyToFirebase(googleTilesAPIKey ?? "", user.id);
    }

    set({ googleTilesAPIKey });
  },

  hasClickedOnce: false,
  setHasClickedOnce: (hasClickedOnce) => {
    set({ hasClickedOnce });
    // Save to local storage
    window.localStorage.setItem(
      HAS_CLICKED_ONCE_KEY,
      JSON.stringify(hasClickedOnce)
    );
  },

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

  isDoingBlockingUpdateToFirebase: false,
  setIsDoingBlockingUpdateToFirebase: (isDoingBlockingUpdateToFirebase) =>
    set({ isDoingBlockingUpdateToFirebase }),

  sceneItems: [],
  addSceneItem: async (item, toFirebase = false) => {
    if (toFirebase) {
      set({ isDoingBlockingUpdateToFirebase: true });
      await addItemToFirebase(item);
      set({ isDoingBlockingUpdateToFirebase: false });
    }
    set((state) => ({ sceneItems: [...state.sceneItems, item] }));
  },

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
  deleteItem: async (itemId, toFirebase = false) => {
    // Check that the item exists
    const index = get().sceneItems.findIndex((item) => item.id === itemId);
    if (index === -1) return;

    if (toFirebase) {
      set({ isDoingBlockingUpdateToFirebase: true });
      await deleteItemFromFirebase(itemId);
      set({ isDoingBlockingUpdateToFirebase: false });
    }

    // Delete the item
    set((state) => {
      const newSceneItems = [...state.sceneItems];
      newSceneItems.splice(index, 1);
      return { sceneItems: newSceneItems };
    });
  },
}));

// Geo conversion
// Gotten from https://epsg.io/4978
proj4.defs(
  "EPSG:4978",
  "+proj=geocent +datum=WGS84 +units=m +no_defs +type=crs"
);
// Gotten from https://epsg.io/4326
proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs +type=crs");
export const converterToGeo = proj4("EPSG:4326", "EPSG:4978");

export const convertCartesianToGeo = (cartesian: [number, number, number]) => {
  const converted = converterToGeo.inverse([
    cartesian[2],
    cartesian[0],
    cartesian[1],
  ]);

  if (converted.length !== 3) {
    throw new Error("Converted length is not 3");
  }

  return converted;
};

export const convertGeoToCartesian = (geo: [number, number, number]) => {
  const converted = converterToGeo.forward(geo);

  if (converted.length !== 3) {
    throw new Error("Converted length is not 3");
  }

  return [converted[1], converted[2], converted[0]] as [number, number, number];
};

// Subscribe to firebase auth changes and update the store
onAuthStateChanged(firAuth, (user) => {
  console.log("onAuthStateChanged", user);
  if (user) {
    useGlobaleStore.setState({
      user: {
        id: user.uid,
        username: generateUsername(),
        isAnonymous: user.isAnonymous,
      },
    });
    console.log("Set state for user, user: ", user.uid);

    // Fetch the google tiles api key
    const userId = user.uid;
    const googleTilesAPIKeyRef = ref(
      firRealtimeDB,
      `users/${userId}/googleTilesAPIKey`
    );
    get(googleTilesAPIKeyRef).then((snapshot) => {
      const googleTilesAPIKey = snapshot.val();
      console.log("Got googleTilesAPIKey", googleTilesAPIKey);
      useGlobaleStore.setState({ googleTilesAPIKey });
    });
  } else {
    useGlobaleStore.setState({ user: undefined, googleTilesAPIKey: undefined });
  }
});

// Firebase Realtime Database functions
const addItemToFirebase = async (item: SceneItem) => {
  // Convert from cartesian to geo
  const converted = convertCartesianToGeo(item.positionAndRotation.pos);

  /**
   * This is the same as the item, but with the position converted to geo
   */
  const newItem: SceneItem = {
    ...item,
    positionAndRotation: {
      ...item.positionAndRotation,
      pos: converted as [number, number, number],
    },
  };

  await set(ref(firRealtimeDB, `sceneItems/${item.id}`), newItem);
};

const deleteItemFromFirebase = async (itemId: SceneItem["id"]) => {
  remove(ref(firRealtimeDB, `sceneItems/${itemId}`));
};

const setGoogleTilesAPIKeyToFirebase = async (key: string, userId: string) => {
  await set(ref(firRealtimeDB, `users/${userId}/googleTilesAPIKey`), key);
};

// Subscribe to firebase changes and update the store
onValue(ref(firRealtimeDB, "sceneItems"), (snapshot) => {
  const data = snapshot.val();
  if (!data) return;

  const items = Object.values(data) as SceneItem[];

  const mapped = items.map((item) => ({
    ...item,
    positionAndRotation: {
      ...item.positionAndRotation,
      pos: convertGeoToCartesian(item.positionAndRotation.pos),
    },
  }));

  useGlobaleStore.setState({
    sceneItems: mapped,
  });
});

// Combine store and firebase so that when the user changes, we can update the firebase
export const addSceneItem = (item: SceneItem) => {
  addItemToFirebase(item);
  useGlobaleStore.getState().addSceneItem(item);
};

// Initialize from local storage the parts that use local storage
export const initLocalStorage = () => {
  const hasClickedOnce = window.localStorage.getItem(HAS_CLICKED_ONCE_KEY);
  useGlobaleStore.setState({ hasClickedOnce: !!hasClickedOnce });
};
