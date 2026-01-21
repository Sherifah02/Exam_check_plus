import { create } from 'zustand'
import api from '../helper/api'
import { toast } from 'react-toastify'

const initialState = {
  result: null,
  loadingResult: false,
  resultError: null,
  resultSuccess: null
}
const ENDPOINT = 'results'
export const useResultStore = create((set, get) => ({
  ...initialState,
  uploadResult: async (payload) => {
    set({ loadingResult: true, resultError: null, resultSuccess: null })
    try {
      const { data } = await api.post(`${ENDPOINT}/upload-result`, payload)
      if (!data.success) {
        toast.error(data.message)
        set({ loadingResult: false, resultError: data.message, resultSuccess: null })
        return { success: false }
      }
      set({ loadingResult: false, resultError: null, resultSuccess: data.message })
      return { success: true }
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
  checkResult: async (payload) => {
    set({ loadingResult: true, resultError: null, resultSuccess: null })
    try {
      const { data } = await api.post(`${ENDPOINT}/check-student-result`, payload)
      if (!data.success) {
        toast.error(data.message)
        set({ loadingResult: false, resultError: data.message, resultSuccess: null })
        return { success: false }
      }
      set({ loadingResult: false, resultError: null, resultSuccess: data.message, result: data.result })
      return { success: true }
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
}))