import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

// 1. `POST` ایجاد حوزه فعالیت جدید
export const createFocusArea = createAsyncThunk(
  "focusAreas/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("/focus-areas", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در ایجاد حوزه فعالیت رخ داده است!"
      );
    }
  }
);

// 2. `PATCH` ویرایش حوزه فعالیت
export const updateFocusArea = createAsyncThunk(
  "focusAreas/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/focus-areas/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در ویرایش حوزه فعالیت رخ داده است!"
      );
    }
  }
);

// 3. `DELETE` حذف حوزه فعالیت
export const deleteFocusArea = createAsyncThunk(
  "focusAreas/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/focus-areas/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در حذف حوزه فعالیت رخ داده است!"
      );
    }
  }
);

// 4. `GET` دریافت لیست حوزه‌های فعالیت
export const fetchFocusAreas = createAsyncThunk(
  "focusAreas/fetch",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/focus-areas", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در دریافت حوزه‌های فعالیت رخ داده است!"
      );
    }
  }
);

// 5. `GET` دریافت یک حوزه فعالیت با id
export const fetchFocusAreaById = createAsyncThunk(
  "focusAreas/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/focus-areas/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در دریافت حوزه فعالیت رخ داده است!"
      );
    }
  }
);

// 6. `PATCH` تغییر ترتیب حوزه‌های فعالیت
export const reorderFocusAreas = createAsyncThunk(
  "focusAreas/reorder",
  async (orders, { rejectWithValue }) => {
    try {
      const response = await api.patch("/focus-areas/reorder", { orders });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در تغییر ترتیب حوزه‌های فعالیت رخ داده است!"
      );
    }
  }
);

// 7. `PATCH` فعال/غیرفعال کردن حوزه فعالیت
export const toggleFocusAreaActive = createAsyncThunk(
  "focusAreas/toggleActive",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/focus-areas/${id}/toggle-active`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در تغییر وضعیت حوزه فعالیت رخ داده است!"
      );
    }
  }
);

// ایجاد `Slice` مدیریت حوزه‌های فعالیت
const focusAreasSlice = createSlice({
  name: "focusAreas",
  initialState: {
    focusAreas: [],
    selectedFocusArea: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetStatus: (state) => {
      state.selectedFocusArea = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // مدیریت `POST` - ایجاد حوزه فعالیت
      .addCase(createFocusArea.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createFocusArea.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        if (Array.isArray(state.focusAreas.data)) {
          state.focusAreas.data.unshift(action.payload.data);
        }
      })
      .addCase(createFocusArea.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.success = false;
      })

      // مدیریت `PATCH` - ویرایش حوزه فعالیت
      .addCase(updateFocusArea.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateFocusArea.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedFocusArea = action.payload.data;
        state.success = true;

        // بروزرسانی حوزه فعالیت در لیست
        if (Array.isArray(state.focusAreas.data)) {
          const index = state.focusAreas.data.findIndex(
            (item) => item._id === action.payload.data._id
          );
          if (index !== -1) {
            state.focusAreas.data[index] = action.payload.data;
          }
        }
      })
      .addCase(updateFocusArea.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.success = false;
      })

      // مدیریت `DELETE` - حذف حوزه فعالیت
      .addCase(deleteFocusArea.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFocusArea.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        // حذف حوزه فعالیت از لیست
        if (Array.isArray(state.focusAreas.data)) {
          state.focusAreas.data = state.focusAreas.data.filter(
            (item) => item._id !== action.payload
          );
        }
      })
      .addCase(deleteFocusArea.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.success = false;
      })

      // مدیریت `GET` - دریافت لیست حوزه‌های فعالیت
      .addCase(fetchFocusAreas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFocusAreas.fulfilled, (state, action) => {
        state.loading = false;
        state.focusAreas = action.payload;
      })
      .addCase(fetchFocusAreas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // مدیریت `GET` - دریافت یک حوزه فعالیت
      .addCase(fetchFocusAreaById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedFocusArea = null;
      })
      .addCase(fetchFocusAreaById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedFocusArea = action.payload.data;
      })
      .addCase(fetchFocusAreaById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // مدیریت `PATCH` - تغییر ترتیب
      .addCase(reorderFocusAreas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reorderFocusAreas.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(reorderFocusAreas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // مدیریت `PATCH` - فعال/غیرفعال کردن
      .addCase(toggleFocusAreaActive.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleFocusAreaActive.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        // بروزرسانی وضعیت در لیست
        if (Array.isArray(state.focusAreas.data)) {
          const index = state.focusAreas.data.findIndex(
            (item) => item._id === action.payload.data._id
          );
          if (index !== -1) {
            state.focusAreas.data[index] = action.payload.data;
          }
        }
      })
      .addCase(toggleFocusAreaActive.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { resetStatus } = focusAreasSlice.actions;
export default focusAreasSlice.reducer;
