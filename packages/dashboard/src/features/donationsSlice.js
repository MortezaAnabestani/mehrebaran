import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

// 1. `GET` دریافت لیست کمک‌های مالی با فیلترها
export const fetchDonations = createAsyncThunk(
  "donations/fetch",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { projectId, ...queryParams } = params;
      const url = projectId ? `/donations/project/${projectId}` : `/donations`;
      const response = await api.get(url, { params: queryParams });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "خطایی در دریافت کمک‌های مالی رخ داده است!");
    }
  }
);

// 2. `GET` دریافت یک کمک مالی با ID یا کد پیگیری
export const fetchDonationById = createAsyncThunk(
  "donations/fetchById",
  async (identifier, { rejectWithValue }) => {
    try {
      const response = await api.get(`/donations/${identifier}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "خطایی در دریافت کمک مالی رخ داده است!");
    }
  }
);

// 3. `PATCH` تایید رسید بانکی توسط ادمین
export const verifyBankTransfer = createAsyncThunk(
  "donations/verifyBankTransfer",
  async ({ donationId, approve, rejectionReason }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/donations/${donationId}/verify-bank-transfer`, {
        approve,
        rejectionReason,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "خطایی در تایید کمک مالی رخ داده است!");
    }
  }
);

// 4. `GET` دریافت آمار کمک‌های مالی یک پروژه
export const fetchDonationStats = createAsyncThunk(
  "donations/fetchStats",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/donations/project/${projectId}/stats`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "خطایی در دریافت آمار رخ داده است!");
    }
  }
);

// 5. `DELETE` حذف کمک مالی
export const deleteDonation = createAsyncThunk(
  "donations/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/donations/${id}`);
      console.log("حذف کمک مالی با موفقیت انجام شد");
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "خطایی در حذف کمک مالی رخ داده است!");
    }
  }
);

// ایجاد `Slice` مدیریت کمک‌های مالی
const donationsSlice = createSlice({
  name: "donations",
  initialState: {
    donations: [],
    selectedDonation: null,
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
      state.selectedDonation = null;
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
      // مدیریت `GET` - دریافت لیست کمک‌های مالی
      .addCase(fetchDonations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDonations.fulfilled, (state, action) => {
        state.loading = false;
        state.donations = action.payload.data || action.payload;
        state.totalPages = action.payload.pagination?.totalPages || 1;
        state.currentPage = action.payload.pagination?.page || 1;
        state.total = action.payload.pagination?.total || action.payload.results || 0;
      })
      .addCase(fetchDonations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // مدیریت `GET` - دریافت یک کمک مالی
      .addCase(fetchDonationById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedDonation = null;
      })
      .addCase(fetchDonationById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedDonation = action.payload.data;
      })
      .addCase(fetchDonationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // مدیریت `PATCH` - تایید رسید بانکی
      .addCase(verifyBankTransfer.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(verifyBankTransfer.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.selectedDonation = action.payload.data;

        // بروزرسانی کمک مالی در لیست
        if (Array.isArray(state.donations)) {
          const index = state.donations.findIndex((donation) => donation._id === action.payload.data._id);
          if (index !== -1) {
            state.donations[index] = action.payload.data;
          }
        }
      })
      .addCase(verifyBankTransfer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.success = false;
      })

      // مدیریت `GET` - دریافت آمار
      .addCase(fetchDonationStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDonationStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data;
      })
      .addCase(fetchDonationStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // مدیریت `DELETE` - حذف کمک مالی
      .addCase(deleteDonation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDonation.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        // حذف کمک مالی از لیست
        if (Array.isArray(state.donations)) {
          state.donations = state.donations.filter((donation) => donation._id !== action.payload);
        }
      })
      .addCase(deleteDonation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.success = false;
      });
  },
});

export const { resetStatus, setCurrentPage } = donationsSlice.actions;
export default donationsSlice.reducer;
