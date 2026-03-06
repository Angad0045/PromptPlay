import axios from "axios";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BASE_URL } from "../Utils/Constants";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../Utils/Slices/UserSlice";
import { Eye, EyeOff } from "lucide-react";

const GlassInput = ({ error, children, ...props }) => (
  <div className="flex flex-col gap-1.5">
    <input
      {...props}
      className="w-full appearance-none rounded-[14px] border border-white/[0.12] bg-white/[0.06] px-4 py-3 text-[13px] text-white/90 placeholder-white/25 backdrop-blur-[20px] transition-all duration-200 outline-none focus:border-white/25 focus:bg-white/[0.09]"
    />
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="px-1 text-[11px] text-red-400/80"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

const SignInWithEmailPassword = () => {
  const [isSigninForm, setIsSigninForm] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [apiError, setApiError] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setApiError(null);
    try {
      const URL = isSigninForm
        ? `${BASE_URL}/auth/signInWithEmailPassword`
        : `${BASE_URL}/auth/signUpWithEmailPassword`;

      const res = await axios.post(URL, data, { withCredentials: true });
      dispatch(addUser(res?.data?.data));
      navigate(isSigninForm ? "/home" : "/subscription");
    } catch (err) {
      setApiError(
        err?.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    }
  };

  useEffect(() => {
    if (isSubmitSuccessful) reset();
  }, [isSubmitSuccessful, reset]);

  return (
    <div className="flex flex-col gap-1">
      {/* ── Header ── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white/95">
          {isSigninForm ? "Welcome back" : "Create account"}
        </h1>
        <p className="mt-1 text-[13px] text-white/35">
          {isSigninForm
            ? "Sign in to continue to PromptPlay"
            : "Join PromptPlay and discover your next watch"}
        </p>
      </div>

      {/* ── Form ── */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-3"
      >
        {/* Username — signup only */}
        <AnimatePresence>
          {!isSigninForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <GlassInput
                type="text"
                placeholder="Username"
                error={errors.username?.message}
                {...register("username", {
                  required: "Username is required",
                  pattern: {
                    value: /^[A-Za-z][A-Za-z0-9._]{4,}$/,
                    message: "Min 5 chars, start with a letter",
                  },
                })}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Email */}
        <GlassInput
          type="email"
          placeholder="Email"
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Enter a valid email address",
            },
          })}
        />

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <div className="relative">
            <input
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Password"
              className="w-full appearance-none rounded-[14px] border border-white/[0.12] bg-white/[0.06] px-4 py-3 pr-11 text-[13px] text-white/90 placeholder-white/25 backdrop-blur-[20px] transition-all duration-200 outline-none focus:border-white/25 focus:bg-white/[0.09]"
              {...register("password", {
                required: "Password is required",
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/,
                  message:
                    "Min 8 chars with uppercase, lowercase, number & symbol",
                },
              })}
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible((prev) => !prev)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-white/30 transition-colors hover:text-white/60"
            >
              {isPasswordVisible ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <AnimatePresence>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="px-1 text-[11px] text-red-400/80"
              >
                {errors.password.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* API Error */}
        <AnimatePresence>
          {apiError && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="rounded-[10px] border border-red-400/20 bg-red-400/10 px-3 py-2 text-[12px] text-red-400/90"
            >
              {apiError}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={!isSubmitting ? { scale: 1.02, y: -1 } : {}}
          whileTap={!isSubmitting ? { scale: 0.98 } : {}}
          transition={{ duration: 0.15 }}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-[14px] border border-amber-500/25 bg-[linear-gradient(135deg,rgba(245,158,11,0.4),rgba(217,119,6,0.25))] py-3 text-[13px] font-semibold text-white shadow-[0_4px_20px_rgba(245,158,11,0.15),inset_0_1px_0_rgba(255,255,255,0.1)] transition-all duration-200 hover:border-amber-500/40 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white/70"
            />
          ) : isSigninForm ? (
            "Sign in"
          ) : (
            "Create account"
          )}
        </motion.button>
      </form>

      {/* Toggle */}
      <p className="mt-4 text-center text-[12px] text-white/35">
        {isSigninForm ? "Don't have an account? " : "Already have an account? "}
        <button
          type="button"
          onClick={() => {
            setIsSigninForm((prev) => !prev);
            setApiError(null);
          }}
          className="font-semibold text-amber-500/80 transition-colors hover:text-amber-400"
        >
          {isSigninForm ? "Sign up" : "Sign in"}
        </button>
      </p>
    </div>
  );
};

export default SignInWithEmailPassword;
