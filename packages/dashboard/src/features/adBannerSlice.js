import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_PUBLIC_API_URL;

export const updateAdBanner = createAsyncThunk(
  "adBanner/update",
  async ({ formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/adBanner`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("successfully!", response.data);

      return response.data;
    } catch (error) {
      console.log("rejected!", error.response?.data?.error);
      return rejectWithValue(error.response?.data?.error || "ویرایش بنر انجام نشد!");
    }
  }
);

//   4. `GET` دریافت لیست بنرها
export const fetchAdBanner = createAsyncThunk("adBanner/fetch", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/adBanner`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "بارگیری بنرها انجام نشد!");
  }
});

const adBannerSlice = createSlice({
  name: "adBanner",
  initialState: {
    adBanner: [],
    selectedAdBanner: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetStatus: (state) => {
      state.selectedAdBanner = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateAdBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAdBanner = action.payload;
      })
      .addCase(updateAdBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchAdBanner.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAdBanner = action.payload;
      })
      .addCase(fetchAdBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetStatus } = adBannerSlice.actions;
export default adBannerSlice.reducer;
