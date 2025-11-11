import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_PUBLIC_API_URL;

//  4. `GET` دریافت لیست قالب‌ها
export const fetchTemplates = createAsyncThunk("templates/fetch", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/templates`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "بارگیری قالب‌ها انجام نشد!");
  }
});

// ایجاد `Slice` مدیریت قالب‌ها
const templatesSlice = createSlice({
  name: "templates",
  initialState: {
    templates: [],
    loading: false,
    error: null,
  },
  reducers: {
    templatesResetStatus: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // واکشی قالب‌ها
      .addCase(fetchTemplates.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export const { templatesResetStatus } = templatesSlice.actions;

export default templatesSlice.reducer;
