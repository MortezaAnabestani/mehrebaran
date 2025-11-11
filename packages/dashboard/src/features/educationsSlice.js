import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_PUBLIC_API_URL;

// 1. `POST` ایجاد محتوای آموزشی جدید
export const createEducation = createAsyncThunk(
  "educations/create",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/educations`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "خطایی رخ داده است!");
    }
  }
);

// 2. `PUT` ویرایش محتوای آموزشی
export const updateEducation = createAsyncThunk(
  "educations/update",
  async ({ slug, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/educations/${slug}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("successfully!", response.data);

      return response.data;
    } catch (error) {
      console.log("rejected!", error.response?.data?.error);
      return rejectWithValue(error.response?.data?.error || "ویرایش محتوای آموزشی انجام نشد!");
    }
  }
);

// 3. `DELETE` حذف محتوای آموزشی
export const deleteEducation = createAsyncThunk("educations/delete", async (slug, { rejectWithValue }) => {
  try {
    await axios.delete(`${BASE_URL}/educations/${slug}`);
    console.log("حذف شما با موفقیت انجام شد");
    return slug;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "حذف محتوای آموزشی انجام نشد!");
  }
});

// 4. `GET` دریافت لیست محتواهای آموزشی
export const fetchEducations = createAsyncThunk("educations/fetch", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/educations`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "بارگیری محتواهای آموزشی انجام نشد!");
  }
});

export const fetchEducationBySlug = createAsyncThunk(
  "educations/fetchBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/educations/${slug}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "بارگیری محتوای آموزشی انجام نشد!");
    }
  }
);

// ایجاد `Slice` مدیریت محتواهای آموزشی
const educationsSlice = createSlice({
  name: "educations",
  initialState: {
    educations: [],
    selectedEducation: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetStatus: (state) => {
      state.selectedEducation = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // مدیریت `POST`
      .addCase(createEducation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEducation.fulfilled, (state, action) => {
        state.loading = false;
        state.educations.push(action.payload);
      })
      .addCase(createEducation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // مدیریت `PUT`
      .addCase(updateEducation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEducation.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEducation = action.payload;
      })
      .addCase(updateEducation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // مدیریت `DELETE`
      .addCase(deleteEducation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEducation.fulfilled, (state, action) => {
        state.loading = false;
        state.educations = state.educations.filter((education) => education._id !== action.payload);
      })
      .addCase(deleteEducation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // مدیریت `GET`
      .addCase(fetchEducations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEducations.fulfilled, (state, action) => {
        state.loading = false;
        state.educations = action.payload;
      })
      .addCase(fetchEducations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // مدیریت `GET` برای یک محتوای آموزشی
      .addCase(fetchEducationBySlug.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEducationBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEducation = action.payload;
      })
      .addCase(fetchEducationBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetStatus } = educationsSlice.actions;
export default educationsSlice.reducer;
