import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_PUBLIC_API_URL;

export const fetchview = createAsyncThunk("view/fetch", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/view`);
    return response.data;
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
