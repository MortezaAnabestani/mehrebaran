import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

// 1. `GET` دریافت لیست داوطلبان با فیلترها
export const fetchVolunteers = createAsyncThunk(
  "volunteers/fetch",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { projectId, ...queryParams } = params;
      const url = projectId ? `/volunteers/project/${projectId}` : `/volunteers`;
      const response = await api.get(url, { params: queryParams });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "خطایی در دریافت داوطلبان رخ داده است!");
    }
  }
);

// 2. `GET` دریافت یک ثبت‌نام داوطلبانه با ID
export const fetchVolunteerById = createAsyncThunk(
  "volunteers/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/volunteers/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "خطایی در دریافت اطلاعات داوطلب رخ داده است!");
    }
  }
);

// 3. `PATCH` تایید داوطلب توسط ادمین
export const approveVolunteer = createAsyncThunk(
  "volunteers/approve",
  async ({ id, message }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/volunteers/${id}/approve`, { message });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "خطایی در تایید داوطلب رخ داده است!");
    }
  }
);

// 4. `PATCH` رد داوطلب توسط ادمین
export const rejectVolunteer = createAsyncThunk(
  "volunteers/reject",
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/volunteers/${id}/reject`, { reason });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "خطایی در رد داوطلب رخ داده است!");
    }
  }
);

// 5. `PATCH` بروزرسانی اطلاعات داوطلب
export const updateVolunteer = createAsyncThunk(
  "volunteers/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/volunteers/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "خطایی در بروزرسانی داوطلب رخ داده است!");
    }
  }
);

// 6. `GET` دریافت آمار داوطلبان یک پروژه
export const fetchVolunteerStats = createAsyncThunk(
  "volunteers/fetchStats",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/volunteers/project/${projectId}/stats`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "خطایی در دریافت آمار رخ داده است!");
    }
  }
);

// 7. `DELETE` حذف ثبت‌نام داوطلبانه
export const deleteVolunteer = createAsyncThunk(
  "volunteers/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/volunteers/${id}`);
      console.log("حذف داوطلب با موفقیت انجام شد");
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "خطایی در حذف داوطلب رخ داده است!");
    }
  }
);

// ایجاد `Slice` مدیریت داوطلبان
const volunteersSlice = createSlice({
  name: "volunteers",
  initialState: {
    volunteers: [],
    selectedVolunteer: null,
    stats: null,
    loading: false,
    error: null,
    success: false,
    totalPages: 0,
    currentPage: 1,
    total: 0,
  },
  reducers: {
    resetStatus: (state) => {
      state.selectedVolunteer = null;
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
      // مدیریت `GET` - دریافت لیست داوطلبان
      .addCase(fetchVolunteers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVolunteers.fulfilled, (state, action) => {
        state.loading = false;
        state.volunteers = action.payload.data || action.payload;
        state.totalPages = action.payload.pagination?.totalPages || 1;
        state.currentPage = action.payload.pagination?.page || 1;
        state.total = action.payload.pagination?.total || action.payload.results || 0;
      })
      .addCase(fetchVolunteers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // مدیریت `GET` - دریافت یک داوطلب
      .addCase(fetchVolunteerById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedVolunteer = null;
      })
      .addCase(fetchVolunteerById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedVolunteer = action.payload.data;
      })
      .addCase(fetchVolunteerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // مدیریت `PATCH` - تایید داوطلب
      .addCase(approveVolunteer.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(approveVolunteer.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.selectedVolunteer = action.payload.data;

        // بروزرسانی داوطلب در لیست
        if (Array.isArray(state.volunteers)) {
          const index = state.volunteers.findIndex((volunteer) => volunteer._id === action.payload.data._id);
          if (index !== -1) {
            state.volunteers[index] = action.payload.data;
          }
        }
      })
      .addCase(approveVolunteer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.success = false;
      })

      // مدیریت `PATCH` - رد داوطلب
      .addCase(rejectVolunteer.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(rejectVolunteer.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.selectedVolunteer = action.payload.data;

        // بروزرسانی داوطلب در لیست
        if (Array.isArray(state.volunteers)) {
          const index = state.volunteers.findIndex((volunteer) => volunteer._id === action.payload.data._id);
          if (index !== -1) {
            state.volunteers[index] = action.payload.data;
          }
        }
      })
      .addCase(rejectVolunteer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.success = false;
      })

      // مدیریت `PATCH` - بروزرسانی داوطلب
      .addCase(updateVolunteer.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateVolunteer.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedVolunteer = action.payload.data;
        state.success = true;

        // بروزرسانی داوطلب در لیست
        if (Array.isArray(state.volunteers)) {
          const index = state.volunteers.findIndex((volunteer) => volunteer._id === action.payload.data._id);
          if (index !== -1) {
            state.volunteers[index] = action.payload.data;
          }
        }
      })
      .addCase(updateVolunteer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.success = false;
      })

      // مدیریت `GET` - دریافت آمار
      .addCase(fetchVolunteerStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVolunteerStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data;
      })
      .addCase(fetchVolunteerStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // مدیریت `DELETE` - حذف داوطلب
      .addCase(deleteVolunteer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVolunteer.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        // حذف داوطلب از لیست
        if (Array.isArray(state.volunteers)) {
          state.volunteers = state.volunteers.filter((volunteer) => volunteer._id !== action.payload);
        }
      })
      .addCase(deleteVolunteer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.success = false;
      });
  },
});

export const { resetStatus, setCurrentPage } = volunteersSlice.actions;
export default volunteersSlice.reducer;
