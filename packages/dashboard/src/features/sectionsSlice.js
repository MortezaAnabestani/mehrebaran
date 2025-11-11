import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_SERVER_PUBLIC_API_URL;

export const fetchSections = createAsyncThunk("sections/fetch", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/sections`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "بارگیری دسته‌بندی‌های محتوایی انجام نشد!");
  }
});

export const fetchSectionById = createAsyncThunk("sections/fetchById", async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/sections/${id}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "بارگیری اطلاعات بخش انجام نشد!");
  }
});

export const updateSection = createAsyncThunk(
  "sections/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/sections/${id}`, data, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("successfully!", response.data);

      return response.data;
    } catch (error) {
      console.log("rejected!", error.response?.data?.error);
      return rejectWithValue(error.response?.data?.error || "ویرایش نویسنده انجام نشد!");
    }
  }
);

const sectionsSlice = createSlice({
  name: "sections",
  initialState: {
    sections: [],
    selectedSection: null,
    loading: false,
    error: null,
  },
  reducers: {
    sectionsResetStatus: (state) => {
      state.selectedSection = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //  مدیریت `PUT`
      .addCase(updateSection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSection.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSection = action.payload;
      })
      .addCase(updateSection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //  مدیریت `GET`
      .addCase(fetchSections.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSections.fulfilled, (state, action) => {
        state.loading = false;
        state.sections = action.payload;
      })
      .addCase(fetchSections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //  مدیریت `GET` برای یک بخش
      .addCase(fetchSectionById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSectionById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSection = action.payload;
      })
      .addCase(fetchSectionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { sectionsResetStatus } = sectionsSlice.actions;

export default sectionsSlice.reducer;
