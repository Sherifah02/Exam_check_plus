import { create } from "zustand";
import api from "../helper/api";
import { toast } from "react-toastify";

const initialState = {
  user: null,
  loadingUser: false,
  userError: null,
  userSuccess: null,
};
const ENDPOINT = "auth";
export const useAuthStore = create((set, get) => ({
  ...initialState,
  resetAuthState: () => set({ ...initialState }),
  verifyStudent: async (payload) => {
    set({
      loadingUser: true,
      userSuccess: null,
      userError: null,
    });
    try {
      const { data } = await api.post(`${ENDPOINT}/verify-student`, payload);
      if (!data.success) {
        toast.error(data.message);
        set({
          loadingUser: false,
          userError: data.message,
        });
        return { success: false };
      }
      toast.success(data.message);
      set({
        loadingUser: false,
        userSuccess: data.message,
      });
      return { success: true };
    } catch (error) {
      const errMsg =
        error?.response?.data?.message || error.message || "An error occurred";
      toast.error(errMsg);
      set({
        loadingUser: false,
        userError: errMsg,
      });
      return { success: false };
    }
  },
  verifyAndCreateUser: async (payload) => {
    set({
      loadingUser: true,
      userSuccess: null,
      userError: null,
    });
    try {
      const { data } = await api.post(`${ENDPOINT}/verify-and-create-account`, payload);
      if (!data.success) {
        toast.error(data.message);
        set({
          loadingUser: false,
          userError: data.message,
        });
        return { success: false };
      }
      toast.success(data.message);
      set({
        loadingUser: false,
        userSuccess: data.message,
      });
      return { success: true };
    } catch (error) {
      const errMsg =
        error?.response?.data?.message || error.message || "An error occurred";
      toast.error(errMsg);
      set({
        loadingUser: false,
        userError: errMsg,
      });
      return { success: false };
    }
  },
  generateTempPassword: async (payload) => {
    set({ loadingUser: true, userError: null, userSuccess: null })
    try {
      const { data } = await api.post(`${ENDPOINT}/generate-temp-password`, payload)
      if (!data.success) {
        toast.error(data.message)
        set({ loadingUser: false, userError: data.message, userSuccess: null })
        return { success: false }
      }
      set({ loadingUser: false, userError: null, userSuccess: data.message })
      toast.success(data.message)
      return { success: true }
    } catch (error) {
      const errMsg =
        error?.response?.data?.message || error.message || "An error occurred";
      toast.error(errMsg);
      set({
        loadingUser: false,
        userError: errMsg,
      });
      return { success: false }
    }
  },
  loginUser: async (payload) => {
    set({ loadingUser: true, userError: null, userSuccess: null })
    try {
      const { data } = await api.post(`${ENDPOINT}/user-login`, payload)
      if (!data.success) {
        toast.error(data.message)
        set({ loadingUser: false, userError: data.message, userSuccess: null, user: null })
        return { success: false }
      }
      console.log(data.user)
      set({ loadingUser: false, userError: null, userSuccess: data.message, user: data.user })
      return { success: true }
    } catch (error) {
      const errMsg =
        error?.response?.data?.message || error.message || "An error occurred";
      toast.error(errMsg);
      set({
        loadingUser: false,
        userError: errMsg,
      });
    }
  },
  checkAuth: async () => {
    set({ loadingUser: true, userError: null, userSuccess: null })
    try {
      const { data } = await api.get(`${ENDPOINT}/get-authenticated-user`)
      if (!data.success) {
        set({ loadingUser: false, userError: data.success, userSuccess: null, user: null })
        toast.error(data.message)
        return
      }
      set({ loadingUser: true, userError: null, userSuccess: null, user: data.user })
    } catch (error) {
      const errMsg =
        error?.response?.data?.message || error.message || "An error occurred";
      toast.error(errMsg);
      set({
        loadingUser: false,
        userError: errMsg,
        user: null
      });
    }
  },
  logout: async (manual = true) => {
    try {
      const { data } = await api.post(`${ENDPOINT}/logout`);
      console.log(data)
      if (!data.success) {
        toast.error(data.message)
        return { success: false }
      }
      if (manual) { toast.success(data.message) }
      set({ ...initialState })
      return { success: true }
    } catch (error) {

      console.log(error)
      // ignore network errors
      return { success: false }
    }
  },
}));
