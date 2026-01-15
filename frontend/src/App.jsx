import {
  BrowserRouter,
  Routes,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import LoginPage from "./page/LoginPage";
import AdminLogin from "./page/AdminLogin";
import SignUp from "./page/SignUp";
import DashboardPage from "./page/DashboardPage";
import AdminDashb from "./page/AdminDashb";
import VenueCheck from "./page/VenueCheck";
import ProfilePage from "./page/ProfilePage";
import ContactPage from "./page/ContactPage";
import AdminProfile from "./page/AdminProfile";
import AdminVerification from "./page/AdminVerification";
import ResultCheck from "./page/ResultCheck";
import Layout from "./root/Layout";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route index element={<LoginPage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin-dashboard" element={<AdminDashb />} />
        <Route path="/venue-check" element={<VenueCheck />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/admin-profile" element={<AdminProfile />} />
        <Route path="/admin-verification" element={<AdminVerification />} />
        <Route path="/result-check" element={<ResultCheck />} />
      </Route>
    )
  );
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
