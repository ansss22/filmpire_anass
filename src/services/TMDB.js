import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const tmdbApiKey = process.env.REACT_APP_TMDB_KEY;

export const tmdbApi = createApi({
  reducerPath: "tmdbApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.themoviedb.org/3/" }),
  endpoints: (builder) => ({
    getMovies: builder.query({
      query: ({ genreIdOrCategoryName, page, searchQuery }) => {
        if (searchQuery) {
          return `/search/movie?query=${searchQuery}&page=${page}&api_key=${tmdbApiKey}`;
        }
        if (genreIdOrCategoryName && typeof genreIdOrCategoryName === "string") {
          return `movie/${genreIdOrCategoryName}?page=${page}&api_key=${tmdbApiKey}`;
        }
        if (genreIdOrCategoryName && typeof genreIdOrCategoryName === "number") {
          return `discover/movie?with_genres=${genreIdOrCategoryName}&page=${page}&api_key=${tmdbApiKey}`;
        }
        return `movie/popular?page=${page}&api_key=${tmdbApiKey}`;
      },
    }),
    getGenres: builder.query({
      query: () => `genre/movie/list?api_key=${tmdbApiKey}`,
    }),
    getMovie: builder.query({
      query: (id) => {
        if (!id) throw new Error("Movie ID is required");
        return `/movie/${id}?api_key=${tmdbApiKey}&append_to_response=videos,credits`;
      },
    }),
    getRecommendations: builder.query({
      query: ({ movie_id, list }) => {
        if (!movie_id) throw new Error("Movie ID is required");
        return `/movie/${movie_id}/${list}?api_key=${tmdbApiKey}`;
      },
    }),
    getActorDetail: builder.query({
      query: (id) => {
        if (!id) throw new Error("Actor ID is required");
        return `person/${id}?api_key=${tmdbApiKey}`;
      },
    }),
    getMoviesByActorId: builder.query({
      query: (id, page = 1) => {
        if (!id) throw new Error("Actor ID is missing");
        return `/discover/movie?with_cast=${id}&page=${page}&api_key=${tmdbApiKey}`;
      },
    }),
    getList: builder.query({
      query: ({ listName, accountId, sessionId, page = 1 }) => {
        if (!accountId || !sessionId) {
          throw new Error("Account ID or Session ID is missing");
        }
        return `/account/${accountId}/${listName}?api_key=${tmdbApiKey}&session_id=${sessionId}&page=${page}`;
      },
    }),
  }),
});

export const {
  useGetMoviesQuery,
  useGetGenresQuery,
  useGetMovieQuery,
  useGetRecommendationsQuery,
  useGetActorDetailQuery,
  useGetMoviesByActorIdQuery,
  useGetListQuery,
} = tmdbApi;
