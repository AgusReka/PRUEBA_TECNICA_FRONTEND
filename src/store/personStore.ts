import { create } from "zustand";
import createSelectors from "./selectors";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { Person } from "../types/types";

type PersonStore = {
  people?: Person[];
  setPeople: (people: Person[]) => void;
};

const initialState = {};

const usePersonStore = create<PersonStore>((set, get) => ({
  ...initialState,
  setPeople: (people: Person[]) =>
    set((state) => ({
      ...state,
      people,
    })),
}));

mountStoreDevtool("Store", usePersonStore);

export default usePersonStore;
export const select = createSelectors(usePersonStore);
