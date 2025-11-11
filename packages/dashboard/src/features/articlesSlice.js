import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_PUBLIC_API_URL;

// 1. `POST` ایجاد مقالۀ جدید
export const createArticle = createAsyncThunk("articles/create", async (formData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}/articles`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "خطایی در ایجاد مقاله رخ داده است!");
  }
});

// 2. `PUT` ویرایش مقالۀ
export const updateArticle = createAsyncThunk(
  "articles/update",
  async ({ slug, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/articles/${slug}`, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "خطایی در ویرایش مقاله رخ داده است!");
    }
  }
);

// 3. `DELETE` حذف مقالۀ
export const deleteArticle = createAsyncThunk("articles/delete", async (slug, { rejectWithValue }) => {
  try {
    await axios.delete(`${BASE_URL}/articles/${slug}`);
    console.log("حذف شما با موفقیت انجام شد");

    return slug;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "خطایی در حذف مقاله رخ داده است!");
  }
});

// 4. `GET` دریافت لیست مقالات
export const fetchArticles = createAsyncThunk("articles/fetch", async (params = {}, { rejectWithValue }) => {
  try {
    // ساخت پارامترهای URL برای فیلتر کردن
    const queryParams = new URLSearchParams();

    // افزودن پارامترهای فیلتر
    if (params.title) queryParams.append("title", params.title);
    if (params.section) queryParams.append("section", params.section);
    if (params.author) queryParams.append("author", params.author);
    if (params.status) queryParams.append("status", params.status);
    if (params.tags) queryParams.append("tags", params.tags);

    // افزودن پارامترهای صفحه‌بندی
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);

    // افزودن پارامترهای مرتب‌سازی
    if (params.sort) queryParams.append("sort", params.sort);

    const url = `${BASE_URL}/articles${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "خطایی در دریافت مقالات رخ داده است!");
  }
});

// 5. `GET` دریافت یک مقاله با slug
export const fetchArticleBySlug = createAsyncThunk(
  "articles/fetchBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/articles/${slug}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "خطایی در دریافت مقاله رخ داده است!");
    }
  }
);

// ایجاد `Slice` مدیریت مقالات
const articlesSlice = createSlice({
  name: "articles",
  initialState: {
    articles: [],
    selectedArticle: null,
    loading: false,
    error: null,
    success: false,
    totalPages: 0,
    currentPage: 1,
    total: 0,
  },
  reducers: {
    resetStatus: (state) => {
      state.selectedArticle = null;
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
      // مدیریت `POST` - ایجاد مقاله
      .addCase(createArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createArticle.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // اگر articles یک آرایه باشد
        if (Array.isArray(state.articles.articles)) {
          state.articles.articles.unshift(action.payload.article);
        }
        // اگر articles یک آبجکت با ویژگی articles باشد
        else if (state.articles && typeof state.articles === "object") {
          if (!state.articles.articles) {
            state.articles.articles = [];
          }
          state.articles.articles.unshift(action.payload.article);
        }
      })
      .addCase(createArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.success = false;
      })

      // مدیریت `PUT` - ویرایش مقاله
      .addCase(updateArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateArticle.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedArticle = action.payload;
        state.success = true;

        // بروزرسانی مقاله در لیست مقالات
        if (Array.isArray(state.articles.articles)) {
          const index = state.articles.articles.findIndex(
            (article) => article._id === action.payload._id || article.slug === action.payload.slug
          );
          if (index !== -1) {
            state.articles.articles[index] = action.payload;
          }
        }
      })
      .addCase(updateArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.success = false;
      })

      // مدیریت `DELETE` - حذف مقاله
      .addCase(deleteArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteArticle.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        // حذف مقاله از لیست مقالات
        if (Array.isArray(state.articles.articles)) {
          state.articles.articles = state.articles.articles.filter(
            (article) => article.slug !== action.payload
          );
        }
      })
      .addCase(deleteArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.success = false;
      })

      // مدیریت `GET` - دریافت لیست مقالات
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload;
        state.totalPages = action.payload.totalPages || 1;
        state.currentPage = action.payload.page || 1;
        state.total = action.payload.total || 0;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // مدیریت `GET` - دریافت یک مقاله با slug
      .addCase(fetchArticleBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedArticle = null;
      })
      .addCase(fetchArticleBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedArticle = action.payload;
      })
      .addCase(fetchArticleBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { resetStatus, setCurrentPage } = articlesSlice.actions;
export default articlesSlice.reducer;
