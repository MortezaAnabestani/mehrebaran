import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

//   1. `POST` ایجاد گالری‌ جدید
export const createGallery = createAsyncThunk("galleries/create", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.post("/blog/gallery", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در ایجاد گالری رخ داده است!");
  }
});

//   2. `PATCH` ویرایش گالری‌
export const updateGallery = createAsyncThunk(
  "galleries/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/blog/gallery/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "خطایی در ویرایش گالری رخ داده است!");
    }
  }
);

//   3. `DELETE` حذف گالری‌
export const deleteGallery = createAsyncThunk("galleries/delete", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/blog/gallery/${id}`);
    console.log("حذف شما با موفقیت انجام شد");
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در حذف گالری رخ داده است!");
  }
});

//   4. `GET` دریافت لیست گالری‌ها
export const fetchGalleries = createAsyncThunk("galleries/fetch", async (params = {}, { rejectWithValue }) => {
  try {
    const response = await api.get("/blog/gallery", { params });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در دریافت گالری‌ها رخ داده است!");
  }
});

export const fetchGalleryBySlug = createAsyncThunk(
  "galleries/fetchBySlug",
  async (identifier, { rejectWithValue }) => {
    try {
      const response = await api.get(`/blog/gallery/${identifier}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "خطایی در دریافت گالری رخ داده است!");
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
      //   مدیریت `POST` - ایجاد گالری
      .addCase(createGallery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGallery.fulfilled, (state, action) => {
        state.loading = false;
        // اگر galleries یک آرایه باشد
        if (Array.isArray(state.galleries)) {
          state.galleries.push(action.payload.data);
        }
      })
      .addCase(createGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      //   مدیریت `PATCH` - ویرایش گالری
      .addCase(updateGallery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedGallery = action.payload.data;

        // بروزرسانی گالری در لیست گالری‌ها
        if (Array.isArray(state.galleries)) {
          const index = state.galleries.findIndex(
            (gallery) => gallery._id === action.payload.data._id
          );
          if (index !== -1) {
            state.galleries[index] = action.payload.data;
          }
        }
      })
      .addCase(updateGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      //   مدیریت `DELETE` - حذف گالری
      .addCase(deleteGallery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGallery.fulfilled, (state, action) => {
        state.loading = false;

        // حذف گالری از لیست گالری‌ها
        if (Array.isArray(state.galleries)) {
          state.galleries = state.galleries.filter(
            (gallery) => gallery._id !== action.payload
          );
        }
      })
      .addCase(deleteGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      //   مدیریت `GET` - دریافت لیست گالری‌ها
      .addCase(fetchGalleries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGalleries.fulfilled, (state, action) => {
        state.loading = false;
        state.galleries = action.payload.data || action.payload;
      })
      .addCase(fetchGalleries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      //   مدیریت `GET` - دریافت یک گالری
      .addCase(fetchGalleryBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedGallery = null;
      })
      .addCase(fetchGalleryBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedGallery = action.payload.data;
      })
      .addCase(fetchGalleryBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { resetStatus } = galleriesSlice.actions;
export default galleriesSlice.reducer;
