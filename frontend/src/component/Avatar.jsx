import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../Utils/Slices/UserSlice";
import { BASE_URL } from "../Utils/Constants";
import { motion, AnimatePresence } from "motion/react";
import { Edit2, UserCircle2 } from "lucide-react";
import { GlassButton } from "./GlassButton";

function Avatar() {
  const user = useSelector((store) => store?.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const containerRef = useRef(null);

  // ✅ close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleManageSubscription = async () => {
    const customerId = user?.customer?.id;
    try {
      const res = await axios.get(
        `${BASE_URL}/payment/manage/subscription/${customerId}`,
        { withCredentials: true },
      );
      const url = res?.data?.url;
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      if (process.env.NODE_ENV !== "production") console.error(err);
      navigate("/home");
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await axios.post(
        `${BASE_URL}/auth/logout`,
        {},
        { withCredentials: true },
      );
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      if (process.env.NODE_ENV !== "production") console.error(err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {/* ── Avatar Trigger ── */}
      <div
        className="relative size-10 cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        {/* Spinning border — premium only */}
        {user?.planType === "premium" && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-500"
          />
        )}

        {/* ✅ Show Google picture if available, else icon */}
        <span className="absolute inset-0 flex items-center justify-center">
          {user?.picture ? (
            <img
              src={user.picture}
              alt={user.name}
              className="size-10 rounded-full border border-white/20 object-cover"
            />
          ) : (
            <UserCircle2 className="size-10 text-neutral-50" />
          )}
        </span>
      </div>

      {/* ── Dropdown ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute top-[52px] right-0 z-50 flex min-w-60 flex-col items-start gap-2 rounded-[28px] border border-white/[0.18] bg-[linear-gradient(135deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_100%)] p-3 shadow-[0_32px_64px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.1)] backdrop-blur-[40px]"
          >
            {/* Refraction top edge */}
            <div className="absolute top-0 right-8 left-8 h-px rounded-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)]" />

            {/* ── User Info ── */}
            <div className="flex w-full items-center gap-2.5 px-2 py-1">
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="h-9 w-9 flex-shrink-0 rounded-full border border-white/20 object-cover"
                />
              ) : (
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10">
                  <p className="text-sm font-black text-white/90">
                    {user?.name?.[0]?.toUpperCase()}
                  </p>
                </div>
              )}
              <div className="flex min-w-0 flex-col">
                <p className="truncate text-[13px] font-semibold text-white/90">
                  {user?.name}
                </p>
                <p className="truncate text-[11px] text-white/40">
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)]" />

            {/* ── Plan section ── */}
            {user?.planType === "free" ? (
              <div className="flex w-full flex-col items-center gap-1 px-1">
                <GlassButton
                  className="w-full"
                  onClick={() => {
                    navigate("/subscription/upgrade");
                    setOpen(false);
                  }}
                >
                  ✦ Upgrade to Premium
                </GlassButton>
                <p className="text-center text-[10px] text-white/30">
                  Unlock all features
                </p>
              </div>
            ) : (
              <div
                className="flex w-full cursor-pointer items-center gap-2 rounded-[16px] p-2 text-white/70 transition-all duration-150 hover:bg-white/[0.08] hover:text-white"
                onClick={() => {
                  handleManageSubscription();
                  setOpen(false);
                }}
              >
                <Edit2 className="h-4 w-4" />
                <p className="text-[13px] font-medium">Manage Subscription</p>
              </div>
            )}

            {/* Divider */}
            <div className="h-px w-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)]" />

            {/* ── Logout ── */}
            <GlassButton
              className="w-full"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <div className="flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="h-3 w-3 rounded-full border-2 border-white/20 border-t-white/70"
                  />
                  <span>Logging out...</span>
                </div>
              ) : (
                "Logout"
              )}
            </GlassButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Avatar;
