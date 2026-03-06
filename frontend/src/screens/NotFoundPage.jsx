import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#080808] px-4">
      {/* Ambient glows */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-amber-900/15 blur-[100px]" />
        <div className="absolute right-0 bottom-0 h-[300px] w-[300px] rounded-full bg-red-900/10 blur-[80px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        {/* 404 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative"
        >
          <p className="text-[140px] leading-none font-black tracking-tighter text-white/[0.04] select-none md:text-[200px]">
            404
          </p>
          <p className="absolute inset-0 flex items-center justify-center text-[48px] leading-none font-black tracking-tighter text-white/80 md:text-[72px]">
            404
          </p>
        </motion.div>

        {/* Glass card */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="relative flex flex-col items-center gap-5 overflow-hidden rounded-[28px] border border-white/[0.12] bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.02)_100%)] px-10 py-8 shadow-[0_32px_80px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-[40px]"
        >
          {/* Refraction top edge */}
          <div className="absolute top-0 right-10 left-10 h-px rounded-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)]" />

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="flex flex-col gap-1.5"
          >
            <h1 className="text-xl font-bold tracking-tight text-white/90">
              Page not found
            </h1>
            <p className="max-w-[280px] text-[13px] leading-relaxed text-white/35">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.45 }}
            className="flex w-full flex-col gap-2"
          >
            <motion.button
              onClick={() => navigate("/home")}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="w-full rounded-[14px] border border-white/20 bg-[linear-gradient(135deg,rgba(255,255,255,0.15),rgba(255,255,255,0.06))] py-2.5 text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] transition-all duration-200 hover:border-white/30"
            >
              Go Home
            </motion.button>
            <motion.button
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="w-full rounded-[14px] py-2.5 text-[13px] font-semibold text-white/40 transition-colors duration-200 hover:text-white/70"
            >
              Go Back
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;
