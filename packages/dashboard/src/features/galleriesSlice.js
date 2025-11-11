import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_PUBLIC_API_URL;

//   1. `POST` ایجاد گالری‌ جدید
export const createGallery = createAsyncThunk("galleries/create", async (formData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}/galleries`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "خطایی رخ داده است!");
  }
});

//   2. `PUT` ویرایش گالری‌
export const updateGallery = createAsyncThunk(
  "galleries/update",
  async ({ slug, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/galleries/${slug}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("successfully!", response.data);

      return response.data;
    } catch (error) {
      console.log("rejected!", error.response?.data?.error);
      return rejectWithValue(error.response?.data?.error || "ویرایش گالری‌ انجام نشد!");
    }
  }
);

//   3. `DELETE` حذف گالری‌
export const deleteGallery = createAsyncThunk("galleries/delete", async (slug, { rejectWithValue }) => {
  try {
    await axios.delete(`${BASE_URL}/galleries/${slug}`);
    console.log("حذف شما با موفقیت انجام شد");
    return slug;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "حذف گالری‌ انجام نشد!");
  }
});

//   4. `GET` دریافت لیست گالری‌ها
export const fetchGalleries = createAsyncThunk("galleries/fetch", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/galleries`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "بارگیری گالری‌ها انجام نشد!");
  }
});

export const fetchGalleryBySlug = createAsyncThunk(
  "galleries/fetchBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/galleries/${slug}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "بارگیری گالری‌ انجام نشد!");
    }
  }
);

//   ایجاد `Slice` مدیریت گالری‌ها
const galleriesSlice = createSlice({
  name: "galleries",
  initialState: {
    galleries: [],
    selectedGallery: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetStatus: (state) => {
      state.selectedGallery = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //   مدیریت `POST`
      .addCase(createGallery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.galleries.push(action.payload);
      })
      .addCase(createGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //   مدیریت `PUT`
      .addCase(updateGallery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedGallery = action.payload;
      })
      .addCase(updateGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //   مدیریت `DELETE`
      .addCase(deleteGallery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.galleries = state.galleries.filter((gallery) => gallery._id !== action.payload);
      })
      .addCase(deleteGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //   مدیریت `GET`
      .addCase(fetchGalleries.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGalleries.fulfilled, (state, action) => {
        state.loading = false;
        state.galleries = action.payload;
      })
      .addCase(fetchGalleries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //   مدیریت `GET` برای یک گالری‌
      .addCase(fetchGalleryBySlug.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGalleryBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedGallery = action.payload;
      })
      .addCase(fetchGalleryBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetStatus } = galleriesSlice.actions;
export default galleriesSlice.reducer;
