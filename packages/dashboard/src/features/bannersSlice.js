import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_PUBLIC_API_URL;

//   2. `PUT` ویرایش بنر
export const updateBanner = createAsyncThunk("banners/update", async ({ formData }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${BASE_URL}/banners`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    console.log("rejected!", error.response?.data?.error);
    return rejectWithValue(error.response?.data?.error || "ویرایش بنر انجام نشد!");
  }
});

// 4. `GET` دریافت لیست بنرها
export const fetchBanners = createAsyncThunk("banners/fetch", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/banners`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "بارگیری بنرها انجام نشد!");
  }
});

// ایجاد `Slice` مدیریت بنرها
const bannersSlice = createSlice({
  name: "banners",
  initialState: {
    banners: null,
    selectedBanner: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // مدیریت `PUT`
      .addCase(updateBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBanner = action.payload;
      })
      .addCase(updateBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // مدیریت `GET`
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBanner = action.payload;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default bannersSlice.reducer;
