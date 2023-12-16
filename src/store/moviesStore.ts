import { create } from "zustand";
import createSelectors from "./selectors";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { Movie } from "../types/types";
type MoviesStore = {
  movies?: Movie[];
  setMovies: (movies: Movie[]) => void;
};

const initialState = {};

const useMoviesStore = create<MoviesStore>((set, get) => ({
  ...initialState,
  setMovies: (movies: Movie[]) =>
    set((state) => ({
      ...state,
      movies,
    })),
}));

mountStoreDevtool("Store", useMoviesStore);

export default useMoviesStore;
export const select = createSelectors(useMoviesStore);
