import { motion } from "motion/react";
import AmbientGlow from "../component/AmbientGlow";
import SignInWithEmailPassword from "../component/SigninWithEmailPassword";
import SignInWithGoogle from "../component/SignInWithGoogle";

const LoginPage = () => {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#080808] text-white">
      <AmbientGlow />
      <div className="relative z-10 flex w-full flex-col items-center justify-center px-6 py-12 lg:w-[480px] lg:px-12">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 self-center-safe"
        >
          <a href="/" className="flex items-center gap-2">
            <span className="text-3xl font-black tracking-tight text-white">
              Prompt<span className="text-amber-500">Play</span>
            </span>
          </a>
        </motion.div>

        {/* Glass card */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="relative w-full max-w-[400px] overflow-hidden rounded-[28px] border border-white/[0.12] bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.02)_100%)] p-8 shadow-[0_32px_80px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-[40px]"
        >
          {/* Top refraction line */}
          <div className="absolute top-0 right-10 left-10 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)]" />

          <SignInWithEmailPassword />

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/[0.08]" />
            <span className="text-[11px] font-medium tracking-widest text-white/30 uppercase">
              or
            </span>
            <div className="h-px flex-1 bg-white/[0.08]" />
          </div>

          <SignInWithGoogle />
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 text-center text-[11px] text-white/20"
        >
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </motion.p>
      </div>
    </div>
  );
};

export default LoginPage;
