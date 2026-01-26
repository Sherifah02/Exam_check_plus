import axios from "axios";
import { toast } from "react-toastify";
import { useAuthStore } from "../store/authStore";
// import { useAuthStore } from "../stores/authStore";


const guestPages = ["/login", "/signup", '/','/admin/login'];

export const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message;
    const currentPath = window.location.pathname;
    const requestUrl = error?.config?.url || "";

    const isAuthEndpoint =
      requestUrl.includes("/login") ||
      requestUrl.includes("/get-authenticated-user");

    if ((status === 401 || status === 403) && !isAuthEndpoint) {
      if (!guestPages.includes(currentPath)) {
        toast.warn(message || "Session expired, please login again.");
      }

      const { logout, resetAuthState } = useAuthStore.getState();
      if (logout) await logout(false);
      if (resetAuthState) resetAuthState();
    }

    return Promise.reject(error);
  },
);

export default api;
