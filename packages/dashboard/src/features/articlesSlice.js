import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

// 1. `POST` ایجاد مقالۀ جدید
export const createArticle = createAsyncThunk("articles/create", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.post("/blog/articles", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در ایجاد مقاله رخ داده است!");
  }
});

// 2. `PATCH` ویرایش مقالۀ
export const updateArticle = createAsyncThunk(
  "articles/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/blog/articles/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "خطایی در ویرایش مقاله رخ داده است!");
    }
  }
);

// 3. `DELETE` حذف مقالۀ
export const deleteArticle = createAsyncThunk("articles/delete", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/blog/articles/${id}`);
    console.log("حذف شما با موفقیت انجام شد");
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در حذف مقاله رخ داده است!");
  }
});

// 4. `GET` دریافت لیست مقالات
export const fetchArticles = createAsyncThunk("articles/fetch", async (params = {}, { rejectWithValue }) => {
  try {
    const response = await api.get("/blog/articles", { params });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در دریافت مقالات رخ داده است!");
  }
});

// 5. `GET` دریافت یک مقاله با slug یا id
export const fetchArticleBySlug = createAsyncThunk(
  "articles/fetchBySlug",
  async (identifier, { rejectWithValue }) => {
    try {
      const response = await api.get(`/blog/articles/${identifier}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "خطایی در دریافت مقاله رخ داده است!");
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
          state.articles.articles.unshift(action.payload.data);
        }
        // اگر articles یک آبجکت با ویژگی articles باشد
        else if (state.articles && typeof state.articles === "object") {
          if (!state.articles.articles) {
            state.articles.articles = [];
          }
          state.articles.articles.unshift(action.payload.data);
        }
      })
      .addCase(createArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.success = false;
      })

      // مدیریت `PATCH` - ویرایش مقاله
      .addCase(updateArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateArticle.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedArticle = action.payload.data;
        state.success = true;

        // بروزرسانی مقاله در لیست مقالات
        if (Array.isArray(state.articles.articles)) {
          const index = state.articles.articles.findIndex(
            (article) => article._id === action.payload.data._id
          );
          if (index !== -1) {
            state.articles.articles[index] = action.payload.data;
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
            (article) => article._id !== action.payload
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
        state.totalPages = action.payload.pagination?.totalPages || 1;
        state.currentPage = action.payload.pagination?.page || 1;
        state.total = action.payload.pagination?.total || 0;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // مدیریت `GET` - دریافت یک مقاله با slug یا id
      .addCase(fetchArticleBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedArticle = null;
      })
      .addCase(fetchArticleBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedArticle = action.payload.data;
      })
      .addCase(fetchArticleBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { resetStatus, setCurrentPage } = articlesSlice.actions;
export default articlesSlice.reducer;
