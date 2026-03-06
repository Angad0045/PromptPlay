import { motion } from "motion/react";
import { cn } from "../libs/utils";

export const GlassButton = ({ children, className, ...props }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className={cn(
        "rounded-full border border-white/20 bg-[linear-gradient(135deg,rgba(255,255,255,0.2),rgba(255,255,255,0.08))] px-5 py-2 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-[40px] transition-all duration-200 hover:border-white/30 hover:bg-[linear-gradient(135deg,rgba(255,255,255,0.25),rgba(255,255,255,0.12))]",
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};
