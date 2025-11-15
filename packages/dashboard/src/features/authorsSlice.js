import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

//   1. `POST` ایجاد نویسنده جدید
export const createAuthor = createAsyncThunk("authors/create", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.post("/authors", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در ایجاد نویسنده رخ داده است!");
  }
});

//   2. `PATCH` ویرایش نویسنده
export const updateAuthor = createAsyncThunk(
  "authors/update",
  async ({ slug, formData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/authors/${slug}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "خطایی در ویرایش نویسنده رخ داده است!");
    }
  }
);

//   3. `DELETE` حذف نویسنده
export const deleteAuthor = createAsyncThunk("authors/delete", async (slug, { rejectWithValue }) => {
  try {
    await api.delete(`/authors/${slug}`);
    console.log("حذف شما با موفقیت انجام شد");
    return slug;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در حذف نویسنده رخ داده است!");
  }
});

//   4. `GET` دریافت لیست نویسندگان
export const fetchAuthors = createAsyncThunk("authors/fetch", async (params = {}, { rejectWithValue }) => {
  try {
    const response = await api.get("/authors", { params });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در دریافت نویسندگان رخ داده است!");
  }
});

export const fetchAuthorBySlug = createAsyncThunk(
  "authors/fetchBySlug",
  async (identifier, { rejectWithValue }) => {
    try {
      const response = await api.get(`/authors/${identifier}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "خطایی در دریافت نویسنده رخ داده است!");
    }
  }
);

//   ایجاد `Slice` مدیریت نویسندگان
const authorsSlice = createSlice({
  name: "authors",
  initialState: {
    authors: { authors: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } },
    selectedAuthor: null,
    loading: false,
    error: null,
    success: false,
    totalPages: 0,
    currentPage: 1,
    total: 0,
  },
  reducers: {
    resetStatus: (state) => {
      state.selectedAuthor = null;
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
      //   مدیریت `POST` - ایجاد نویسنده
      .addCase(createAuthor.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createAuthor.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // اگر authors یک آرایه باشد
        if (Array.isArray(state.authors.authors)) {
          state.authors.authors.unshift(action.payload.data);
        }
      })
      .addCase(createAuthor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.success = false;
      })

      //   مدیریت `PATCH` - ویرایش نویسنده
      .addCase(updateAuthor.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateAuthor.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAuthor = action.payload.data;
        state.success = true;

        // بروزرسانی نویسنده در لیست نویسندگان
        if (Array.isArray(state.authors.authors)) {
          const index = state.authors.authors.findIndex(
            (author) => author._id === action.payload.data._id
          );
          if (index !== -1) {
            state.authors.authors[index] = action.payload.data;
          }
        }
      })
      .addCase(updateAuthor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.success = false;
      })

      //   مدیریت `DELETE` - حذف نویسنده
      .addCase(deleteAuthor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAuthor.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        // حذف نویسنده از لیست نویسندگان
        if (Array.isArray(state.authors.authors)) {
          state.authors.authors = state.authors.authors.filter(
            (author) => author.slug !== action.payload
          );
        }
      })
      .addCase(deleteAuthor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.success = false;
      })

      //   مدیریت `GET` - دریافت لیست نویسندگان
      .addCase(fetchAuthors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuthors.fulfilled, (state, action) => {
        state.loading = false;
        state.authors = action.payload;
        state.totalPages = action.payload.pagination?.totalPages || 1;
        state.currentPage = action.payload.pagination?.page || 1;
        state.total = action.payload.pagination?.total || 0;
      })
      .addCase(fetchAuthors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      //   مدیریت `GET` - دریافت یک نویسنده
      .addCase(fetchAuthorBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedAuthor = null;
      })
      .addCase(fetchAuthorBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAuthor = action.payload.data;
      })
      .addCase(fetchAuthorBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { resetStatus } = authorsSlice.actions;
export default authorsSlice.reducer;
