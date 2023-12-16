interface Person {
  firstName: string;
  id?: number;
  birthdate?: Date;
  lastName: string;
  hasInsurance: boolean;
  maxFavouriteMovies: number;
  favouriteMovies: Movie[];
}
interface Movie {
  title: string;
  genre: string;
  id?: number;
  favoriteAmount?: number;
  rating?: number;
}
export type { Person,Movie };
