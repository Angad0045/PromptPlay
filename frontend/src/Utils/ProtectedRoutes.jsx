import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { addUser } from "./Slices/UserSlice";
import { useEffect, useState } from "react";
import { BASE_URL } from "./Constants";

const ProtectedRoutes = () => {
  const userData = useSelector((store) => store?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const FetchUser = async () => {
      if (userData) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${BASE_URL}/auth/user`, {
          withCredentials: true,
        });
        dispatch(addUser(res?.data?.data));
      } catch (err) {
        if (err?.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    FetchUser();
  }, []);

  if (isLoading) return null;

  return <Outlet />;
};

export default ProtectedRoutes;
