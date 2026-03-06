// component/MovieModal.jsx
import { useState } from "react";
import { motion } from "motion/react";
import { X, PlusIcon, Check } from "lucide-react";
import { useAddToWatchlistMutation } from "../Utils/Slices/moviesApi";

function MovieModal({ selectMovie, onClose, trailer }) {
  const [addToWatchlist, { isLoading: isAdding }] = useAddToWatchlistMutation();
  const [added, setAdded] = useState(false);
  const [error, setError] = useState(null);

  const handleAddToWatchlist = async () => {
    if (added || isAdding) return;

    try {
      await addToWatchlist({
        id: String(selectMovie.id),
        name: selectMovie.title,
        posterPath: selectMovie.poster_path,
      }).unwrap();
      setAdded(true);
      setError(null);
    } catch (err) {
      if (err?.status === 409) {
        setError("Already in watchlist");
      } else {
        setError("Failed to add, try again");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex h-screen w-full items-center justify-center bg-black/10 p-4 backdrop-blur-sm"
    >
      <motion.div
        layoutId={`card-${selectMovie.title}`}
        onClick={(e) => e.stopPropagation()}
        className="no-scrollbar relative z-[100] flex max-h-[90vh] w-full max-w-3xl flex-col overflow-y-auto rounded-[24px] border border-white/[0.18] bg-[linear-gradient(135deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_100%)] text-white shadow-[0_32px_64px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.1)] backdrop-blur-[40px] md:rounded-[32px]"
      >
        <div className="absolute top-0 right-8 left-8 h-px rounded-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)]" />

        {/* ── Close button ── */}
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="absolute top-3 right-3 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.15] bg-white/10 text-white/60 transition-colors hover:text-white md:top-4 md:right-4 md:h-8 md:w-8"
        >
          <X />
        </motion.button>

        {/* ── Top: Poster + Info ── */}
        <div className="flex flex-col items-center gap-4 p-4 pb-3 sm:flex-row sm:items-start md:gap-6 md:p-7 md:pb-4">
          {/* Poster */}
          <motion.div
            layoutId={`card-image-${selectMovie.title}`}
            className="flex-shrink-0 overflow-hidden rounded-[16px] border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
          >
            <img
              className="w-[100px] object-cover sm:w-[120px] md:w-[130px]"
              src={selectMovie.poster_path}
              alt={selectMovie.title}
            />
          </motion.div>

          {/* Info */}
          <div className="flex w-full flex-1 flex-col gap-2 text-center sm:pt-1 sm:text-left md:gap-3">
            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="text-base leading-tight font-semibold tracking-tight text-white/95 md:text-xl"
            >
              {selectMovie.title}
            </motion.h2>

            {/* Meta badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-2 sm:justify-start"
            >
              {selectMovie.release_date && (
                <span className="rounded-full border border-white/[0.12] bg-white/[0.08] px-3 py-1 text-[11px] font-medium text-white/70">
                  {selectMovie.release_date?.split("-")[0]}
                </span>
              )}
              {selectMovie.vote_average && (
                <span className="rounded-full border border-[rgba(251,191,36,0.2)] bg-[rgba(251,191,36,0.1)] px-3 py-1 text-[11px] font-medium text-amber-300">
                  ★ {selectMovie.vote_average?.toFixed(1)}
                </span>
              )}
            </motion.div>

            {/* Overview */}
            <div>
              <p className="mb-1 text-[10px] font-semibold tracking-widest text-white/35 uppercase md:text-[11px]">
                Overview
              </p>
              <motion.p
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="line-clamp-3 text-[12px] leading-relaxed text-white/70 md:line-clamp-4 md:text-[13px]"
              >
                {selectMovie.overview}
              </motion.p>
            </div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mt-1 flex flex-col gap-2"
            >
              <div className="flex items-center justify-center gap-3 sm:justify-start">
                {/* Add to watchlist button */}
                <motion.button
                  layoutId={`card-button-1-${selectMovie.title}`}
                  onClick={handleAddToWatchlist}
                  whileHover={!added && !isAdding ? { scale: 1.08, y: -1 } : {}}
                  whileTap={!added && !isAdding ? { scale: 0.95 } : {}}
                  transition={{ duration: 0.15 }}
                  disabled={added || isAdding}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 disabled:cursor-not-allowed md:h-9 md:w-9 ${
                    added
                      ? "border-green-400/20 bg-green-400/10 text-green-400" // ✅ green when added
                      : "border-white/[0.12] bg-white/[0.08] text-white/70 hover:text-white"
                  }`}
                >
                  {isAdding ? (
                    // Spinning loader
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="h-3 w-3 rounded-full border-2 border-white/20 border-t-white/70 md:h-4 md:w-4"
                    />
                  ) : added ? (
                    <Check className="h-3 w-3 text-green-400 md:h-4 md:w-4" />
                  ) : (
                    <PlusIcon className="h-3 w-3 md:h-4 md:w-4" />
                  )}
                </motion.button>

                {/* Label */}
                <motion.span
                  key={added ? "added" : "add"} // 👈 triggers animation on text change
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-[11px] font-medium ${added ? "text-green-400/80" : "text-white/40"}`}
                >
                  {isAdding
                    ? "Adding..."
                    : added
                      ? "Added to watchlist ✓"
                      : "Add to watchlist"}
                </motion.span>
              </div>

              {/* Error message */}
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[11px] text-red-400/80"
                >
                  {error}
                </motion.p>
              )}
            </motion.div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="mx-4 my-1 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)] md:mx-7" />

        {/* ── Trailer ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="px-4 pt-3 pb-4 md:px-7 md:pt-4 md:pb-7"
        >
          <p className="mb-2 text-[10px] font-semibold tracking-widest text-white/35 uppercase md:mb-3 md:text-[11px]">
            Trailer
          </p>
          <div className="w-full overflow-hidden rounded-[16px] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <iframe
              className="aspect-video w-full"
              src={`https://www.youtube.com/embed/${trailer?.data?.key}?autoplay=1&mute=1`}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default MovieModal;
