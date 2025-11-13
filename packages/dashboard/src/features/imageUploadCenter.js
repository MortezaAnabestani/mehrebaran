import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_PUBLIC_API_URL;

//   1. `POST` ایجاد عکس آپلود سنتر جدید
export const createImageUploadCenter = createAsyncThunk(
  "imageUploadCenter/create",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/imageUploadCenter`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "خطایی رخ داده است!");
    }
  }
);

//   3. `DELETE` حذف عکس آپلود سنتر
export const deleteImageUploadCenter = createAsyncThunk(
  "imageUploadCenter/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/imageUploadCenter/${id}`);
      console.log("حذف شما با موفقیت انجام شد");
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "حذف عکس آپلود سنتر انجام نشد!");
    }
  }
);

//   4. `GET` دریافت لیست عکسها
export const fetchImageUploadCenter = createAsyncThunk(
  "imageUploadCenter/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/imageUploadCenter`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "بارگیری عکسها انجام نشد!");
    }
  }
);

//   ایجاد `Slice` مدیریت عکسها
const imageUploadCenterlice = createSlice({
  name: "imageUploadCenter",
  initialState: {
    imageUploadCenter: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //   مدیریت `POST`
      .addCase(createImageUploadCenter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createImageUploadCenter.fulfilled, (state, action) => {
        state.loading = false;
        state.imageUploadCenter.push(action.payload);
      })
      .addCase(createImageUploadCenter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      //   مدیریت `DELETE`
      .addCase(deleteImageUploadCenter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteImageUploadCenter.fulfilled, (state, action) => {
        state.loading = false;
        state.imageUploadCenter = state.imageUploadCenter.filter(
          (imageUploadCenter) => imageUploadCenter._id !== action.payload
        );
      })
      .addCase(deleteImageUploadCenter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchImageUploadCenter.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchImageUploadCenter.fulfilled, (state, action) => {
        state.loading = false;
        state.imageUploadCenter = action.payload;
      })
      .addCase(fetchImageUploadCenter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default imageUploadCenterlice.reducer;
