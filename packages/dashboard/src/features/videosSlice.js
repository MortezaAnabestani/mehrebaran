import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

// 1. `POST` ایجاد ویدئوی جدید
export const createVideo = createAsyncThunk("videos/create", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.post("/blog/videos", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در ایجاد ویدئو رخ داده است!");
  }
});

// 2. `PATCH` ویرایش ویدئو
export const updateVideo = createAsyncThunk(
  "videos/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/blog/videos/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "خطایی در ویرایش ویدئو رخ داده است!");
    }
  }
);

// 3. `DELETE` حذف ویدئو
export const deleteVideo = createAsyncThunk("videos/delete", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/blog/videos/${id}`);
    console.log("حذف شما با موفقیت انجام شد");
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در حذف ویدئو رخ داده است!");
  }
});

// 4. `GET` دریافت لیست ویدئوها
export const fetchVideos = createAsyncThunk("videos/fetch", async (params = {}, { rejectWithValue }) => {
  try {
    const response = await api.get("/blog/videos", { params });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در دریافت ویدئوها رخ داده است!");
  }
});

// 5. `GET` دریافت یک ویدئو با slug یا id
export const fetchVideoBySlug = createAsyncThunk(
  "videos/fetchBySlug",
  async (identifier, { rejectWithValue }) => {
    try {
      const response = await api.get(`/blog/videos/${identifier}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "خطایی در دریافت ویدئو رخ داده است!");
    }
  }
);

// ایجاد `Slice` مدیریت ویدئوها
const videosSlice = createSlice({
  name: "videos",
  initialState: {
    videos: [],
    selectedVideo: null,
    loading: false,
    error: null,
    success: false,
    totalPages: 0,
    currentPage: 1,
    total: 0,
  },
  reducers: {
    resetStatus: (state) => {
      state.selectedVideo = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // مدیریت `POST` - ایجاد ویدئو
      .addCase(createVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // اگر videos یک آرایه باشد
        if (Array.isArray(state.videos.videos)) {
          state.videos.videos.unshift(action.payload.data);
        }
        // اگر videos یک آبجکت با ویژگی videos باشد
        else if (state.videos && typeof state.videos === "object") {
          if (!state.videos.videos) {
            state.videos.videos = [];
          }
          state.videos.videos.unshift(action.payload.data);
        }
      })
      .addCase(createVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.success = false;
      })

      // مدیریت `PATCH` - ویرایش ویدئو
      .addCase(updateVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedVideo = action.payload.data;
        state.success = true;

        // بروزرسانی ویدئو در لیست ویدئوها
        if (Array.isArray(state.videos.videos)) {
          const index = state.videos.videos.findIndex(
            (video) => video._id === action.payload.data._id
          );
          if (index !== -1) {
            state.videos.videos[index] = action.payload.data;
          }
        }
      })
      .addCase(updateVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.success = false;
      })

      // مدیریت `DELETE` - حذف ویدئو
      .addCase(deleteVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        // حذف ویدئو از لیست ویدئوها
        if (Array.isArray(state.videos.videos)) {
          state.videos.videos = state.videos.videos.filter(
            (video) => video._id !== action.payload
          );
        }
      })
      .addCase(deleteVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.success = false;
      })

      // مدیریت `GET` - دریافت لیست ویدئوها
      .addCase(fetchVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = action.payload;
        state.totalPages = action.payload.pagination?.totalPages || 1;
        state.currentPage = action.payload.pagination?.page || 1;
        state.total = action.payload.pagination?.total || 0;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // مدیریت `GET` - دریافت یک ویدئو با slug یا id
      .addCase(fetchVideoBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedVideo = null;
      })
      .addCase(fetchVideoBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedVideo = action.payload.data;
      })
      .addCase(fetchVideoBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { resetStatus, setCurrentPage } = videosSlice.actions;
export default videosSlice.reducer;
