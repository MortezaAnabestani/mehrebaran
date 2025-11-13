import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

// ==================== STORIES ====================

// ایجاد استوری جدید
export const createStory = createAsyncThunk("stories/create", async (storyData, { rejectWithValue }) => {
  try {
    const response = await api.post("/stories", storyData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در ایجاد استوری رخ داده است!");
  }
});

// دریافت فید استوری‌ها
export const fetchStoryFeed = createAsyncThunk("stories/fetchFeed", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/stories/feed");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در دریافت فید استوری‌ها رخ داده است!");
  }
});

// دریافت آمار استوری‌های کاربر
export const fetchStoryStats = createAsyncThunk("stories/fetchStats", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/stories/stats");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در دریافت آمار استوری‌ها رخ داده است!");
  }
});

// دریافت استوری‌های خودم
export const fetchMyStories = createAsyncThunk("stories/fetchMy", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/stories/my");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در دریافت استوری‌های شما رخ داده است!");
  }
});

// دریافت استوری‌های یک کاربر
export const fetchUserStories = createAsyncThunk("stories/fetchUserStories", async (userId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/stories/user/${userId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در دریافت استوری‌های کاربر رخ داده است!");
  }
});

// دریافت جزئیات استوری
export const fetchStoryById = createAsyncThunk("stories/fetchById", async (storyId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/stories/${storyId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در دریافت اطلاعات استوری رخ داده است!");
  }
});

// مشاهده استوری
export const viewStory = createAsyncThunk("stories/view", async ({ storyId, viewDuration }, { rejectWithValue }) => {
  try {
    const response = await api.post(`/stories/${storyId}/view`, { viewDuration });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در ثبت مشاهده استوری رخ داده است!");
  }
});

// افزودن ری‌اکشن
export const addReaction = createAsyncThunk("stories/addReaction", async ({ storyId, emoji }, { rejectWithValue }) => {
  try {
    const response = await api.post(`/stories/${storyId}/react`, { emoji });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در افزودن ری‌اکشن رخ داده است!");
  }
});

// حذف ری‌اکشن
export const removeReaction = createAsyncThunk("stories/removeReaction", async (storyId, { rejectWithValue }) => {
  try {
    const response = await api.delete(`/stories/${storyId}/react`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در حذف ری‌اکشن رخ داده است!");
  }
});

// حذف استوری
export const deleteStory = createAsyncThunk("stories/delete", async (storyId, { rejectWithValue }) => {
  try {
    const response = await api.delete(`/stories/${storyId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در حذف استوری رخ داده است!");
  }
});

// دریافت لیست بیننده‌ها
export const fetchViewers = createAsyncThunk("stories/fetchViewers", async (storyId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/stories/${storyId}/viewers`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در دریافت لیست بیننده‌ها رخ داده است!");
  }
});

// ==================== HIGHLIGHTS ====================

// ایجاد هایلایت
export const createHighlight = createAsyncThunk("stories/createHighlight", async (highlightData, { rejectWithValue }) => {
  try {
    const response = await api.post("/stories/highlights", highlightData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در ایجاد هایلایت رخ داده است!");
  }
});

// دریافت هایلایت‌های کاربر
export const fetchUserHighlights = createAsyncThunk("stories/fetchUserHighlights", async (userId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/stories/highlights/user/${userId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در دریافت هایلایت‌های کاربر رخ داده است!");
  }
});

// افزودن استوری به هایلایت
export const addStoryToHighlight = createAsyncThunk("stories/addStoryToHighlight", async ({ highlightId, storyId }, { rejectWithValue }) => {
  try {
    const response = await api.post(`/stories/highlights/${highlightId}/add-story`, { storyId });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در افزودن استوری به هایلایت رخ داده است!");
  }
});

// حذف استوری از هایلایت
export const removeStoryFromHighlight = createAsyncThunk("stories/removeStoryFromHighlight", async ({ highlightId, storyId }, { rejectWithValue }) => {
  try {
    const response = await api.delete(`/stories/highlights/${highlightId}/remove-story/${storyId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در حذف استوری از هایلایت رخ داده است!");
  }
});

// به‌روزرسانی هایلایت
export const updateHighlight = createAsyncThunk("stories/updateHighlight", async ({ highlightId, highlightData }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/stories/highlights/${highlightId}`, highlightData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در به‌روزرسانی هایلایت رخ داده است!");
  }
});

// حذف هایلایت
export const deleteHighlight = createAsyncThunk("stories/deleteHighlight", async (highlightId, { rejectWithValue }) => {
  try {
    const response = await api.delete(`/stories/highlights/${highlightId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در حذف هایلایت رخ داده است!");
  }
});

// ==================== SLICE ====================

const storiesSlice = createSlice({
  name: "stories",
  initialState: {
    storyFeed: [],
    myStories: [],
    userStories: [],
    selectedStory: null,
    storyViewers: [],
    storyStats: null,
    highlights: [],
    selectedHighlight: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedStory: (state) => {
      state.selectedStory = null;
    },
  },
  extraReducers: (builder) => {
    // Create Story
    builder
      .addCase(createStory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStory.fulfilled, (state, action) => {
        state.loading = false;
        state.myStories.unshift(action.payload.data);
      })
      .addCase(createStory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Story Feed
    builder
      .addCase(fetchStoryFeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStoryFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.storyFeed = action.payload.data;
      })
      .addCase(fetchStoryFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Story Stats
    builder
      .addCase(fetchStoryStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStoryStats.fulfilled, (state, action) => {
        state.loading = false;
        state.storyStats = action.payload.data;
      })
      .addCase(fetchStoryStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch My Stories
    builder
      .addCase(fetchMyStories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyStories.fulfilled, (state, action) => {
        state.loading = false;
        state.myStories = action.payload.data;
      })
      .addCase(fetchMyStories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch User Stories
    builder
      .addCase(fetchUserStories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserStories.fulfilled, (state, action) => {
        state.loading = false;
        state.userStories = action.payload.data;
      })
      .addCase(fetchUserStories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Story By ID
    builder
      .addCase(fetchStoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedStory = action.payload.data;
      })
      .addCase(fetchStoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete Story
    builder
      .addCase(deleteStory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStory.fulfilled, (state, action) => {
        state.loading = false;
        state.myStories = state.myStories.filter((story) => story._id !== action.meta.arg);
      })
      .addCase(deleteStory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Viewers
    builder
      .addCase(fetchViewers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchViewers.fulfilled, (state, action) => {
        state.loading = false;
        state.storyViewers = action.payload.data;
      })
      .addCase(fetchViewers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create Highlight
    builder
      .addCase(createHighlight.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHighlight.fulfilled, (state, action) => {
        state.loading = false;
        state.highlights.unshift(action.payload.data);
      })
      .addCase(createHighlight.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch User Highlights
    builder
      .addCase(fetchUserHighlights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserHighlights.fulfilled, (state, action) => {
        state.loading = false;
        state.highlights = action.payload.data;
      })
      .addCase(fetchUserHighlights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Highlight
    builder
      .addCase(updateHighlight.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHighlight.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.highlights.findIndex((h) => h._id === action.payload.data._id);
        if (index !== -1) {
          state.highlights[index] = action.payload.data;
        }
      })
      .addCase(updateHighlight.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete Highlight
    builder
      .addCase(deleteHighlight.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHighlight.fulfilled, (state, action) => {
        state.loading = false;
        state.highlights = state.highlights.filter((h) => h._id !== action.meta.arg);
      })
      .addCase(deleteHighlight.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSelectedStory } = storiesSlice.actions;
export default storiesSlice.reducer;
