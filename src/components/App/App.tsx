import SearchBar from "../SearchBar/SearchBar";
import fetchMovie from "../../services/movieService";
import { useState } from "react";
import type { Movie } from "../../types/movie";
import toast, { Toaster } from "react-hot-toast";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoader, setIsLoader] = useState(false);
  const [isError, setIsError] = useState(false);
  const [movieForModal, setMovieForModal] = useState<Movie | null>(null);

  const handleSearch = async (query: string) => {
    try {
      setIsError(false);
      setMovies([]);
      setIsLoader(true);

      const results = await fetchMovie(query);

      if (results.length === 0) {
        toast("No movies found for your request.");
        return;
      }

      setMovies(results);
    } catch {
      setIsError(true);
    } finally {
      setIsLoader(false);
    }
  };

  const handleModal = (movie: Movie) => {
    setMovieForModal(movie);
  };
  const closeModal = () => {
    setMovieForModal(null);
  };

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      {isLoader && <Loader />}
      {isError && <ErrorMessage />}
      <Toaster />
      <MovieGrid onSelect={handleModal} movies={movies} />
      {movieForModal && (
        <MovieModal movie={movieForModal} onClose={closeModal} />
      )}
    </>
  );
}
