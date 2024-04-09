import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type BadgeStore = {
  id: string;
  name: string;
  email: string;
  eventTitle: string;
  checkInURL: string;
  image?: string;
  code: string;
};

type StateProps = {
  data: BadgeStore | null;
  save: (badge: BadgeStore) => void;
  remove: () => void;
  updateAvatar: (uri: string) => void;
};

export const useBadgeStore = create(
  persist<StateProps>(
    (set) => ({
      data: null,

      save: (data: BadgeStore) => set(saveBadge(data)),
      remove: () => set(() => ({data: null})),
      updateAvatar: (uri) => set(updateAvatar(uri))
    }),
    {
      name: "nlw-unite:badge",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

const saveBadge = (data: BadgeStore) => (state: any) => {
  return {data};
};

const updateAvatar = (uri: string) => (state: any) => {  
  return {
    data: {
      ...state.data, 
      image: uri
    }
  };
};
