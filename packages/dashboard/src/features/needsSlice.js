import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

//   1. `POST` ایجاد نیاز جدید
export const createNeed = createAsyncThunk("needs/create", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.post("/needs", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در ایجاد نیاز رخ داده است!");
  }
});

//   2. `PATCH` ویرایش نیاز
export const updateNeed = createAsyncThunk(
  "needs/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/needs/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "خطایی در ویرایش نیاز رخ داده است!");
    }
  }
);

//   3. `DELETE` حذف نیاز
export const deleteNeed = createAsyncThunk("needs/delete", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/needs/${id}`);
    console.log("حذف شما با موفقیت انجام شد");
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در حذف نیاز رخ داده است!");
  }
});

//   4. `GET` دریافت لیست نیازها
export const fetchNeeds = createAsyncThunk("needs/fetch", async (params = {}, { rejectWithValue }) => {
  try {
    const response = await api.get("/needs", { params });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در دریافت نیازها رخ داده است!");
  }
});

//   دریافت نیازهای پرطرفدار
export const fetchPopularNeeds = createAsyncThunk("needs/fetchPopular", async (params = {}, { rejectWithValue }) => {
  try {
    const response = await api.get("/needs/popular", { params });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در دریافت نیازهای پرطرفدار رخ داده است!");
  }
});

//   دریافت نیازهای ترندینگ
export const fetchTrendingNeeds = createAsyncThunk("needs/fetchTrending", async (params = {}, { rejectWithValue }) => {
  try {
    const response = await api.get("/needs/trending", { params });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در دریافت نیازهای ترند رخ داده است!");
  }
});

//   دریافت نیازهای فوری
export const fetchUrgentNeeds = createAsyncThunk("needs/fetchUrgent", async (params = {}, { rejectWithValue }) => {
  try {
    const response = await api.get("/needs/urgent", { params });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در دریافت نیازهای فوری رخ داده است!");
  }
});

//   دریافت یک نیاز
export const fetchNeedById = createAsyncThunk(
  "needs/fetchById",
  async (identifier, { rejectWithValue }) => {
    try {
      const response = await api.get(`/needs/${identifier}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "خطایی در دریافت نیاز رخ داده است!");
    }
  }
);

//   Upvote/Downvote نیاز
export const toggleUpvote = createAsyncThunk(
  "needs/toggleUpvote",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/needs/${id}/upvote`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "خطایی در ثبت رای رخ داده است!");
    }
  }
);

//   اضافه کردن حمایت‌کننده
export const addSupporter = createAsyncThunk(
  "needs/addSupporter",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/needs/${id}/support`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "خطایی در ثبت حمایت رخ داده است!");
    }
  }
);

//   ایجاد `Slice` مدیریت نیازها
const needsSlice = createSlice({
  name: "needs",
  initialState: {
    needs: [],
    selectedNeed: null,
    loading: false,
    error: null,
    success: false,
    totalPages: 0,
    currentPage: 1,
    total: 0,
  },
  reducers: {
    resetStatus: (state) => {
      state.selectedNeed = null;
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
      //   مدیریت `POST` - ایجاد نیاز
      .addCase(createNeed.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createNeed.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // اگر needs یک آرایه باشد
        if (Array.isArray(state.needs)) {
          state.needs.unshift(action.payload.data);
        }
      })
      .addCase(createNeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.success = false;
      })

      //   مدیریت `PATCH` - ویرایش نیاز
      .addCase(updateNeed.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateNeed.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedNeed = action.payload.data;
        state.success = true;

        // بروزرسانی نیاز در لیست نیازها
        if (Array.isArray(state.needs)) {
          const index = state.needs.findIndex(
            (need) => need._id === action.payload.data._id
          );
          if (index !== -1) {
            state.needs[index] = action.payload.data;
          }
        }
      })
      .addCase(updateNeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.success = false;
      })

      //   مدیریت `DELETE` - حذف نیاز
      .addCase(deleteNeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNeed.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        // حذف نیاز از لیست نیازها
        if (Array.isArray(state.needs)) {
          state.needs = state.needs.filter(
            (need) => need._id !== action.payload
          );
        }
      })
      .addCase(deleteNeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.success = false;
      })

      //   مدیریت `GET` - دریافت لیست نیازها
      .addCase(fetchNeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.needs = action.payload.data || action.payload;
        state.totalPages = action.payload.pagination?.totalPages || 1;
        state.currentPage = action.payload.pagination?.page || 1;
        state.total = action.payload.pagination?.total || 0;
      })
      .addCase(fetchNeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      //   مدیریت `GET` - دریافت نیازهای پرطرفدار
      .addCase(fetchPopularNeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPopularNeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.needs = action.payload.data || action.payload;
      })
      .addCase(fetchPopularNeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      //   مدیریت `GET` - دریافت نیازهای ترندینگ
      .addCase(fetchTrendingNeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrendingNeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.needs = action.payload.data || action.payload;
      })
      .addCase(fetchTrendingNeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      //   مدیریت `GET` - دریافت نیازهای فوری
      .addCase(fetchUrgentNeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUrgentNeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.needs = action.payload.data || action.payload;
      })
      .addCase(fetchUrgentNeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      //   مدیریت `GET` - دریافت یک نیاز
      .addCase(fetchNeedById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedNeed = null;
      })
      .addCase(fetchNeedById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedNeed = action.payload.data;
      })
      .addCase(fetchNeedById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      //   مدیریت Upvote
      .addCase(toggleUpvote.fulfilled, (state, action) => {
        if (state.selectedNeed && state.selectedNeed._id === action.payload.data._id) {
          state.selectedNeed = action.payload.data;
        }
        // بروزرسانی در لیست
        if (Array.isArray(state.needs)) {
          const index = state.needs.findIndex(
            (need) => need._id === action.payload.data._id
          );
          if (index !== -1) {
            state.needs[index] = action.payload.data;
          }
        }
      })

      //   مدیریت Add Supporter
      .addCase(addSupporter.fulfilled, (state, action) => {
        if (state.selectedNeed && state.selectedNeed._id === action.payload.data._id) {
          state.selectedNeed = action.payload.data;
        }
        // بروزرسانی در لیست
        if (Array.isArray(state.needs)) {
          const index = state.needs.findIndex(
            (need) => need._id === action.payload.data._id
          );
          if (index !== -1) {
            state.needs[index] = action.payload.data;
          }
        }
      });
  },
});

export const { resetStatus, setCurrentPage } = needsSlice.actions;
export default needsSlice.reducer;
