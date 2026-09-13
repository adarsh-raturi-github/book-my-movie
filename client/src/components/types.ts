export interface Movie {
  id: string;
  title: string;
  rating: number;
  genre: string[];
  releaseDate: string;
  poster: string;
  featured?: boolean;
}

export interface MovieCategory {
  name: string;
  icon: string;
}
