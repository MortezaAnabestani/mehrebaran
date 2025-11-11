import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_PUBLIC_API_URL;

//  1. `POST` ایجاد برچسب جدید
export const createTag = createAsyncThunk("tags/create", async (formData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}/tags`, formData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "خطایی رخ داده است!");
  }
});

//  2. `PUT` ویرایش برچسب
export const updateTag = createAsyncThunk("tags/update", async ({ id, formData }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${BASE_URL}/tags/${id}`, formData, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("successfully!", response.data);

    return response.data;
  } catch (error) {
    console.log("rejected!", error.response?.data?.error);
    return rejectWithValue(error.response?.data?.error || "ویرایش برچسب انجام نشد!");
  }
});

//  3. `DELETE` حذف برچسب
export const deleteTag = createAsyncThunk("tags/delete", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${BASE_URL}/tags/${id}`);
    console.log("حذف شما با موفقیت انجام شد");
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "حذف برچسب انجام نشد!");
  }
});

//  4. `GET` دریافت لیست نویسندگان
export const fetchTags = createAsyncThunk("tags/fetch", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/tags`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "بارگیری نویسندگان انجام نشد!");
  }
});

export const fetchTagById = createAsyncThunk("tags/fetchById", async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/tags/${id}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "بارگیری برچسب انجام نشد!");
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
      //  مدیریت `POST`
      .addCase(createTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTag.fulfilled, (state, action) => {
        state.loading = false;
        state.tags.push(action.payload);
      })
      .addCase(createTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //  مدیریت `PUT`
      .addCase(updateTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTag.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTag = action.payload;
      })
      .addCase(updateTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //  مدیریت `DELETE`
      .addCase(deleteTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTag.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = state.tags.filter((tag) => tag._id !== action.payload);
      })
      .addCase(deleteTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //  مدیریت `GET`
      .addCase(fetchTags.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = action.payload;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //  مدیریت `GET` برای یک برچسب
      .addCase(fetchTagById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTagById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTag = action.payload;
      })
      .addCase(fetchTagById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetStatus } = tagsSlice.actions;
export default tagsSlice.reducer;
