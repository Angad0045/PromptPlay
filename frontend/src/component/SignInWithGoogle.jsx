import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { BASE_URL } from "../Utils/Constants";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../Utils/Slices/UserSlice";

const SignInWithGoogle = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const responseGoogle = async (authResult) => {
    try {
      const code = authResult.code;
      if (!code) return;

      const res = await axios.post(
        `${BASE_URL}/auth/signInWithGoogle`,
        { code },
        { withCredentials: true },
      );

      dispatch(addUser(res?.data?.data));
      navigate("/home");
    } catch (err) {
      console.error("Google Sign-In failed:", err);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: (error) => console.error("Google login failed:", error),
    flow: "auth-code",
  });

  return (
    <div className="w-full p-5 flex justify-center">
      <button
        type="button"
        onClick={googleLogin}
        className="flex items-center justify-center w-full gap-3 p-3 border border-gray-300 rounded-xl bg-white text-gray-700 font-medium shadow-sm hover:bg-gray-50 active:scale-[0.98] transition-all duration-200"
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google"
          className="w-5 h-5"
        />
        <span>Sign in with Google</span>
      </button>
    </div>
  );
};

export default SignInWithGoogle;
