import { create } from 'zustand'
import api from '../helper/api'
import { toast } from 'react-toastify'

const initialState = {
  resultData: null,
  loadingResult: false,
  resultError: null,
  resultSuccess: null,
  result_status:null,
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
      return { success: false };
    }
  },
  fetchResultBatches: async (payload) => {
    set({ loadingResult: true, resultError: null, resultSuccess: null })
    try {
      const { data } = await api.post(`${ENDPOINT}/all-result-batch`, payload)
      if (!data.success) {
        toast.error(data.message)
        set({ loadingResult: false, resultError: data.message, resultSuccess: null })
        return { success: false, data:[] }
      }
      set({ loadingResult: false, resultError: null, resultSuccess: data.message })
      toast.success(data.message)
      return { success: true, data:data?.data || [] }
    } catch (error) {
      const errMsg =
        error?.response?.data?.message || error.message || "An error occurred";
      toast.error(errMsg);
      set({
        loadingUser: false,
        userError: errMsg,
      });
      return { success: false, data:[] };
    }
  },
  deleteResultBatch: async (payload) => {
    set({ loadingResult: true, resultError: null, resultSuccess: null })
    try {
      const { data } = await api.post(`${ENDPOINT}/delete-result-batch/${payload}`)
      if (!data.success) {
        toast.error(data.message)
        set({ loadingResult: false, resultError: data.message, resultSuccess: null })
        return { success: false }
      }
      set({ loadingResult: false, resultError: null, resultSuccess: data.message })
      toast.success(data.message)
      return { success: true,  }
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
    console.table(payload)
    set({ loadingResult: true, resultError: null, resultSuccess: null })
    try {
      const { data } = await api.post(`${ENDPOINT}/check-student-result`, payload)
      if (!data.success) {
        toast.error(data.message)
        set({ loadingResult: false, resultError: data.message, resultSuccess: null })
        return { success: false }
      }
      set({ loadingResult: false, resultError: null, resultSuccess: data.message, resultData: data.result })
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
  checkResultStatus: async () => {
    set({ loadingResult: true, resultError: null, resultSuccess: null })
    try {
      const { data } = await api.get(`${ENDPOINT}/check-result-status`, )
      if (!data.success) {
        toast.error(data.message)
        set({ loadingResult: false, resultError: data.message, resultSuccess: null })
        return { success: false }
      }

      console.log("line 117:",data)
      set({ loadingResult: false, resultError: null, resultSuccess: data.message, result_status: data.isOpen })
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

  toggleResultStatus: async (payload) => {
    console.table(payload)
    set({ loadingResult: true, resultError: null, resultSuccess: null })
    try {
      const { data } = await api.post(`${ENDPOINT}/toggle-result-status`, payload)
      if (!data.success) {
        toast.error(data.message)
        set({ loadingResult: false, resultError: data.message, resultSuccess: null })
        return { success: false }
      }
      set({ loadingResult: false, resultError: null, resultSuccess: data.message, result_status: data.data.status })
      console.log(data)
      return { success: true }
    } catch (error) {
      console.log(error)
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