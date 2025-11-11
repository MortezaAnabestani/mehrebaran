import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_PUBLIC_API_URL;

//   1. `POST` ایجاد رویداد جدید
export const createEvent = createAsyncThunk("events/create", async (formData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}/events`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "خطایی رخ داده است!");
  }
});

//   2. `PUT` ویرایش رویداد
export const updateEvent = createAsyncThunk(
  "events/update",
  async ({ slug, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/events/${slug}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("successfully!", response.data);

      return response.data;
    } catch (error) {
      console.log("rejected!", error.response?.data?.error);
      return rejectWithValue(error.response?.data?.error || "ویرایش رویداد انجام نشد!");
    }
  }
);

//   3. `DELETE` حذف رویداد
export const deleteEvent = createAsyncThunk("events/delete", async (slug, { rejectWithValue }) => {
  try {
    await axios.delete(`${BASE_URL}/events/${slug}`);
    console.log("حذف شما با موفقیت انجام شد");
    return slug;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "حذف رویداد انجام نشد!");
  }
});

//   4. `GET` دریافت لیست رویدادها
export const fetchEvents = createAsyncThunk("events/fetch", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/events`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "بارگیری رویدادها انجام نشد!");
  }
});

export const fetchEventBySlug = createAsyncThunk("events/fetchBySlug", async (slug, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/events/${slug}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "بارگیری رویداد انجام نشد!");
  }
});

//   ایجاد `Slice` مدیریت رویدادها
const eventsSlice = createSlice({
  name: "events",
  initialState: {
    events: [],
    selectedEvent: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetStatus: (state) => {
      state.selectedEvent = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //   مدیریت `POST`
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.push(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //   مدیریت `PUT`
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEvent = action.payload;
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //   مدیریت `DELETE`
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = state.events.filter((event) => event._id !== action.payload);
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //   مدیریت `GET`
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //   مدیریت `GET` برای یک رویداد
      .addCase(fetchEventBySlug.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEventBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEvent = action.payload;
      })
      .addCase(fetchEventBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetStatus } = eventsSlice.actions;
export default eventsSlice.reducer;
