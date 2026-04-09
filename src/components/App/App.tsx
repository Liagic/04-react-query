import css from './App.module.css';
import { fetchMovie } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import SearchBar from '../SearchBar/SearchBar';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [openModal, setOpenModal] = useState<Movie | null>(null);

  const handleSearch = async (query: string) => {
    try {
      setMovies([]);
      setIsError(false);
      setIsLoading(true);
      const response = await fetchMovie(query);
      if (response.length === 0) {
        toast.error('No movies found for your request.');
      } else {
        setMovies(response);
      }
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <ErrorMessage />
      ) : (
        <MovieGrid movies={movies} onSelect={setOpenModal} />
      )}
      {openModal && (
        <MovieModal onClose={() => setOpenModal(null)} movie={openModal} />
      )}
      <Toaster />
    </div>
  );
}

export default App;
