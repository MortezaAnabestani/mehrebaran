import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

// ==================== NOTIFICATIONS ACTIONS ====================

// Get notifications
export const getNotifications = createAsyncThunk(
  "notifications/getAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/notifications", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در دریافت اعلانات رخ داده است!"
      );
    }
  }
);

// Get grouped notifications
export const getGroupedNotifications = createAsyncThunk(
  "notifications/getGrouped",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/notifications/grouped", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در دریافت اعلانات گروه‌بندی شده رخ داده است!"
      );
    }
  }
);

// Get unread count
export const getUnreadCount = createAsyncThunk(
  "notifications/getUnreadCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/notifications/unread-count");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در دریافت تعداد اعلانات خوانده نشده رخ داده است!"
      );
    }
  }
);

// Get stats
export const getNotificationStats = createAsyncThunk(
  "notifications/getStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/notifications/stats");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در دریافت آمار اعلانات رخ داده است!"
      );
    }
  }
);

// Mark as read
export const markAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در علامت‌گذاری اعلان رخ داده است!"
      );
    }
  }
);

// Mark all as read
export const markAllAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/notifications/mark-all-read");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در علامت‌گذاری همه اعلانات رخ داده است!"
      );
    }
  }
);

// Delete notification
export const deleteNotification = createAsyncThunk(
  "notifications/delete",
  async (notificationId, { rejectWithValue }) => {
    try {
      await api.delete(`/notifications/${notificationId}`);
      return notificationId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در حذف اعلان رخ داده است!"
      );
    }
  }
);

// Delete all read
export const deleteAllRead = createAsyncThunk(
  "notifications/deleteAllRead",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.delete("/notifications/read");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در حذف اعلانات خوانده شده رخ داده است!"
      );
    }
  }
);

// ==================== PREFERENCES ACTIONS ====================

// Get preferences
export const getPreferences = createAsyncThunk(
  "notifications/getPreferences",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/notifications/preferences");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در دریافت تنظیمات رخ داده است!"
      );
    }
  }
);

// Update preferences
export const updatePreferences = createAsyncThunk(
  "notifications/updatePreferences",
  async (preferences, { rejectWithValue }) => {
    try {
      const response = await api.put("/notifications/preferences", preferences);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در به‌روزرسانی تنظیمات رخ داده است!"
      );
    }
  }
);

// Toggle channel
export const toggleChannel = createAsyncThunk(
  "notifications/toggleChannel",
  async ({ channel, enabled }, { rejectWithValue }) => {
    try {
      const response = await api.post("/notifications/preferences/toggle-channel", {
        channel,
        enabled,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در تغییر وضعیت کانال رخ داده است!"
      );
    }
  }
);

// Mute type
export const muteType = createAsyncThunk(
  "notifications/muteType",
  async ({ type, mute }, { rejectWithValue }) => {
    try {
      const response = await api.post("/notifications/preferences/mute-type", {
        type,
        mute,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در تغییر وضعیت نوع اعلان رخ داده است!"
      );
    }
  }
);

// Toggle global mute
export const toggleGlobalMute = createAsyncThunk(
  "notifications/toggleGlobalMute",
  async (enabled, { rejectWithValue }) => {
    try {
      const response = await api.post("/notifications/preferences/global-mute", {
        enabled,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در تغییر وضعیت سکوت کلی رخ داده است!"
      );
    }
  }
);

// ==================== PUSH TOKENS ACTIONS ====================

// Register push token
export const registerPushToken = createAsyncThunk(
  "notifications/registerPushToken",
  async (tokenData, { rejectWithValue }) => {
    try {
      const response = await api.post("/notifications/push-token", tokenData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در ثبت توکن رخ داده است!"
      );
    }
  }
);

// Remove push token
export const removePushToken = createAsyncThunk(
  "notifications/removePushToken",
  async (token, { rejectWithValue }) => {
    try {
      await api.delete(`/notifications/push-token/${token}`);
      return token;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در حذف توکن رخ داده است!"
      );
    }
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
    groupedNotifications: [],
    unreadCount: 0,
    stats: null,
    preferences: null,

    // Admin states
    networkStats: null,
    allNotifications: [],
    pushTokenStats: null,
    allPushTokens: [],
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
    },

    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    incrementUnreadCount: (state) => {
      state.unreadCount += 1;
    },
    decrementUnreadCount: (state) => {
      if (state.unreadCount > 0) {
        state.unreadCount -= 1;
      }
    },
  },
  extraReducers: (builder) => {
    // Get notifications
    builder
      .addCase(getNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.data || action.payload;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get grouped notifications
    builder
      .addCase(getGroupedNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGroupedNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.groupedNotifications = action.payload.data || action.payload;
      })
      .addCase(getGroupedNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get unread count
    builder
      .addCase(getUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload.data?.count || action.payload.count || 0;
      });

    // Get stats
    builder
      .addCase(getNotificationStats.fulfilled, (state, action) => {
        state.stats = action.payload.data || action.payload;
      });

    // Mark as read
    builder
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notificationId = action.meta.arg;
        state.notifications = state.notifications.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true, readAt: new Date() }
            : notification
        );
        if (state.unreadCount > 0) {
          state.unreadCount -= 1;
        }
      });

    // Mark all as read
    builder
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map((notification) => ({
          ...notification,
          isRead: true,
          readAt: new Date(),
        }));
        state.unreadCount = 0;
      });

    // Delete notification
    builder
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const deletedId = action.payload;
        const deletedNotification = state.notifications.find(
          (n) => n._id === deletedId
        );
        state.notifications = state.notifications.filter(
          (notification) => notification._id !== deletedId
        );
        if (deletedNotification && !deletedNotification.isRead && state.unreadCount > 0) {
          state.unreadCount -= 1;
        }
      });

    // Delete all read
    builder
      .addCase(deleteAllRead.fulfilled, (state) => {
        state.notifications = state.notifications.filter(
          (notification) => !notification.isRead
        );
      });

    // Get preferences
    builder
      .addCase(getPreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.preferences = action.payload.data || action.payload;
      })
      .addCase(getPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update preferences
    builder
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.preferences = action.payload.data || action.payload;
      });

    // Toggle channel
    builder
      .addCase(toggleChannel.fulfilled, (state, action) => {
        state.preferences = action.payload.data || action.payload;
      });

    // Mute type
    builder
      .addCase(muteType.fulfilled, (state, action) => {
        state.preferences = action.payload.data || action.payload;
      });

    // Toggle global mute
    builder
      .addCase(toggleGlobalMute.fulfilled, (state, action) => {
        state.preferences = action.payload.data || action.payload;
      });

    // ==================== ADMIN REDUCERS ====================

    // Get network stats
    builder
      .addCase(getNetworkNotificationStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNetworkNotificationStats.fulfilled, (state, action) => {
        state.loading = false;
        state.networkStats = action.payload.data || action.payload;
      })
      .addCase(getNetworkNotificationStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get all notifications
    builder
      .addCase(getAllNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.allNotifications = action.payload.data || [];
        state.pagination = {
          page: action.payload.page || 1,
          limit: action.payload.limit || 20,
          total: action.payload.total || 0,
          totalPages: action.payload.totalPages || 0,
        };
      })
      .addCase(getAllNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get push token stats
    builder
      .addCase(getPushTokenStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPushTokenStats.fulfilled, (state, action) => {
        state.loading = false;
        state.pushTokenStats = action.payload.data || action.payload;
      })
      .addCase(getPushTokenStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get all push tokens
    builder
      .addCase(getAllPushTokens.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPushTokens.fulfilled, (state, action) => {
        state.loading = false;
        state.allPushTokens = action.payload.data || [];
        state.pagination = {
          page: action.payload.page || 1,
          limit: action.payload.limit || 20,
          total: action.payload.total || 0,
          totalPages: action.payload.totalPages || 0,
        };
      })
      .addCase(getAllPushTokens.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Cleanup old notifications
    builder
      .addCase(cleanupOldNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cleanupOldNotifications.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(cleanupOldNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ==================== ADMIN ACTIONS ====================

// Get network notification stats (Admin)
export const getNetworkNotificationStats = createAsyncThunk(
  "notifications/admin/getNetworkStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/notifications/admin/stats");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در دریافت آمار شبکه رخ داده است!"
      );
    }
  }
);

// Get all notifications (Admin)
export const getAllNotifications = createAsyncThunk(
  "notifications/admin/getAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/notifications/admin/all", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در دریافت لیست اعلانات رخ داده است!"
      );
    }
  }
);

// Get push token stats (Admin)
export const getPushTokenStats = createAsyncThunk(
  "notifications/admin/getPushTokenStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/notifications/admin/push-tokens/stats");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در دریافت آمار توکن‌ها رخ داده است!"
      );
    }
  }
);

// Get all push tokens (Admin)
export const getAllPushTokens = createAsyncThunk(
  "notifications/admin/getAllPushTokens",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/notifications/admin/push-tokens", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در دریافت لیست توکن‌ها رخ داده است!"
      );
    }
  }
);

// Cleanup old notifications (Admin)
export const cleanupOldNotifications = createAsyncThunk(
  "notifications/admin/cleanup",
  async (daysOld = 90, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/notifications/admin/cleanup?daysOld=${daysOld}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در پاکسازی اعلانات رخ داده است!"
      );
    }
  }
);

export const { clearError, incrementUnreadCount, decrementUnreadCount } = notificationsSlice.actions;
export default notificationsSlice.reducer;
