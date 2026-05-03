import css from './App.module.css';
import { fetchMovie } from '../../services/movieService';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { Movie } from '../../types/movie';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import Pagination from '../Pagination/Pagination';
import SearchBar from '../SearchBar/SearchBar';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState<Movie | null>(null);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['movies', search, currentPage],
    queryFn: () => fetchMovie(search, currentPage),
    enabled: search !== '',
    placeholderData: keepPreviousData,
  });
  useEffect(() => {
    if (!isError && data && data.total_results === 0) {
      toast.error('No movies found for your request.');
    }
  });

  const totalPages = data?.total_pages ?? 0;
  const handleSearch = (query: string) => {
    const trimmedQuery = query.trim();
    if (trimmedQuery !== '') {
      setSearch(trimmedQuery);
      setCurrentPage(1);
    }
  };
  const handlePage = (newPage: number) => setCurrentPage(newPage);

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />
      {!isLoading && !isError && data && totalPages > 1 && (
        <Pagination
          pageCount={totalPages}
          forcePage={currentPage}
          onPageChange={handlePage}
        />
      )}

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {!isLoading && !isError && data && data.total_results > 0 && (
        <MovieGrid movies={data.results} onSelect={setOpenModal} />
      )}
      {openModal && (
        <MovieModal onClose={() => setOpenModal(null)} movie={openModal} />
      )}
      <Toaster />
    </div>
  );
}

export default App;
