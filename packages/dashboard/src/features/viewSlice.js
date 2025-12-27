import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

export const fetchview = createAsyncThunk("view/fetch", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/admin/analytics/views");
    // استخراج داده‌های واقعی از پاسخ ResponseFormatter
    return response.data.data || response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "بارگیری اطلاعات بازدید انجام نشد!");
  }
});

const viewSlice = createSlice({
  name: "view",
  initialState: {
    view: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchview.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchview.fulfilled, (state, action) => {
        state.loading = false;
        state.view = action.payload;
      })
      .addCase(fetchview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default viewSlice.reducer;
