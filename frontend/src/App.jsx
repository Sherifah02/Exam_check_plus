import {
  BrowserRouter,
  Routes,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
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
import ProtectedRoute from "./hook/ProtectedRoute";
import GuestRoute from "./hook/GuestRoute";
import ResultUploadPage from "./page/ResultUploadPage";
import VenueUploadPage from "./page/VenuePage";
import AdminResultBatches from "./page/ResultBatches";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/admin/login"
          element={
            <GuestRoute>
              <AdminLogin />
            </GuestRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <GuestRoute>
              <SignUp />
            </GuestRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole={["student"]}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole={["admin"]}>
              <AdminDashb />
            </ProtectedRoute>
          }
        />
        <Route path="/venue-check" element={<VenueCheck />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute requiredRole={["student"]}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="/contact" element={<ContactPage />} />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute requiredRole={["admin"]}>
              <AdminProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/results/batches"
          element={
            <ProtectedRoute requiredRole={["admin"]}>
              <AdminResultBatches />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/verification"
          element={
            <ProtectedRoute>
              <AdminVerification />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/result-upload"
          element={
            <ProtectedRoute>
              <ResultUploadPage />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/upload-venue"
          element={
            <ProtectedRoute>
              <VenueUploadPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/result-check"
          element={
            <ProtectedRoute requiredRole={["student"]}>
              <ResultCheck />
            </ProtectedRoute>
          }
        />
      </Route>,
    ),
  );
  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
