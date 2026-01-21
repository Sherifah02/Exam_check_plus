import { create } from 'zustand'
import api from "../helper/api"
import { toast } from 'react-toastify'

const initialState = {
  semesters: [],
  levels: [],
  departments: [],
  sessions: []
}
const level_endpoint = "levels"
const department_endpoint = "departments"
const sessions_endpoint = "sessions"
const semester_endpoint = "semester"
export const useGeneralStore = create((set, get) => ({
  ...initialState,
  fetchLevels: async () => {
    try {
      const { data } = await api.get(`${level_endpoint}/get-levels`)
      if (!data.success) {
        toast.error(data.message)
        return { success: false }
      }
      set({ levels: data.levels })
      return { success: true }
    } catch (error) {
      const errMsg =
        error?.response?.data?.message || error.message || "An error occurred";
      toast.error(errMsg);
      return { success: false };
    }
  },
  fetchDepartments: async () => {
    try {
      const { data } = await api.get(`${department_endpoint}/get-departments`)
      if (!data.success) {
        toast.error(data.message)
        return { success: false }
      }
      set({ departments: data.departments })
      return { success: true }
    } catch (error) {
      const errMsg =
        error?.response?.data?.message || error.message || "An error occurred";
      toast.error(errMsg);
      return { success: false };
    }
  },
  fetchSemesters: async () => {
    try {
      const { data } = await api.get(`${semester_endpoint}/get-semester`)
      if (!data.success) {
        toast.error(data.message)
        return { success: false }
      }
      set({ semesters: data.semesters })
      return { success: true }
    } catch (error) {
      const errMsg =
        error?.response?.data?.message || error.message || "An error occurred";
      toast.error(errMsg);
      return { success: false };
    }
  },
  fetchSessions: async () => {
    try {
      const { data } = await api.get(`${sessions_endpoint}/get-sessions`)
      if (!data.success) {
        toast.error(data.message)
        return { success: false }
      }
      set({ sessions: data.sessions })
      return { success: true }
    } catch (error) {
      const errMsg =
        error?.response?.data?.message || error.message || "An error occurred";
      toast.error(errMsg);
      return { success: false };
    }
  },
}))