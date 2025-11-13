import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

// ==================== BADGES ====================

// دریافت همه نشان‌ها
export const fetchBadges = createAsyncThunk("gamification/fetchBadges", async (params = {}, { rejectWithValue }) => {
  try {
    const response = await api.get("/gamification/badges", { params });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در دریافت نشان‌ها رخ داده است!");
  }
});

// دریافت نشان‌های کاربر
export const fetchMyBadges = createAsyncThunk("gamification/fetchMyBadges", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/gamification/badges/my-badges");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در دریافت نشان‌ها رخ داده است!");
  }
});

// دریافت نشان‌های یک کاربر خاص
export const fetchUserBadges = createAsyncThunk("gamification/fetchUserBadges", async (userId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/gamification/users/${userId}/badges`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در دریافت نشان‌های کاربر رخ داده است!");
  }
});

// دریافت جزئیات نشان
export const fetchBadgeById = createAsyncThunk("gamification/fetchBadgeById", async (badgeId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/gamification/badges/${badgeId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در دریافت اطلاعات نشان رخ داده است!");
  }
});

// ایجاد نشان جدید (admin only)
export const createBadge = createAsyncThunk("gamification/createBadge", async (badgeData, { rejectWithValue }) => {
  try {
    const response = await api.post("/gamification/badges", badgeData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در ایجاد نشان رخ داده است!");
  }
});

// ویرایش نشان (admin only)
export const updateBadge = createAsyncThunk("gamification/updateBadge", async ({ badgeId, badgeData }, { rejectWithValue }) => {
  try {
    const response = await api.patch(`/gamification/badges/${badgeId}`, badgeData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در ویرایش نشان رخ داده است!");
  }
});

// حذف نشان (admin only)
export const deleteBadge = createAsyncThunk("gamification/deleteBadge", async (badgeId, { rejectWithValue }) => {
  try {
    const response = await api.delete(`/gamification/badges/${badgeId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در حذف نشان رخ داده است!");
  }
});

// ==================== LEADERBOARD ====================

// دریافت جدول امتیازات
export const fetchLeaderboard = createAsyncThunk("gamification/fetchLeaderboard", async (params = {}, { rejectWithValue }) => {
  try {
    const response = await api.get("/gamification/leaderboard", { params });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در دریافت جدول امتیازات رخ داده است!");
  }
});

// دریافت جدول امتیازات با آمار تکمیلی
export const fetchEnhancedLeaderboard = createAsyncThunk("gamification/fetchEnhancedLeaderboard", async (params = {}, { rejectWithValue }) => {
  try {
    const response = await api.get("/gamification/leaderboard/enhanced", { params });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در دریافت جدول امتیازات رخ داده است!");
  }
});

// ==================== POINTS ====================

// دریافت خلاصه امتیازات کاربر
export const fetchPointSummary = createAsyncThunk("gamification/fetchPointSummary", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/gamification/points/my-summary");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در دریافت خلاصه امتیازات رخ داده است!");
  }
});

// دریافت تراکنش‌های امتیازات کاربر
export const fetchPointTransactions = createAsyncThunk("gamification/fetchPointTransactions", async (params = {}, { rejectWithValue }) => {
  try {
    const response = await api.get("/gamification/points/my-transactions", { params });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در دریافت تراکنش‌های امتیازات رخ داده است!");
  }
});

// دریافت تفکیک امتیازات
export const fetchPointsBreakdown = createAsyncThunk("gamification/fetchPointsBreakdown", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/gamification/points/my-breakdown");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در دریافت تفکیک امتیازات رخ داده است!");
  }
});

// دریافت پاداش روزانه
export const claimDailyBonus = createAsyncThunk("gamification/claimDailyBonus", async (_, { rejectWithValue }) => {
  try {
    const response = await api.post("/gamification/points/daily-bonus");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در دریافت پاداش روزانه رخ داده است!");
  }
});

// اهدای امتیاز (admin only)
export const awardPoints = createAsyncThunk("gamification/awardPoints", async (awardData, { rejectWithValue }) => {
  try {
    const response = await api.post("/gamification/points/award", awardData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در اهدای امتیاز رخ داده است!");
  }
});

// کسر امتیاز (admin only)
export const deductPoints = createAsyncThunk("gamification/deductPoints", async (deductData, { rejectWithValue }) => {
  try {
    const response = await api.post("/gamification/points/deduct", deductData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در کسر امتیاز رخ داده است!");
  }
});

// ==================== USER STATS ====================

// دریافت آمار کاربر
export const fetchUserStats = createAsyncThunk("gamification/fetchUserStats", async (userId, { rejectWithValue }) => {
  try {
    const url = userId ? `/gamification/stats/${userId}` : "/gamification/stats/me";
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در دریافت آمار کاربر رخ داده است!");
  }
});

// دریافت فعالیت‌های کاربر
export const fetchUserActivity = createAsyncThunk("gamification/fetchUserActivity", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/gamification/activity/me");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در دریافت فعالیت‌های کاربر رخ داده است!");
  }
});

// ==================== SLICE ====================

const gamificationSlice = createSlice({
  name: "gamification",
  initialState: {
    badges: [],
    myBadges: [],
    selectedBadge: null,
    leaderboard: [],
    pointSummary: null,
    pointTransactions: [],
    pointsBreakdown: null,
    userStats: null,
    userActivity: [],
    loading: false,
    error: null,
    totalPages: 0,
    total: 0,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Badges
    builder
      .addCase(fetchBadges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBadges.fulfilled, (state, action) => {
        state.loading = false;
        state.badges = action.payload.data;
        state.totalPages = action.payload.totalPages || 0;
        state.total = action.payload.total || 0;
      })
      .addCase(fetchBadges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch My Badges
    builder
      .addCase(fetchMyBadges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyBadges.fulfilled, (state, action) => {
        state.loading = false;
        state.myBadges = action.payload.data;
      })
      .addCase(fetchMyBadges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Badge By ID
    builder
      .addCase(fetchBadgeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBadgeById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBadge = action.payload.data;
      })
      .addCase(fetchBadgeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create Badge
    builder
      .addCase(createBadge.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBadge.fulfilled, (state, action) => {
        state.loading = false;
        state.badges.unshift(action.payload.data);
      })
      .addCase(createBadge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Badge
    builder
      .addCase(updateBadge.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBadge.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.badges.findIndex((badge) => badge._id === action.payload.data._id);
        if (index !== -1) {
          state.badges[index] = action.payload.data;
        }
        state.selectedBadge = action.payload.data;
      })
      .addCase(updateBadge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete Badge
    builder
      .addCase(deleteBadge.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBadge.fulfilled, (state, action) => {
        state.loading = false;
        state.badges = state.badges.filter((badge) => badge._id !== action.meta.arg);
      })
      .addCase(deleteBadge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Leaderboard
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        state.leaderboard = action.payload.data;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Enhanced Leaderboard
    builder
      .addCase(fetchEnhancedLeaderboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnhancedLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        state.leaderboard = action.payload.data;
      })
      .addCase(fetchEnhancedLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Point Summary
    builder
      .addCase(fetchPointSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPointSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.pointSummary = action.payload.data;
      })
      .addCase(fetchPointSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Point Transactions
    builder
      .addCase(fetchPointTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPointTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.pointTransactions = action.payload.data;
        state.totalPages = action.payload.totalPages || 0;
        state.total = action.payload.total || 0;
      })
      .addCase(fetchPointTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Points Breakdown
    builder
      .addCase(fetchPointsBreakdown.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPointsBreakdown.fulfilled, (state, action) => {
        state.loading = false;
        state.pointsBreakdown = action.payload.data;
      })
      .addCase(fetchPointsBreakdown.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch User Stats
    builder
      .addCase(fetchUserStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.loading = false;
        state.userStats = action.payload.data;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch User Activity
    builder
      .addCase(fetchUserActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.userActivity = action.payload.data;
      })
      .addCase(fetchUserActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = gamificationSlice.actions;
export default gamificationSlice.reducer;
