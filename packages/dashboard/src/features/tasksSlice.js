import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

// ==================== Async Thunks ====================

// ایجاد task جدید
export const createTask = createAsyncThunk("tasks/create", async (data, { rejectWithValue }) => {
  try {
    const response = await api.post("/tasks", data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در ایجاد وظیفه رخ داده است!");
  }
});

// دریافت همه tasks
export const fetchTasks = createAsyncThunk("tasks/fetch", async (params = {}, { rejectWithValue }) => {
  try {
    const response = await api.get("/tasks", { params });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در دریافت وظایف رخ داده است!");
  }
});

// دریافت یک task بر اساس ID
export const fetchTaskById = createAsyncThunk("tasks/fetchById", async (id, { rejectWithValue }) => {
  try {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در دریافت وظیفه رخ داده است!");
  }
});

// دریافت tasks بر اساس محدوده تاریخ
export const fetchTasksByDateRange = createAsyncThunk(
  "tasks/fetchByDateRange",
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await api.get("/tasks/date-range", {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "خطایی در دریافت وظایف رخ داده است!");
    }
  }
);

// دریافت tasks امروز
export const fetchTodayTasks = createAsyncThunk("tasks/fetchToday", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/tasks/today");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در دریافت وظایف امروز رخ داده است!");
  }
});

// دریافت tasks سررسید گذشته
export const fetchOverdueTasks = createAsyncThunk("tasks/fetchOverdue", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/tasks/overdue");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در دریافت وظایف سررسید گذشته رخ داده است!");
  }
});

// دریافت آمار tasks
export const fetchTaskStats = createAsyncThunk("tasks/fetchStats", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/tasks/stats");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در دریافت آمار وظایف رخ داده است!");
  }
});

// به‌روزرسانی task
export const updateTask = createAsyncThunk("tasks/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.patch(`/tasks/${id}`, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در ویرایش وظیفه رخ داده است!");
  }
});

// حذف task
export const deleteTask = createAsyncThunk("tasks/delete", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/tasks/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در حذف وظیفه رخ داده است!");
  }
});

// ==================== Slice ====================

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    todayTasks: [],
    overdueTasks: [],
    calendarTasks: [], // tasks برای نمایش در تقویم
    selectedTask: null,
    stats: {
      total: 0,
      completed: 0,
      inProgress: 0,
      todo: 0,
      overdue: 0,
      cancelled: 0,
    },
    pagination: {
      total: 0,
      page: 1,
      limit: 50,
      pages: 0,
    },
    filters: {
      status: null,
      category: null,
      priority: null,
    },
    loading: false,
    error: null,
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        status: null,
        category: null,
        priority: null,
      };
    },
    setSelectedTask: (state, action) => {
      state.selectedTask = action.payload;
    },
    clearSelectedTask: (state) => {
      state.selectedTask = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Create Task
    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.unshift(action.payload.data);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Tasks
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.data || [];
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Task By ID
    builder
      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTask = action.payload.data;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Tasks By Date Range (برای تقویم)
    builder
      .addCase(fetchTasksByDateRange.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksByDateRange.fulfilled, (state, action) => {
        state.loading = false;
        state.calendarTasks = action.payload.data || [];
      })
      .addCase(fetchTasksByDateRange.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Today Tasks
    builder
      .addCase(fetchTodayTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodayTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.todayTasks = action.payload.data || [];
      })
      .addCase(fetchTodayTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Overdue Tasks
    builder
      .addCase(fetchOverdueTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOverdueTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.overdueTasks = action.payload.data || [];
      })
      .addCase(fetchOverdueTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Stats
    builder
      .addCase(fetchTaskStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data || state.stats;
      })
      .addCase(fetchTaskStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Task
    builder
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex((t) => t._id === action.payload.data._id);
        if (index !== -1) {
          state.tasks[index] = action.payload.data;
        }
        if (state.selectedTask?._id === action.payload.data._id) {
          state.selectedTask = action.payload.data;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete Task
    builder
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter((t) => t._id !== action.payload);
        if (state.selectedTask?._id === action.payload) {
          state.selectedTask = null;
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, setSelectedTask, clearSelectedTask, clearError } = tasksSlice.actions;

export default tasksSlice.reducer;
