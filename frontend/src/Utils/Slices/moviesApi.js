import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../Constants";

export const moviesApi = createApi({
  reducerPath: "movieApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/`,
    credentials: "include",
  }),
  tagTypes: ["Watchlist"],

  endpoints: (builder) => ({
    allMovies: builder.query({
      query: ({ page = 1, ...filters } = {}) => ({
        url: "movies/all",
        method: "POST",
        body: { page: String(page), ...filters },
      }),
    }),

    searchMovie: builder.query({
      query: ({ query, page = 1 }) => ({
        url: "movies/search",
        method: "GET",
        params: { query, page },
      }),
    }),

    trendingMovies: builder.query({
      query: () => "movies/trending",
    }),

    movieTrailer: builder.query({
      query: (id) => `movies/trailer/${id}`,
    }),

    getWatchlist: builder.query({
      query: () => "watchlist",
      providesTags: ["Watchlist"],
    }),

    addToWatchlist: builder.mutation({
      query: ({ id, name, posterPath }) => ({
        url: "watchlist",
        method: "POST",
        body: { id, name, posterPath },
      }),
      invalidatesTags: ["Watchlist"],
    }),

    removeFromWatchlist: builder.mutation({
      query: (id) => ({
        url: `watchlist/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Watchlist"],
    }),

    aiSearchSuggestions: builder.mutation({
      query: (prompt) => ({
        url: "movies/promptPlay",
        method: "POST",
        body: { prompt },
      }),
    }),
  }),
});

export const {
  useAllMoviesQuery,
  useTrendingMoviesQuery,
  useLazySearchMovieQuery,
  useLazyMovieTrailerQuery,
  useAddToWatchlistMutation,
  useGetWatchlistQuery,
  useRemoveFromWatchlistMutation,
  useAiSearchSuggestionsMutation,
} = moviesApi;
