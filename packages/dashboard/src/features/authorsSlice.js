import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_PUBLIC_API_URL;

//   1. `POST` ایجاد نویسنده جدید
export const createAuthor = createAsyncThunk("authors/create", async (formData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}/authors`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "خطایی رخ داده است!");
  }
});

//   2. `PUT` ویرایش نویسنده
export const updateAuthor = createAsyncThunk(
  "authors/update",
  async ({ slug, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/authors/${slug}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("successfully!", response.data);

      return response.data;
    } catch (error) {
      console.log("rejected!", error.response?.data?.error);
      return rejectWithValue(error.response?.data?.error || "ویرایش نویسنده انجام نشد!");
    }
  }
);

//   3. `DELETE` حذف نویسنده
export const deleteAuthor = createAsyncThunk("authors/delete", async (slug, { rejectWithValue }) => {
  try {
    await axios.delete(`${BASE_URL}/authors/${slug}`);
    console.log("حذف شما با موفقیت انجام شد");
    return slug;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "حذف نویسنده انجام نشد!");
  }
});

//   4. `GET` دریافت لیست نویسندگان
export const fetchAuthors = createAsyncThunk("authors/fetch", async (params = {}, { rejectWithValue }) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.name) queryParams.append("name", params.name);

    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);

    if (params.sort) queryParams.append("sort", params.sort);
    const response = await axios.get(
      `${BASE_URL}/authors${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
    );
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "بارگیری نویسندگان انجام نشد!");
  }
});

export const fetchAuthorBySlug = createAsyncThunk(
  "authors/fetchBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/authors/${slug}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "بارگیری نویسنده انجام نشد!");
    }
  }
);

//   ایجاد `Slice` مدیریت نویسندگان
const authorsSlice = createSlice({
  name: "authors",
  initialState: {
    authors: [],
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
      //   مدیریت `POST`
      .addCase(createAuthor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAuthor.fulfilled, (state, action) => {
        state.loading = false;
        state.authors.push(action.payload);
        state.success = true;
      })
      .addCase(createAuthor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //   مدیریت `PUT`
      .addCase(updateAuthor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAuthor.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAuthor = action.payload;
        state.success = true;
      })
      .addCase(updateAuthor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //   مدیریت `DELETE`
      .addCase(deleteAuthor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAuthor.fulfilled, (state, action) => {
        state.loading = false;
        state.authors = state.authors.filter((author) => author._id !== action.payload);
        state.success = true;
      })
      .addCase(deleteAuthor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //   مدیریت `GET`
      .addCase(fetchAuthors.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAuthors.fulfilled, (state, action) => {
        state.loading = false;
        state.authors = action.payload;
        state.totalPages = action.payload.totalPages || 1;
        state.currentPage = action.payload.page || 1;
        state.total = action.payload.total || 0;
        state.success = true;
      })
      .addCase(fetchAuthors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //   مدیریت `GET` برای یک نویسنده
      .addCase(fetchAuthorBySlug.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAuthorBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAuthor = action.payload;
      })
      .addCase(fetchAuthorBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetStatus } = authorsSlice.actions;
export default authorsSlice.reducer;
