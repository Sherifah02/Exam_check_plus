import { create } from "zustand";
import api from "../helper/api";
import { toast } from "react-toastify";

const initialState = {
  loadingVenue: false,
  venueSuccess: null,
  venueError: null,
};
const ENDPOINT = "venue";
export const useVenueStore = create((set) => ({
  ...initialState,
  uploadVenueAllocation: async (payload) => {
    set({ loadingVenue: true, venueSuccess: null, venueError: null });
    try {
      const { data } = await api.post(`${ENDPOINT}/upload-venue`, payload);
      if (!data.success) {
        set({
          loadingVenue: true,
          venueSuccess: null,
          venueError: data.message,
        });
        toast.error(data.message);
        return { success: false };
      }
      set({ loadingVenue: true, venueSuccess: data.message, venueError: null });
      toast.success(data.message)
      return { success: true };
    } catch (error) {
       const errMsg =
        error?.response?.data?.message || error.message || "An error occurred";
      toast.error(errMsg);
      console.log(error);
      return {success:false}
    } finally {
      set({ loadingVenue: true });
    }
  },
  checkVenue:async(payload)=>{
    try {
      const {data}= await api.post(`${ENDPOINT}/check-venue`, payload)
     if (!data.success) {
        set({
          loadingVenue: true,
          venueSuccess: null,
          venueError: data.message,
        });
        toast.error(data.message);
        return { success: false };
      }
      set({ loadingVenue: true, venueSuccess: data.message, venueError: null });
      toast.success(data.message)
      console.log(data.venues)
      return { success: true, data:data.venues };
    } catch (error) {
       const errMsg =
        error?.response?.data?.message || error.message || "An error occurred";
      toast.error(errMsg);
      console.log(error);
      return {success:false}
    } finally {
      set({ loadingVenue: true });
    }
  }
}));
