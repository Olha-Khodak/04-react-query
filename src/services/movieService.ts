import axios from "axios";
import type { Movie } from "../types/movie";

const token = import.meta.env.VITE_TMDB_TOKEN as string;

if (!token) {
  throw new Error("VITE_TMDB_TOKEN is not defined. Add it to your .env file.");
}

interface ApiMovieResponse {
  page: number;
  results: Movie[];
}

const instance = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});

export default async function fetchMovie(
  query: string,
  page = 1
): Promise<Movie[]> {
  const response = await instance.get<ApiMovieResponse>("/search/movie", {
    params: {
      query,
      page,
      include_adult: false,
      language: "en-US",
    },
  });

  return response.data.results;
}
