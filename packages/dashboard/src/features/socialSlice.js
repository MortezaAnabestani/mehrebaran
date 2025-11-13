import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

// ==================== FOLLOW ACTIONS ====================

// Follow user
export const followUser = createAsyncThunk(
  "social/followUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/social/follow/user/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در دنبال کردن کاربر رخ داده است!"
      );
    }
  }
);

// Unfollow user
export const unfollowUser = createAsyncThunk(
  "social/unfollowUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/social/follow/user/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در لغو دنبال کردن کاربر رخ داده است!"
      );
    }
  }
);

// Follow need
export const followNeed = createAsyncThunk(
  "social/followNeed",
  async (needId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/social/follow/need/${needId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در دنبال کردن نیاز رخ داده است!"
      );
    }
  }
);

// Unfollow need
export const unfollowNeed = createAsyncThunk(
  "social/unfollowNeed",
  async (needId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/social/follow/need/${needId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در لغو دنبال کردن نیاز رخ داده است!"
      );
    }
  }
);

// Get user followers
export const getUserFollowers = createAsyncThunk(
  "social/getUserFollowers",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/social/users/${userId}/followers`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در دریافت دنبال‌کنندگان رخ داده است!"
      );
    }
  }
);

// Get user following
export const getUserFollowing = createAsyncThunk(
  "social/getUserFollowing",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/social/users/${userId}/following`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در دریافت دنبال شونده‌ها رخ داده است!"
      );
    }
  }
);

// Get user follow stats
export const getUserFollowStats = createAsyncThunk(
  "social/getUserFollowStats",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/social/users/${userId}/follow-stats`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در دریافت آمار دنبال‌کنندگان رخ داده است!"
      );
    }
  }
);

// Get my followed needs
export const getMyFollowedNeeds = createAsyncThunk(
  "social/getMyFollowedNeeds",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/social/my-followed-needs");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در دریافت نیازهای دنبال شده رخ داده است!"
      );
    }
  }
);

// Get need followers
export const getNeedFollowers = createAsyncThunk(
  "social/getNeedFollowers",
  async (needId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/social/needs/${needId}/followers`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در دریافت دنبال‌کنندگان نیاز رخ داده است!"
      );
    }
  }
);

// Get suggested users
export const getSuggestedUsers = createAsyncThunk(
  "social/getSuggestedUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/social/follow/suggestions");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در دریافت پیشنهادات رخ داده است!"
      );
    }
  }
);

// ==================== MENTIONS ACTIONS ====================

// Get user mentions
export const getUserMentions = createAsyncThunk(
  "social/getUserMentions",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/social/mentions/me", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در دریافت منشن‌ها رخ داده است!"
      );
    }
  }
);

// Get unread mention count
export const getUnreadMentionCount = createAsyncThunk(
  "social/getUnreadMentionCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/social/mentions/unread-count");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در دریافت تعداد منشن‌های خوانده نشده رخ داده است!"
      );
    }
  }
);

// Mark mention as read
export const markMentionAsRead = createAsyncThunk(
  "social/markMentionAsRead",
  async (mentionId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/social/mentions/${mentionId}/read`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در علامت‌گذاری منشن به عنوان خوانده شده رخ داده است!"
      );
    }
  }
);

// Mark all mentions as read
export const markAllMentionsAsRead = createAsyncThunk(
  "social/markAllMentionsAsRead",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/social/mentions/read-all");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در علامت‌گذاری همه منشن‌ها به عنوان خوانده شده رخ داده است!"
      );
    }
  }
);

// ==================== TAGS ACTIONS ====================

// Get popular tags
export const getPopularTags = createAsyncThunk(
  "social/getPopularTags",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/social/tags/popular", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در دریافت تگ‌های محبوب رخ داده است!"
      );
    }
  }
);

// Get trending tags
export const getTrendingTags = createAsyncThunk(
  "social/getTrendingTags",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/social/tags/trending", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در دریافت تگ‌های ترند رخ داده است!"
      );
    }
  }
);

// Search tags
export const searchTags = createAsyncThunk(
  "social/searchTags",
  async (query, { rejectWithValue }) => {
    try {
      const response = await api.get("/social/tags/search", { params: { q: query } });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در جستجوی تگ‌ها رخ داده است!"
      );
    }
  }
);

// Get needs by tag
export const getNeedsByTag = createAsyncThunk(
  "social/getNeedsByTag",
  async (tag, { rejectWithValue }) => {
    try {
      const response = await api.get(`/social/tags/${tag}/needs`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در دریافت نیازهای با این تگ رخ داده است!"
      );
    }
  }
);

// ==================== SHARES ACTIONS ====================

// Log share
export const logShare = createAsyncThunk(
  "social/logShare",
  async (shareData, { rejectWithValue }) => {
    try {
      const response = await api.post("/social/share", shareData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در ثبت اشتراک‌گذاری رخ داده است!"
      );
    }
  }
);

// Get top shared items
export const getTopSharedItems = createAsyncThunk(
  "social/getTopSharedItems",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/social/share/top", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در دریافت محتوای محبوب رخ داده است!"
      );
    }
  }
);

// Get item share stats
export const getItemShareStats = createAsyncThunk(
  "social/getItemShareStats",
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/social/share/${itemId}/stats`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در دریافت آمار اشتراک‌گذاری رخ داده است!"
      );
    }
  }
);

const socialSlice = createSlice({
  name: "social",
  initialState: {
    // Follow
    followers: [],
    following: [],
    followStats: null,
    followedNeeds: [],
    needFollowers: [],
    suggestedUsers: [],

    // Mentions
    mentions: [],
    unreadMentionCount: 0,

    // Tags
    popularTags: [],
    trendingTags: [],
    tagResults: [],
    needsByTag: [],

    // Shares
    topSharedItems: [],
    shareStats: null,

    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Follow user
    builder
      .addCase(followUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(followUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(followUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get user followers
    builder
      .addCase(getUserFollowers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserFollowers.fulfilled, (state, action) => {
        state.loading = false;
        state.followers = action.payload.data || action.payload;
      })
      .addCase(getUserFollowers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get user following
    builder
      .addCase(getUserFollowing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserFollowing.fulfilled, (state, action) => {
        state.loading = false;
        state.following = action.payload.data || action.payload;
      })
      .addCase(getUserFollowing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get user follow stats
    builder
      .addCase(getUserFollowStats.fulfilled, (state, action) => {
        state.followStats = action.payload.data || action.payload;
      });

    // Get my followed needs
    builder
      .addCase(getMyFollowedNeeds.fulfilled, (state, action) => {
        state.followedNeeds = action.payload.data || action.payload;
      });

    // Get need followers
    builder
      .addCase(getNeedFollowers.fulfilled, (state, action) => {
        state.needFollowers = action.payload.data || action.payload;
      });

    // Get suggested users
    builder
      .addCase(getSuggestedUsers.fulfilled, (state, action) => {
        state.suggestedUsers = action.payload.data || action.payload;
      });

    // Get user mentions
    builder
      .addCase(getUserMentions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserMentions.fulfilled, (state, action) => {
        state.loading = false;
        state.mentions = action.payload.data || action.payload;
      })
      .addCase(getUserMentions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get unread mention count
    builder
      .addCase(getUnreadMentionCount.fulfilled, (state, action) => {
        state.unreadMentionCount = action.payload.count || 0;
      });

    // Mark mention as read
    builder
      .addCase(markMentionAsRead.fulfilled, (state, action) => {
        const mentionId = action.meta.arg;
        state.mentions = state.mentions.map((mention) =>
          mention._id === mentionId ? { ...mention, isRead: true } : mention
        );
        if (state.unreadMentionCount > 0) {
          state.unreadMentionCount -= 1;
        }
      });

    // Mark all mentions as read
    builder
      .addCase(markAllMentionsAsRead.fulfilled, (state) => {
        state.mentions = state.mentions.map((mention) => ({
          ...mention,
          isRead: true,
        }));
        state.unreadMentionCount = 0;
      });

    // Get popular tags
    builder
      .addCase(getPopularTags.fulfilled, (state, action) => {
        state.popularTags = action.payload.data || action.payload;
      });

    // Get trending tags
    builder
      .addCase(getTrendingTags.fulfilled, (state, action) => {
        state.trendingTags = action.payload.data || action.payload;
      });

    // Search tags
    builder
      .addCase(searchTags.fulfilled, (state, action) => {
        state.tagResults = action.payload.data || action.payload;
      });

    // Get needs by tag
    builder
      .addCase(getNeedsByTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNeedsByTag.fulfilled, (state, action) => {
        state.loading = false;
        state.needsByTag = action.payload.data || action.payload;
      })
      .addCase(getNeedsByTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get top shared items
    builder
      .addCase(getTopSharedItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTopSharedItems.fulfilled, (state, action) => {
        state.loading = false;
        state.topSharedItems = action.payload.data || action.payload;
      })
      .addCase(getTopSharedItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get item share stats
    builder
      .addCase(getItemShareStats.fulfilled, (state, action) => {
        state.shareStats = action.payload.data || action.payload;
      });
  },
});

export const { clearError } = socialSlice.actions;
export default socialSlice.reducer;
