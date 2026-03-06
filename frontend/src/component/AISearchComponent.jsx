import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BotIcon, Search, X } from "lucide-react";
import {
  useAiSearchSuggestionsMutation,
  useLazyMovieTrailerQuery,
} from "../Utils/Slices/moviesApi";
import MovieModal from "./MovieModal";
import { createPortal } from "react-dom";

function AISearchComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [selectMovie, setSelectMovie] = useState(null);

  const [getAISuggestions, { data, isLoading }] =
    useAiSearchSuggestionsMutation();
  const [getTrailer, { data: trailer }] = useLazyMovieTrailerQuery();

  const handleSubmit = async () => {
    if (isLoading || prompt.trim().length < 5) return;
    await getAISuggestions(prompt);
  };

  const handleSelectMovie = (movie) => {
    setSelectMovie(movie);
    getTrailer(movie.id);
  };

  const results = data?.data || [];

  return createPortal(
    <>
      {/* ── Trigger Button ── */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed right-5 bottom-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.2] bg-[linear-gradient(135deg,rgba(255,255,255,0.18),rgba(255,255,255,0.06))] shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-[40px] transition-all duration-300 md:right-8 md:bottom-8 md:h-14 md:w-14"
      >
        {/* <div className="absolute top-0 right-3 left-3 h-px rounded-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)]" /> */}

        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              className="text-white/80"
            >
              <X className="h-4 w-4 md:h-5 md:w-5" />
            </motion.span>
          ) : (
            <motion.span
              key="bot"
              initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              className="text-white/80"
            >
              <BotIcon className="h-4 w-4 md:h-5 md:w-5" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Search Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="/* ── Mobile: bottom sheet style ── */ /* ── Desktop: floating panel ── */ fixed right-3 bottom-20 left-3 z-50 rounded-[24px] border border-white/[0.18] bg-[linear-gradient(135deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_100%)] shadow-[0_32px_64px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.1)] backdrop-blur-[40px] md:right-8 md:bottom-28 md:left-auto md:w-[340px] md:rounded-[28px]"
          >
            <div className="absolute top-0 right-8 left-8 h-px rounded-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)]" />

            <div className="p-4 md:p-4">
              {/* ── Header ── */}
              <div className="mb-4 flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.15] bg-white/10">
                  <BotIcon className="h-3.5 w-3.5 text-white/70" />
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-white/90">
                    AI Suggestions
                  </p>
                  <p className="text-[10px] text-white/35">
                    Describe what you want to watch
                  </p>
                </div>
              </div>

              {/* ── Divider ── */}
              <div className="mb-4 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)]" />

              {/* ── Input + Button ── */}
              <div className="flex flex-col gap-2">
                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                      }
                    }}
                    rows={3}
                    maxLength={500}
                    placeholder="e.g. A thriller with a twist ending set in space..."
                    className="w-full resize-none appearance-none rounded-[16px] border border-white/[0.15] bg-white/[0.06] px-4 py-3 text-[13px] text-white/80 placeholder-white/25 backdrop-blur-[20px] transition-all duration-200 outline-none [-ms-overflow-style:none] [scrollbar-width:none] focus:border-white/30 focus:bg-white/[0.08] [&::-webkit-scrollbar]:hidden"
                  />
                  <span className="absolute right-3 bottom-2.5 text-[10px] text-white/20">
                    {prompt.length}/500
                  </span>
                </div>

                <motion.button
                  onClick={handleSubmit}
                  disabled={isLoading || prompt.trim().length < 5}
                  whileHover={
                    !isLoading && prompt.trim().length >= 5
                      ? { scale: 1.02, y: -1 }
                      : {}
                  }
                  whileTap={
                    !isLoading && prompt.trim().length >= 5
                      ? { scale: 0.98 }
                      : {}
                  }
                  transition={{ duration: 0.15 }}
                  className="flex w-full items-center justify-center gap-2 rounded-[14px] border border-white/20 bg-[linear-gradient(135deg,rgba(255,255,255,0.18),rgba(255,255,255,0.08))] py-2.5 text-[12px] font-semibold text-white shadow-[0_4px_12px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.15)] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="h-3.5 w-3.5 rounded-full border-2 border-white/20 border-t-white/70"
                      />
                      <span>Finding movies...</span>
                    </>
                  ) : (
                    <>
                      <Search className="h-3.5 w-3.5" />
                      <span>Find Movies</span>
                    </>
                  )}
                </motion.button>
              </div>

              {/* ── Results ── */}
              <AnimatePresence>
                {results.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="my-4 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)]" />

                    <p className="mb-3 text-[10px] font-semibold tracking-widest text-white/35 uppercase">
                      {results.length} suggestions
                    </p>

                    {/* ── Poster grid — 5 cols on all sizes since panel is fixed width ── */}
                    <div className="grid grid-cols-5 gap-2">
                      {results.map((movie, index) => (
                        <motion.div
                          key={movie.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          whileHover={{ scale: 1.06, y: -3 }}
                          onClick={() => handleSelectMovie(movie)}
                          className="group flex cursor-pointer flex-col gap-1"
                        >
                          {movie.poster_path ? (
                            <div className="overflow-hidden rounded-[10px] border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
                              <img
                                src={movie.poster_path}
                                alt={movie.title}
                                className="aspect-[2/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            </div>
                          ) : (
                            <div className="flex aspect-[2/3] w-full items-center justify-center rounded-[10px] border border-white/10 bg-white/[0.06]">
                              <BotIcon className="h-4 w-4 text-white/20" />
                            </div>
                          )}
                          <p className="truncate text-[9px] leading-tight font-medium text-white/50">
                            {movie.title}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Movie Modal ── */}
      {selectMovie && (
        <MovieModal
          selectMovie={selectMovie}
          onClose={() => setSelectMovie(null)}
          trailer={trailer}
        />
      )}
    </>,
    document.body,
  );
}

export default AISearchComponent;
