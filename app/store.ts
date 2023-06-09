import { create } from "zustand";
import {
  Unsubscribe,
  onAuthStateChanged,
  User as FirUser,
} from "firebase/auth";
import { firAuth, firRealtimeDB } from "./firebase";
import { generateUsername } from "friendly-username-generator";
import proj4 from "proj4";
import {
  get,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  onValue,
  ref,
  remove,
  set,
  update,
} from "firebase/database";
import { set as lodashSet } from "lodash";
import { SCALE_INVARIANT_SCALE as POINTER_SCALE_INVARIANT_SCALE } from "@/components/PointerPreview";

export interface User {
  id: string;
  username: string;
  email: string | null;
  isAnonymous: boolean;
  googleTilesAPIKey: string;
  authorizedByUsers: Record<string, boolean>;
}

export type SceneItemType = "sphere" | "box" | "model" | "pointer" | "label";

export interface Item {
  type: SceneItemType;
  name: string;
  /**
   * Optional field for color
   */
  color?: string;
  /**
   * Optional field for model type
   */
  model?: string;

  usdzModel?: string;
  usdzModelScale?: number;

  /**
   * Optional field for labels
   */
  text?: string;

  baseScale: number;

  scaleInvariantBaseScale: number;
}

export const ALL_SCENE_ITEMS: Record<string, Item> = {
  sphere: {
    type: "sphere",
    name: "Sphere",
    color: "#FF0000",
    baseScale: 1,
    scaleInvariantBaseScale: 1,
  },
  box: {
    type: "box",
    name: "Box",
    color: "#00FF00",
    baseScale: 1,
    scaleInvariantBaseScale: 1,
  },
  pointer: {
    type: "pointer",
    name: "Pointer",
    color: "#FF0000",
    baseScale: 1,
    scaleInvariantBaseScale: POINTER_SCALE_INVARIANT_SCALE,
  },
  label: {
    type: "label",
    name: "Label",
    text: "Label",
    baseScale: 1,
    scaleInvariantBaseScale: 1,
  },
  dino: {
    type: "model",
    name: "Ferrari Dino",
    model:
      "https://firebasestorage.googleapis.com/v0/b/largascala.appspot.com/o/ferrari_dino_246.glb?alt=media&token=27283198-187b-40e4-b5e9-99e1e4cb7624",
    usdzModel:
      "https://firebasestorage.googleapis.com/v0/b/largascala.appspot.com/o/ferrari_dino_246.usdz?alt=media&token=96371737-f326-49e6-8947-97b36a688a71",
    usdzModelScale: 0.004,
    baseScale: 0.0155,
    scaleInvariantBaseScale: 0.1,
  },
};

export interface PositionAndRotation {
  pos: [number, number, number];
  quat: [number, number, number, number];
}

export interface SceneItem {
  id: string;
  positionAndRotation: PositionAndRotation;
  item: Item;
  scaleInvariant: boolean;
  creatorUserId: string;
  inUseByUserId?: string;
}

export interface SceneItemAndIndex {
  itemId: SceneItem["id"];
  index: number;
}

export type ModalType = "settings" | "credits" | "items";

const HAS_CLICKED_ONCE_KEY = "hasClickedOnce";

export interface GlobaleStore {
  user?: User;
  userUpdateSubscription?: Unsubscribe;
  promoteAnonymousUser: (newFirUser: FirUser) => void;

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
  idsToSceneItems: Map<SceneItem["id"], SceneItem>;
  addSceneItem: (item: SceneItem, toFirebase?: Boolean) => Promise<void>;
  updateSceneItem: (item: SceneItem, atIndex: number) => void;

  showAddItemMenu: boolean;
  pointerPosition: PositionAndRotation;
  setShowAddItemMenu: (
    showAddItemMenu: boolean,
    pointerPosition: PositionAndRotation
  ) => void;
  itemToAdd: string;
  setItemToAdd: (itemToAdd: string) => void;
  hoveredItem?: SceneItemAndIndex;
  setHoveredItem: (itemId?: SceneItem["id"]) => void;
  selectedItem?: SceneItemAndIndex;
  setSelectedItem: (itemId?: SceneItem["id"]) => void;
  interactingWithItemFromScene: boolean;
  setInteractingWithItemFromScene: (
    interactingWithItemFromScene: boolean
  ) => void;
  deleteItem: (itemId: SceneItem["id"], toFirebase?: Boolean) => Promise<void>;
}

export const useGlobaleStore = create<GlobaleStore>()((set, get) => ({
  user: undefined,
  firUser: undefined,
  userUpdateSubscription: undefined,
  promoteAnonymousUser: async (newFirUser) => {
    const user = get().user;
    if (!user) return;

    set({
      user: {
        ...user,
        id: newFirUser.uid,
        isAnonymous: newFirUser.isAnonymous,
        email: newFirUser.email,
      },
    });
  },

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
  idsToSceneItems: new Map(),
  addSceneItem: async (item, toFirebase = false) => {
    // If it's already added because it's the user's, don't add it again
    if (get().idsToSceneItems.has(item.id)) return;

    set((state) => {
      let idsToSceneItems = state.idsToSceneItems;
      if (item.creatorUserId === state.user?.id) {
        idsToSceneItems = new Map(idsToSceneItems).set(item.id, item);
      }

      return {
        sceneItems: [...state.sceneItems, item],
        idsToSceneItems,
      };
    });

    if (toFirebase) {
      set({ isDoingBlockingUpdateToFirebase: true });
      await addItemToFirebase(item);
      set({ isDoingBlockingUpdateToFirebase: false });
    }
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
  updateSceneItem: (item, atIndex) => {
    set((state) => {
      const newSceneItems = [...state.sceneItems];
      newSceneItems[atIndex] = item;

      let newStateDiff = {
        sceneItems: newSceneItems,
        idsToSceneItems: state.idsToSceneItems,
      };

      if (state.idsToSceneItems.has(item.id)) {
        newStateDiff = {
          ...newStateDiff,
          idsToSceneItems: new Map(state.idsToSceneItems),
        };
      }

      return newStateDiff;
    });

    // Update firebase
    updateItemInFirebase(item);
  },

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
      // There should always be a user at this point
      const user = get().user;
      if (!user) return;

      // First find the item
      const index = get().sceneItems.findIndex((item) => item.id === itemId);
      if (index === -1) return;

      const item = get().sceneItems[index];

      // If the user doesn't own this item, or isn't authorized to use it,
      // don't do anything.
      if (
        item.creatorUserId === user.id ||
        user.authorizedByUsers[item.creatorUserId] === true
      ) {
        set({ selectedItem: { itemId, index } });
      }
    } else {
      set({ selectedItem: undefined });
    }
  },

  interactingWithItemFromScene: false,
  setInteractingWithItemFromScene: (interactingWithItemFromScene) => {
    set({ interactingWithItemFromScene });
  },

  deleteItem: async (itemId, toFirebase = false) => {
    // Check that the item exists
    const index = get().sceneItems.findIndex((item) => item.id === itemId);
    if (index === -1) return;

    // Delete the item
    set((state) => {
      const newSceneItems = [...state.sceneItems];
      newSceneItems.splice(index, 1);

      let newStateDiff = {
        sceneItems: newSceneItems,
        idsToSceneItems: state.idsToSceneItems,
        selectedItem:
          state.selectedItem?.itemId === itemId
            ? undefined
            : state.selectedItem,
        hoveredItem:
          state.hoveredItem?.itemId === itemId ? undefined : state.hoveredItem,
      };

      if (state.idsToSceneItems.has(itemId)) {
        const newIdsToSceneItems = new Map(state.idsToSceneItems);
        newIdsToSceneItems.delete(itemId);

        newStateDiff = {
          ...newStateDiff,
          idsToSceneItems: newIdsToSceneItems,
        };
      }

      return newStateDiff;
    });

    if (toFirebase) {
      set({ isDoingBlockingUpdateToFirebase: true });
      await deleteItemFromFirebase(itemId);
      set({ isDoingBlockingUpdateToFirebase: false });
    }
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

/**
 * Converts cartesian coordinates in EUS to geo coordinates
 */
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

/**
 * Converts geo coordinates to cartesian coordinates in EUS
 */
export const convertGeoToCartesian = (geo: [number, number, number]) => {
  const converted = converterToGeo.forward(geo);

  if (converted.length !== 3) {
    throw new Error("Converted length is not 3");
  }

  return [converted[1], converted[2], converted[0]] as [number, number, number];
};

// Subscribe to firebase auth changes and update the store
onAuthStateChanged(firAuth, async (firUser) => {
  console.log("onAuthStateChanged", firUser);
  if (firUser) {
    // Fetch the google tiles api key
    const userId = firUser.uid;

    let user: User = {
      id: userId,
      username: generateUsername(),
      isAnonymous: firUser.isAnonymous,
      email: firUser.email,
      // This works because the logic is such that if the user is new, they will have
      // also been required to provide an API key before continuing, and the store will have
      // been updated with the API key before this point.
      googleTilesAPIKey: useGlobaleStore.getState().googleTilesAPIKey ?? "",
      authorizedByUsers: {
        none: true,
      },
    };

    let googleTilesAPIKey: string | undefined = undefined;

    // Fetch the user's data from firebase. If the user doesn't
    // exist yet in the DB, create it.
    const userRef = ref(firRealtimeDB, `users/${userId}`);
    const userSnapshot = await get(userRef);
    if (!userSnapshot.exists()) {
      await set(userRef, user);
    } else {
      const val = userSnapshot.val();
      user = val;
      googleTilesAPIKey = user.googleTilesAPIKey;
      useGlobaleStore.setState({
        googleTilesAPIKey,
      });
    }

    // Listen for updates to the user
    const unsub = onChildChanged(userRef, (snapshot) => {
      const key = snapshot.key;
      if (!key) return;

      const currentUser = useGlobaleStore.getState().user;
      if (!currentUser) return;

      const updatedUser = snapshot.val();
      const newUser = lodashSet({ ...currentUser }, key, updatedUser);

      useGlobaleStore.setState({
        user: newUser,
      });
    });

    useGlobaleStore.setState({
      user,
      userUpdateSubscription: unsub,
    });

    console.log("Set state for user, user: ", user);
  } else {
    // Unsubscribe
    const unsub = useGlobaleStore.getState().userUpdateSubscription;
    if (unsub) {
      unsub();
    }

    useGlobaleStore.setState({
      user: undefined,
      googleTilesAPIKey: undefined,
      userUpdateSubscription: undefined,
    });
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

const updateItemInFirebase = async (item: SceneItem) => {
  // Convert from cartesian to geo
  const converted = convertCartesianToGeo(item.positionAndRotation.pos);

  /**
   * This is the same as the item, but with the position converted to geo
   * and the id removed
   */
  const newItem: SceneItem = {
    ...item,
    positionAndRotation: {
      ...item.positionAndRotation,
      pos: converted as [number, number, number],
    },
  };

  await update(ref(firRealtimeDB, `sceneItems/${item.id}`), newItem);
};

const deleteItemFromFirebase = async (itemId: SceneItem["id"]) => {
  return remove(ref(firRealtimeDB, `sceneItems/${itemId}`));
};

const setGoogleTilesAPIKeyToFirebase = async (key: string, userId: string) => {
  return set(ref(firRealtimeDB, `users/${userId}/googleTilesAPIKey`), key);
};

// User management in Firebase
export const deleteUser = async (userId: string) => {
  return remove(ref(firRealtimeDB, `users/${userId}`));
};

// Subscribe to firebase changes and update the store
const sceneItemsRef = ref(firRealtimeDB, "sceneItems");

onChildAdded(sceneItemsRef, (snapshot) => {
  const newItem = snapshot.val() as SceneItem;
  const mapped = {
    ...newItem,
    positionAndRotation: {
      ...newItem.positionAndRotation,
      pos: convertGeoToCartesian(newItem.positionAndRotation.pos),
    },
  };

  console.log("Added mapped item: ", mapped);
  useGlobaleStore.getState().addSceneItem(mapped, false);
});

onChildChanged(sceneItemsRef, (snapshot) => {
  const updatedItem = snapshot.val() as SceneItem;
  const mapped = {
    ...updatedItem,
    positionAndRotation: {
      ...updatedItem.positionAndRotation,
      pos: convertGeoToCartesian(updatedItem.positionAndRotation.pos),
    },
  };

  // If the item is in the ids to scene items map, don't update it, but make
  // an exception  for the labels
  if (
    useGlobaleStore.getState().idsToSceneItems.has(mapped.id) &&
    mapped.item.type !== "label"
  )
    return;

  useGlobaleStore.setState((state) => {
    return {
      sceneItems: state.sceneItems.map((item) =>
        item.id === updatedItem.id ? mapped : item
      ),
    };
  });
});

onChildRemoved(sceneItemsRef, (snapshot) => {
  const deletedItemId = snapshot.key as string;
  useGlobaleStore.getState().deleteItem(deletedItemId, false);
});

// Initialize from local storage the parts that use local storage
export const initLocalStorage = () => {
  const hasClickedOnce = window.localStorage.getItem(HAS_CLICKED_ONCE_KEY);
  useGlobaleStore.setState({ hasClickedOnce: !!hasClickedOnce });
};

// // If the item is already in use, don't select it
// const item = get().idsToSceneItems.get(itemId);
// if (!item || item?.inUseByUserId !== undefined) return;

// const index = get().sceneItems.findIndex((item) => item.id === itemId);
// if (index !== -1) {
//   // Update the DB, marking the item as in use
//   const user = get().user;
//   const newItem = {
//     ...item,
//     inUseByUserId: user!.id,
//   };
//   set((state) => {
//     const newSceneItems = [...state.sceneItems];
//     newSceneItems[index] = item;

//     let newStateDiff = {
//       sceneItems: newSceneItems,
//       idsToSceneItems: new Map(state.idsToSceneItems),
//     };

//     return newStateDiff;
//   });

//   get().updateSceneItem(newItem, index);
//   await updateItemInFirebase(newItem);
//   set({ selectedItem: { itemId, index }  });
