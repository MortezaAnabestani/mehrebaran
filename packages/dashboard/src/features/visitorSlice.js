import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_PUBLIC_API_URL;

export const fetchVisitor = createAsyncThunk("visitor/fetch", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/visitor/stats`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "بارگیری اطلاعات بازدید انجام نشد!");
  }
});

export const deleteVisitor = createAsyncThunk("visitors/delete", async (slug, { rejectWithValue }) => {
  try {
    await axios.delete(`${BASE_URL}/visitor/stats`);
    console.log("حذف شما با موفقیت انجام شد");
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "حذف کمپین انجام نشد!");
  }
});

const visitorSlice = createSlice({
  name: "visitor",
  initialState: {
    visitor: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVisitor.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVisitor.fulfilled, (state, action) => {
        state.loading = false;
        state.visitor = action.payload;
      })
      .addCase(fetchVisitor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteVisitor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVisitor.fulfilled, (state, action) => {
        state.loading = false;
        state.visitor = action.payload;
      })
      .addCase(deleteVisitor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default visitorSlice.reducer;
