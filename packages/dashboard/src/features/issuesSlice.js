import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_PUBLIC_API_URL;

// 1. `POST` ایجاد شماره جدید
export const createIssue = createAsyncThunk("issues/create", async (formData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}/issues`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "خطایی رخ داده است!");
  }
});

//  2. `PUT` ویرایش شماره
export const updateIssue = createAsyncThunk(
  "issues/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/issues/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("successfully!", response.data);

      return response.data;
    } catch (error) {
      console.log("rejected!", error.response?.data?.error);
      return rejectWithValue(error.response?.data?.error || "ویرایش شماره انجام نشد!");
    }
  }
);

// 3. `DELETE` حذف شماره
export const deleteIssue = createAsyncThunk("issues/delete", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${BASE_URL}/issues/${id}`);
    console.log("حذف شما با موفقیت انجام شد");
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "حذف شماره انجام نشد!");
  }
});

//  4. `GET` دریافت لیست نویسندگان
export const fetchIssues = createAsyncThunk("issues/fetch", async (params = {}, { rejectWithValue }) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.title) queryParams.append("title", params.title);
    if (params.template) queryParams.append("template", params.template);
    if (params.issueNumber) queryParams.append("issueNumber", params.issueNumber);

    // افزودن پارامترهای صفحه‌بندی
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);

    // افزودن پارامترهای مرتب‌سازی
    if (params.sort) queryParams.append("sort", params.sort);

    const response = await axios.get(
      `${BASE_URL}/issues${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
    );
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "بارگیری نویسندگان انجام نشد!");
  }
});

export const fetchIssueById = createAsyncThunk("issues/fetchById", async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/issues/${id}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "بارگیری شماره انجام نشد!");
  }
});

// ایجاد `Slice` مدیریت نویسندگان
const issuesSlice = createSlice({
  name: "issues",
  initialState: {
    issues: [],
    selectedIssue: null,
    loading: false,
    error: null,
    totalPages: 0,
    currentPage: 1,
    total: 0,
  },
  reducers: {
    issueResetStatus: (state) => {
      state.selectedIssue = null;
      state.loading = false;
      state.error = null;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // مدیریت `POST`
      .addCase(createIssue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createIssue.fulfilled, (state, action) => {
        state.loading = false;
        state.issues.push(action.payload);
      })
      .addCase(createIssue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //  مدیریت `PUT`
      .addCase(updateIssue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateIssue.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedIssue = action.payload;
      })
      .addCase(updateIssue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //  مدیریت `DELETE`
      .addCase(deleteIssue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteIssue.fulfilled, (state, action) => {
        state.loading = false;
        state.issues = state.issues.filter((issue) => issue._id !== action.payload);
      })
      .addCase(deleteIssue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //  مدیریت `GET`
      .addCase(fetchIssues.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchIssues.fulfilled, (state, action) => {
        state.loading = false;
        state.issues = action.payload;
        state.totalPages = action.payload.totalPages || 1;
        state.currentPage = action.payload.page || 1;
        state.total = action.payload.total || 0;
      })
      .addCase(fetchIssues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //  مدیریت `GET` برای یک شماره
      .addCase(fetchIssueById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchIssueById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedIssue = action.payload;
      })
      .addCase(fetchIssueById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { issueResetStatus, setCurrentPage } = issuesSlice.actions;
export default issuesSlice.reducer;
