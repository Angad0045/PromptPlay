import axios from "axios";
import { addUser } from "./Slices/UserSlice";
import { BASE_URL } from "./Constants";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const AuthLoader = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/auth/user`, {
          withCredentials: true,
        });
        console.log(res?.data?.data);
        dispatch(addUser(res?.data?.data));
      } catch (err) {
        console.log("Something went wrong", err);
        navigate("/login");
      }
    };

    getUser();
  }, []);
  return children;
};

export default AuthLoader;
