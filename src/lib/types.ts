export interface Game {
  id: number;
  name: string;
  background_image: string | null;
  rating: number;
  released: string | null;
  metacritic: number | null;
  parent_platforms?: { platform: { name: string } }[];
  genres?: { name: string }[];
  description_raw?: string;
}

export interface Platform {
  id: number;
  name: string;
}

export interface Genre {
  id: number;
  name: string;
  slug: string;
}

export interface GamesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Game[];
}