import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

// Async thunks

// دریافت تنظیمات با کلید
export const getSettingByKey = createAsyncThunk("settings/getByKey", async (key, { rejectWithValue }) => {
  try {
    const response = await api.get(`/settings/${key}`);
    return { key, value: response.data.data };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در دریافت تنظیمات رخ داده است!");
  }
});

// به‌روزرسانی تنظیمات
export const updateSettingByKey = createAsyncThunk(
  "settings/updateByKey",
  async ({ key, value }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/settings/${key}`, { value });
      return { key, value: response.data.data.value };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "خطایی در به‌روزرسانی تنظیمات رخ داده است!");
    }
  }
);

// Initial state
const initialState = {
  settings: {
    homePageHero: null,
    blogBackground: null,
  },
  loading: false,
  error: null,
  successMessage: null,
};

// Slice
const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // Get setting by key
    builder
      .addCase(getSettingByKey.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSettingByKey.fulfilled, (state, action) => {
        state.loading = false;
        state.settings[action.payload.key] = action.payload.value;
      })
      .addCase(getSettingByKey.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update setting by key
    builder
      .addCase(updateSettingByKey.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateSettingByKey.fulfilled, (state, action) => {
        state.loading = false;
        state.settings[action.payload.key] = action.payload.value;
        state.successMessage = "تنظیمات با موفقیت به‌روزرسانی شد!";
      })
      .addCase(updateSettingByKey.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = settingsSlice.actions;
export default settingsSlice.reducer;
