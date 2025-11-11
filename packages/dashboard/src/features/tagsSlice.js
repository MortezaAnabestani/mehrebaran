import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

//  1. `POST` ایجاد برچسب جدید
export const createTag = createAsyncThunk("tags/create", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.post("/tags", formData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در ایجاد برچسب رخ داده است!");
  }
});

//  2. `PATCH` ویرایش برچسب
export const updateTag = createAsyncThunk("tags/update", async ({ id, formData }, { rejectWithValue }) => {
  try {
    const response = await api.patch(`/tags/${id}`, formData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در ویرایش برچسب رخ داده است!");
  }
});

//  3. `DELETE` حذف برچسب
export const deleteTag = createAsyncThunk("tags/delete", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/tags/${id}`);
    console.log("حذف شما با موفقیت انجام شد");
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در حذف برچسب رخ داده است!");
  }
});

//  4. `GET` دریافت لیست برچسب‌ها
export const fetchTags = createAsyncThunk("tags/fetch", async (params = {}, { rejectWithValue }) => {
  try {
    const response = await api.get("/tags", { params });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در دریافت برچسب‌ها رخ داده است!");
  }
});

export const fetchTagById = createAsyncThunk("tags/fetchById", async (id, { rejectWithValue }) => {
  try {
    const response = await api.get(`/tags/${id}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در دریافت برچسب رخ داده است!");
  }
});

//  ایجاد `Slice` مدیریت نویسندگان
const tagsSlice = createSlice({
  name: "tags",
  initialState: {
    tags: [],
    selectedTag: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetStatus: (state) => {
      state.selectedTag = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //  مدیریت `POST` - ایجاد برچسب
      .addCase(createTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTag.fulfilled, (state, action) => {
        state.loading = false;
        // اگر tags یک آرایه باشد
        if (Array.isArray(state.tags)) {
          state.tags.push(action.payload.data);
        }
      })
      .addCase(createTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      //  مدیریت `PATCH` - ویرایش برچسب
      .addCase(updateTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTag.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTag = action.payload.data;

        // بروزرسانی برچسب در لیست برچسب‌ها
        if (Array.isArray(state.tags)) {
          const index = state.tags.findIndex(
            (tag) => tag._id === action.payload.data._id
          );
          if (index !== -1) {
            state.tags[index] = action.payload.data;
          }
        }
      })
      .addCase(updateTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      //  مدیریت `DELETE` - حذف برچسب
      .addCase(deleteTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTag.fulfilled, (state, action) => {
        state.loading = false;

        // حذف برچسب از لیست برچسب‌ها
        if (Array.isArray(state.tags)) {
          state.tags = state.tags.filter(
            (tag) => tag._id !== action.payload
          );
        }
      })
      .addCase(deleteTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      //  مدیریت `GET` - دریافت لیست برچسب‌ها
      .addCase(fetchTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = action.payload.data || action.payload;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      //  مدیریت `GET` - دریافت یک برچسب
      .addCase(fetchTagById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedTag = null;
      })
      .addCase(fetchTagById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTag = action.payload.data;
      })
      .addCase(fetchTagById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { resetStatus } = tagsSlice.actions;
export default tagsSlice.reducer;
