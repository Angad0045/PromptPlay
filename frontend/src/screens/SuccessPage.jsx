import { motion } from "motion/react";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#080808] px-4">
      {/* Ambient glows */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-emerald-900/20 blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-emerald-950/20 blur-[80px]" />
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
          className="flex h-20 w-20 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10"
        >
          <CheckCircle className="h-10 w-10 text-emerald-400" />
        </motion.div>

        {/* Confetti dots */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: Math.cos((i / 6) * Math.PI * 2) * 60,
              y: Math.sin((i / 6) * Math.PI * 2) * 60,
            }}
            transition={{ duration: 0.8, delay: 0.3 + i * 0.05 }}
            className="absolute h-2 w-2 rounded-full"
            style={{
              background: [
                "#34d399",
                "#fbbf24",
                "#60a5fa",
                "#f472b6",
                "#a78bfa",
                "#34d399",
              ][i],
              top: "28%",
              left: "50%",
            }}
          />
        ))}

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-col gap-2"
        >
          <h1 className="text-2xl font-bold tracking-tight text-white/90">
            Payment Successful!
          </h1>
          <p className="text-[13px] leading-relaxed text-white/40">
            Thank you for subscribing! You now have full access to all premium
            features 🚀
          </p>
        </motion.div>

        {/* Button */}
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          onClick={() => navigate("/home")}
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          className="flex w-full items-center justify-center gap-2 rounded-[14px] border border-emerald-500/25 bg-[linear-gradient(135deg,rgba(52,211,153,0.3),rgba(6,95,70,0.2))] py-3 text-[13px] font-semibold text-white shadow-[0_4px_20px_rgba(52,211,153,0.15),inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-200 hover:border-emerald-500/40"
        >
          Go to Home
          <ArrowRight className="h-4 w-4" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default SuccessPage;
