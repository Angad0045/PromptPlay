import React, { useEffect, useState, useRef } from "react";
import { SearchIcon, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  useLazyMovieTrailerQuery,
  useLazySearchMovieQuery,
} from "../Utils/Slices/moviesApi";
import { createPortal } from "react-dom";
import MovieModal from "./MovieModal";

const SearchResults = ({ results, isLoading, isFetching, onSelectMovie }) => {
  const loading = isLoading || isFetching;

  return createPortal(
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed inset-x-0 top-[72px] z-40 px-4 md:px-10"
    >
      <div className="w-full overflow-hidden rounded-[28px] border border-white/[0.18] bg-[linear-gradient(135deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_100%)] shadow-[0_32px_64px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.1)] backdrop-blur-[40px]">
        <div className="absolute top-0 right-8 left-8 h-px rounded-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)]" />

        {loading && (
          <div className="flex items-center justify-center p-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-6 w-6 rounded-full border-2 border-white/20 border-t-white/70"
            />
          </div>
        )}

        {!loading && results.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 p-10">
            <SearchIcon className="h-7 w-7 text-white/20" />
            <p className="text-sm font-medium text-white/40">
              No results found
            </p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="p-5">
            <p className="mb-4 px-1 text-[10px] font-semibold tracking-widest text-white/35 uppercase">
              {results.length} Results
            </p>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
              {results.map((movie, index) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  whileHover={{ scale: 1.04, y: -3 }}
                  onClick={() => onSelectMovie(movie)} // 👈 call parent handler
                  className="group flex cursor-pointer flex-col gap-2"
                >
                  {movie.poster_path ? (
                    <div className="overflow-hidden rounded-[12px] border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
                      <img
                        src={movie.poster_path}
                        alt={movie.title}
                        className="aspect-[2/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-[2/3] w-full items-center justify-center rounded-[12px] border border-white/10 bg-white/[0.06]">
                      <SearchIcon className="h-5 w-5 text-white/20" />
                    </div>
                  )}
                  <div className="flex flex-col gap-0.5 px-0.5">
                    <p className="truncate text-[11px] leading-tight font-semibold text-white/90">
                      {movie.title}
                    </p>
                    <div className="flex items-center gap-1.5">
                      {movie.release_date && (
                        <span className="text-[10px] text-white/40">
                          {movie.release_date?.split("-")[0]}
                        </span>
                      )}
                      {movie.vote_average > 0 && (
                        <span className="text-[10px] text-amber-300/80">
                          ★ {movie.vote_average?.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>,
    document.body,
  );
};

export const SearchBar = () => {
  const [input, setInput] = useState("");
  const [openSearchBar, setOpenSearchBar] = useState(false);
  const [selectMovieToPreview, setSelectMovieToPreview] = useState(null); // 👈 lifted up
  const [searchMovie, { data, isLoading, isFetching }] =
    useLazySearchMovieQuery();
  const [getTrailer, { data: trailer }] = useLazyMovieTrailerQuery(); // 👈 lifted up
  const containerRef = useRef(null);

  const res = data?.movies || [];
  const showResults = openSearchBar && input.trim().length >= 2;

  useEffect(() => {
    if (input.trim().length < 2) return;
    const debounce = setTimeout(() => {
      searchMovie({ query: input });
    }, 600);
    return () => clearTimeout(debounce);
  }, [input]);

  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpenSearchBar(false);
        setInput("");
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelectMovie = (movie) => {
    getTrailer(movie.id);
    setSelectMovieToPreview(movie);
    setOpenSearchBar(false);
    setInput("");
  };

  return (
    <div ref={containerRef} className="relative flex items-center gap-1">
      <AnimatePresence>
        {openSearchBar && (
          <motion.input
            key="search-input"
            type="text"
            value={input}
            placeholder="Search movies..."
            autoFocus
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "250px", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            onChange={(e) => setInput(e.target.value)}
            className="appearance-none overflow-hidden rounded-full border border-white/20 bg-[linear-gradient(135deg,rgba(255,255,255,0.2),rgba(255,255,255,0.08))] py-2 pr-8 pl-10 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-[40px] outline-none"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {openSearchBar && input.length > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            onClick={() => setInput("")}
            className="absolute right-8 z-10 text-white/40 transition-colors hover:text-white/80"
          >
            <X className="h-3 w-3" />
          </motion.button>
        )}
      </AnimatePresence>

      <motion.span
        layout
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className={openSearchBar ? "absolute left-3 z-10" : "relative"}
      >
        <SearchIcon
          onClick={() => setOpenSearchBar(!openSearchBar)}
          className="size-6 cursor-pointer text-white/80 transition-colors hover:text-white"
        />
      </motion.span>

      <AnimatePresence>
        {showResults && (
          <SearchResults
            results={res}
            isLoading={isLoading}
            isFetching={isFetching}
            onSelectMovie={handleSelectMovie}
          />
        )}
      </AnimatePresence>

      {selectMovieToPreview && (
        <MovieModal
          selectMovie={selectMovieToPreview}
          onClose={() => setSelectMovieToPreview(null)}
          trailer={trailer}
        />
      )}
    </div>
  );
};
