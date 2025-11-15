import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

// 1. `POST` ایجاد خبر جدید
export const createNews = createAsyncThunk("news/create", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.post("/news", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در ایجاد خبر رخ داده است!");
  }
});

// 2. `PATCH` ویرایش خبر
export const updateNews = createAsyncThunk(
  "news/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/news/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "خطایی در ویرایش خبر رخ داده است!");
    }
  }
);

// 3. `DELETE` حذف خبر
export const deleteNews = createAsyncThunk("news/delete", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/news/${id}`);
    console.log("حذف شما با موفقیت انجام شد");
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در حذف خبر رخ داده است!");
  }
});

// 4. `GET` دریافت لیست اخبار
export const fetchNews = createAsyncThunk("news/fetch", async (params = {}, { rejectWithValue }) => {
  try {
    const response = await api.get("/news", { params });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در دریافت اخبار رخ داده است!");
  }
});

// 5. `GET` دریافت یک خبر با slug یا id
export const fetchNewsBySlug = createAsyncThunk(
  "news/fetchBySlug",
  async (identifier, { rejectWithValue }) => {
    try {
      const response = await api.get(`/news/${identifier}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "خطایی در دریافت خبر رخ داده است!");
    }
  }
);

// ایجاد `Slice` مدیریت اخبار
const newsSlice = createSlice({
  name: "news",
  initialState: {
    news: { news: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } },
    selectedNews: null,
    loading: false,
    error: null,
    success: false,
    totalPages: 0,
    currentPage: 1,
    total: 0,
  },
  reducers: {
    resetStatus: (state) => {
      state.selectedNews = null;
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
      // مدیریت `POST` - ایجاد خبر
      .addCase(createNews.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createNews.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // اگر news.news یک آرایه باشد
        if (Array.isArray(state.news.news)) {
          state.news.news.unshift(action.payload.data);
        }
      })
      .addCase(createNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.success = false;
      })

      // مدیریت `PATCH` - ویرایش خبر
      .addCase(updateNews.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateNews.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedNews = action.payload.data;
        state.success = true;

        // بروزرسانی خبر در لیست اخبار
        if (Array.isArray(state.news.news)) {
          const index = state.news.news.findIndex(
            (newsItem) => newsItem._id === action.payload.data._id
          );
          if (index !== -1) {
            state.news.news[index] = action.payload.data;
          }
        }
      })
      .addCase(updateNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.success = false;
      })

      // مدیریت `DELETE` - حذف خبر
      .addCase(deleteNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNews.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        // حذف خبر از لیست اخبار
        if (Array.isArray(state.news.news)) {
          state.news.news = state.news.news.filter(
            (newsItem) => newsItem._id !== action.payload
          );
        }
      })
      .addCase(deleteNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.success = false;
      })

      // مدیریت `GET` - دریافت لیست اخبار
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news = action.payload;
        state.totalPages = action.payload.pagination?.totalPages || 1;
        state.currentPage = action.payload.pagination?.page || 1;
        state.total = action.payload.pagination?.total || 0;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // مدیریت `GET` - دریافت یک خبر با slug یا id
      .addCase(fetchNewsBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedNews = null;
      })
      .addCase(fetchNewsBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedNews = action.payload.data;
      })
      .addCase(fetchNewsBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { resetStatus, setCurrentPage } = newsSlice.actions;
export default newsSlice.reducer;
