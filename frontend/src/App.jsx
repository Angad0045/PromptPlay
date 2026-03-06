import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider, useSelector } from "react-redux";
import appStore from "./Utils/appStore";
import LoginPage from "./screens/LoginPage";
import NotFoundPage from "./screens/NotFoundPage";
import HomePage from "./screens/HomePage";
import SubscriptionsPage from "./screens/SubscriptionsPage";
import SuccessPage from "./screens/SuccessPage";
import FailurePage from "./screens/FailurePage";
import AISearchPage from "./screens/AISearchPage";
import ProtectedRoutes from "./Utils/ProtectedRoutes";
import UpgradePlanPage from "./screens/UpgradePlanPage";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import WatchlistPage from "./screens/WatchListPage";
import AISearchComponent from "./component/AISearchComponent";
import AmbientGlow from "./component/AmbientGlow";

const AUTH_ROUTES = ["/login", "/", "/fail", "/success"];

const AppLayout = () => {
  const user = useSelector((store) => store.user);
  const isUserPremium = user?.planType === "premium";

  const location = useLocation();
  const isAuthPage = AUTH_ROUTES.includes(location.pathname);

  const GoogleAuthWrapper = () => (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_CODE}>
      <LoginPage />
    </GoogleOAuthProvider>
  );

  return (
    <>
      <AmbientGlow />
      {!isAuthPage && <Navbar />}
      {!isAuthPage && isUserPremium && <AISearchComponent />}

      <Routes>
        <Route path="/login" element={<GoogleAuthWrapper />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/fail" element={<FailurePage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/subscription" element={<SubscriptionsPage />} />
          <Route path="/list" element={<WatchlistPage />} />
          <Route path="/subscription/upgrade" element={<UpgradePlanPage />} />
          <Route path="/movies/suggestions" element={<AISearchPage />} />
        </Route>
      </Routes>

      {!isAuthPage && <Footer />}
    </>
  );
};

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
