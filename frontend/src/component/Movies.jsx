import { useEffect, useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import {
  useAllMoviesQuery,
  useLazyMovieTrailerQuery,
} from "../Utils/Slices/moviesApi";
import { Container } from "../component/Container";
import { motion } from "motion/react";
import HeroSection from "../component/HeroSection";
import HomePageShimmer from "./HomePageShimmer";
import MovieModal from "./MovieModal";

function Movies() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ sort_by: "popularity.desc" });
  const [selectMovie, setSelectMovie] = useState(null);

  const { data, isLoading, isFetching, error } = useAllMoviesQuery({
    page,
    ...filters,
  });

  const totalPages = Math.min(data?.total_pages || 0, 100);

  const [getTrailer, { data: trailer, isLoading: trailerIsLoading }] =
    useLazyMovieTrailerQuery();

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setSelectMovie(null);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  if (isLoading) return <HomePageShimmer />;
  if (error) return <div>Something went wrong.</div>;

  const res = data?.movies || [];

  return (
    <div className="flex w-full flex-col justify-center">
      <div className="flex flex-col items-center justify-center">
        <HeroSection />
        <Container className="flex-col">
          {/* Filter Controls */}
          <select
            onChange={(e) => {
              setFilters((prev) => ({ ...prev, sort_by: e.target.value }));
              setPage(1);
            }}
            className="mb-6 cursor-pointer appearance-none self-end rounded-full border border-white/[0.18] bg-[linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.04))] px-5 py-2 pr-8 text-[13px] font-semibold text-white/80 shadow-[0_4px_12px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-[40px] transition-all duration-200 outline-none hover:border-white/30 hover:text-white [&>option]:bg-[#1a1a2e] [&>option]:text-white/80"
          >
            <option value="popularity.desc">Most Popular</option>
            <option value="vote_average.desc">Top Rated</option>
            <option value="release_date.desc">Latest</option>
          </select>
          {selectMovie && (
            <MovieModal
              selectMovie={selectMovie}
              onClose={() => setSelectMovie(null)}
              trailer={trailer}
            />
          )}
          {/* Movie Grid */}
          <div className="relative">
            {isFetching && (
              <div className="absolute inset-0 z-10 rounded-md bg-black/40 transition-opacity" />
            )}
            <div className="grid grid-cols-2 gap-5 p-5 md:grid-cols-3 lg:grid-cols-4 lg:p-0">
              {res.map((movie) => (
                <motion.div
                  key={movie.title}
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  layoutId={`card-${movie.title}`}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    getTrailer(movie.id);
                    setSelectMovie(movie);
                  }}
                >
                  <motion.img
                    className="h-full w-full rounded-md"
                    layoutId={`card-image-${movie.title}`}
                    src={movie.poster_path}
                    alt={movie.title}
                  />
                </motion.div>
              ))}
            </div>
          </div>
          {/* Pagination */}
          <div className="mt-8 flex items-center justify-center gap-3">
            {/* Prev */}
            <motion.button
              whileHover={page !== 1 && !isFetching ? { scale: 1.05 } : {}}
              whileTap={page !== 1 && !isFetching ? { scale: 0.95 } : {}}
              disabled={page === 1 || isFetching}
              onClick={() => {
                setPage((p) => p - 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.06] text-white/70 backdrop-blur-[40px] transition-all duration-200 hover:border-white/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </motion.button>

            {/* Page indicator */}
            <div className="flex items-center gap-1.5 rounded-full border border-white/[0.12] bg-white/[0.06] px-5 py-2 backdrop-blur-[40px]">
              <span className="text-[13px] font-semibold text-white/80">
                {page}
              </span>
              <span className="text-[13px] text-white/25">/</span>
              <span className="text-[13px] text-white/40">{totalPages}</span>
            </div>

            {/* Next */}
            <motion.button
              whileHover={
                page !== totalPages && !isFetching ? { scale: 1.05 } : {}
              }
              whileTap={
                page !== totalPages && !isFetching ? { scale: 0.95 } : {}
              }
              disabled={page === totalPages || isFetching}
              onClick={() => {
                setPage((p) => p + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.06] text-white/70 backdrop-blur-[40px] transition-all duration-200 hover:border-white/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </motion.button>
          </div>
        </Container>
      </div>
    </div>
  );
}

export default Movies;
