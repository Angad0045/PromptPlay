import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trash2, BookmarkX } from "lucide-react";
import {
  useGetWatchlistQuery,
  useRemoveFromWatchlistMutation,
} from "../Utils/Slices/moviesApi";
import { Container } from "../component/Container";
import Navbar from "../component/Navbar";

// ── Shimmer
const shimmerKeyframes = `
  @keyframes shimmer {
    0% { background-position: -800px 0; }
    100% { background-position: 800px 0; }
  }
`;
const shimmerStyle = {
  background: "linear-gradient(90deg, #1a1a2e 25%, #2a2a4a 50%, #1a1a2e 75%)",
  backgroundSize: "800px 100%",
  animation: "shimmer 1.6s infinite linear",
};

function WatchlistShimmer() {
  return (
    <>
      <style>{shimmerKeyframes}</style>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div
              className="aspect-[2/3] w-full rounded-[12px] md:rounded-[16px]"
              style={shimmerStyle}
            />
            <div className="h-3 w-3/4 rounded-full" style={shimmerStyle} />
          </div>
        ))}
      </div>
    </>
  );
}

// ── Movie Card
function WatchlistCard({ movie, index, onRemove, isRemoving }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="group relative flex flex-col gap-2"
    >
      {/* Poster */}
      <div className="relative overflow-hidden rounded-[12px] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] md:rounded-[16px]">
        <img
          src={movie.posterPath}
          alt={movie.name}
          className="aspect-[2/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Hover overlay — hidden on mobile, visible on md+ */}
        <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(135deg,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0.3)_100%)] opacity-100 backdrop-blur-[2px] md:opacity-0 md:transition-opacity md:duration-300 md:group-hover:opacity-100">
          <AnimatePresence mode="wait">
            {!confirmDelete ? (
              <motion.button
                key="trash"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setConfirmDelete(true)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-[linear-gradient(135deg,rgba(255,255,255,0.15),rgba(255,255,255,0.05))] text-white/80 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-[20px] transition-colors hover:text-white md:h-10 md:w-10"
              >
                <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </motion.button>
            ) : (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center gap-2 px-2"
              >
                <p className="text-center text-[10px] font-semibold text-white/90 md:text-[11px]">
                  Remove?
                </p>
                <div className="flex gap-1.5">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      onRemove(movie.id);
                      setConfirmDelete(false);
                    }}
                    disabled={isRemoving}
                    className="rounded-full border border-red-400/30 bg-red-400/20 px-2.5 py-1 text-[10px] font-semibold text-red-300 backdrop-blur-[20px] transition-colors hover:bg-red-400/30 disabled:opacity-50 md:px-3"
                  >
                    Yes
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setConfirmDelete(false)}
                    className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-white/70 backdrop-blur-[20px] transition-colors hover:bg-white/20 md:px-3"
                  >
                    No
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ── Empty State
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center gap-5 py-16 md:py-24"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-[20px] border border-white/[0.12] bg-[linear-gradient(135deg,rgba(255,255,255,0.1),rgba(255,255,255,0.04))] shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-[40px] md:h-20 md:w-20 md:rounded-[24px]">
        <BookmarkX className="h-7 w-7 text-white/30 md:h-8 md:w-8" />
      </div>
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-sm font-semibold text-white/70 md:text-base">
          Your watchlist is empty
        </p>
        <p className="text-[12px] text-white/35 md:text-[13px]">
          Add movies to keep track of what to watch
        </p>
      </div>
      <motion.a
        href="/home"
        whileHover={{ scale: 1.03, y: -1 }}
        whileTap={{ scale: 0.97 }}
        className="rounded-full border border-white/20 bg-[linear-gradient(135deg,rgba(255,255,255,0.15),rgba(255,255,255,0.06))] px-5 py-2 text-[12px] font-semibold text-white shadow-[0_4px_12px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-[40px] transition-all md:px-6 md:text-[13px]"
      >
        Browse Movies
      </motion.a>
    </motion.div>
  );
}

// ── Main Page
function WatchlistPage() {
  const { data, isLoading, error } = useGetWatchlistQuery();
  const [removeFromWatchlist, { isLoading: isRemoving }] =
    useRemoveFromWatchlistMutation();

  const watchlist = data?.watchlist || [];

  const handleRemove = async (id) => {
    try {
      await removeFromWatchlist(id).unwrap();
    } catch (err) {
      console.error("Failed to remove:", err);
    }
  };

  return (
    <div className="min-h-screen w-full text-white">
      <Navbar />

      <Container className="flex-col pt-24 pb-12 md:pt-28 md:pb-16">
        {/* ── Content ── */}
        {isLoading ? (
          <WatchlistShimmer />
        ) : error ? (
          <div className="flex items-center justify-center py-16 md:py-24">
            <p className="text-sm text-white/40">
              Something went wrong. Please try again.
            </p>
          </div>
        ) : watchlist.length === 0 ? (
          <EmptyState />
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div
              layout
              className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5 xl:grid-cols-6"
            >
              {watchlist.map((movie, index) => (
                <WatchlistCard
                  key={movie.id}
                  movie={movie}
                  index={index}
                  onRemove={handleRemove}
                  isRemoving={isRemoving}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </Container>
    </div>
  );
}

export default WatchlistPage;
