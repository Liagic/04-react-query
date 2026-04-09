import axios from 'axios';
import type { Movie } from '../types/movie';

const API_KEY = import.meta.env.VITE_TMDB_TOKEN;
interface TmdbResponse {
  results: Movie[];
}
export const fetchMovie = async (search: string): Promise<Movie[]> => {
  const response = await axios.get<TmdbResponse>(
    'https://api.themoviedb.org/3/search/movie',
    {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      params: {
        query: search,
      },
    }
  );
  return response.data.results;
};
