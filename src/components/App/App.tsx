import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import toast, { Toaster } from "react-hot-toast";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import fetchMovie from "../../services/movieService";

import type { Movie, ApiMovieResponse } from "../../types/movie";
import css from "./App.module.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [movieForModal, setMovieForModal] = useState<Movie | null>(null);

  const { data, isLoading, isError } = useQuery<ApiMovieResponse>({
    queryKey: ["movie", query, page],
    queryFn: () => fetchMovie(query, page),
    enabled: query.trim() !== "",
    placeholderData: (prev) => prev,
  });

  const movies: Movie[] = useMemo(() => data?.results ?? [], [data]);
  const totalPages = data?.total_pages ?? 0;

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };

  const handleSelectMovie = (movie: Movie) => {
    setMovieForModal(movie);
  };

  const closeModal = () => {
    setMovieForModal(null);
  };

  useEffect(() => {
    if (data?.results && data.results.length === 0 && query.trim() !== "") {
      toast("No movies found for your request.");
    }
  }, [data, query]);

  return (
    <>
      <Toaster />
      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {movies.length > 0 && (
        <>
          {totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}

          <MovieGrid movies={movies} onSelect={handleSelectMovie} />
        </>
      )}

      {movieForModal && (
        <MovieModal movie={movieForModal} onClose={closeModal} />
      )}
    </>
  );
}
