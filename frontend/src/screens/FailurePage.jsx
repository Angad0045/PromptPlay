import { motion } from "motion/react";
import { XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FailurePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#080808] px-4">
      {/* Ambient glows */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-red-900/20 blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-red-950/20 blur-[80px]" />
      </div>

      {/* Glass card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 flex w-full max-w-sm flex-col items-center gap-6 overflow-hidden rounded-[28px] border border-white/[0.12] bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.02)_100%)] p-10 text-center shadow-[0_32px_80px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-[40px]"
      >
        {/* Refraction top edge */}
        <div className="absolute top-0 right-10 left-10 h-px rounded-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)]" />

        {/* Icon */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.4,
            delay: 0.2,
            type: "spring",
            stiffness: 200,
          }}
          className="flex h-20 w-20 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10"
        >
          <XCircle className="h-10 w-10 text-red-400" />
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-col gap-2"
        >
          <h1 className="text-2xl font-bold tracking-tight text-white/90">
            Payment Failed
          </h1>
          <p className="text-[13px] leading-relaxed text-white/40">
            Oops! Something went wrong with your payment. Please try again or
            use a different method.
          </p>
        </motion.div>

        {/* Button */}
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          onClick={() => navigate("/subscription")}
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          className="w-full rounded-[14px] border border-red-500/25 bg-[linear-gradient(135deg,rgba(239,68,68,0.3),rgba(185,28,28,0.2))] py-3 text-[13px] font-semibold text-white shadow-[0_4px_20px_rgba(239,68,68,0.15),inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-200 hover:border-red-500/40"
        >
          Try Again
        </motion.button>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          onClick={() => navigate("/home")}
          className="text-[12px] text-white/25 transition-colors hover:text-white/50"
        >
          Go back home
        </motion.button>
      </motion.div>
    </div>
  );
};

export default FailurePage;
