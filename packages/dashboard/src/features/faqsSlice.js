import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

//   1. `POST` ایجاد پرسشاپاسخ جدید
export const createFaq = createAsyncThunk("faqs/create", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.post("/faqs", formData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در ایجاد پرسشاپاسخ رخ داده است!");
  }
});

//   2. `PATCH` ویرایش پرسشاپاسخ
export const updateFaq = createAsyncThunk("faqs/update", async ({ id, formData }, { rejectWithValue }) => {
  try {
    const response = await api.patch(`/faqs/${id}`, formData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در ویرایش پرسشاپاسخ رخ داده است!");
  }
});

//   3. `DELETE` حذف پرسشاپاسخ
export const deleteFaq = createAsyncThunk("faqs/delete", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/faqs/${id}`);
    console.log("حذف شما با موفقیت انجام شد");
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در حذف پرسشاپاسخ رخ داده است!");
  }
});

//   4. `GET` دریافت لیست پرسش‌ها و پاسخ‌ها
export const fetchFaqs = createAsyncThunk("faqs/fetch", async (params = {}, { rejectWithValue }) => {
  try {
    const response = await api.get("/faqs", { params });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در دریافت پرسش‌ها و پاسخ‌ها رخ داده است!");
  }
});

export const fetchFaqById = createAsyncThunk("faqs/fetchById", async (id, { rejectWithValue }) => {
  try {
    const response = await api.get(`/faqs/${id}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در دریافت پرسشاپاسخ رخ داده است!");
  }
});

//   ایجاد `Slice` مدیریت نویسندگان
const faqsSlice = createSlice({
  name: "faqs",
  initialState: {
    faqs: [],
    selectedFaq: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetStatus: (state) => {
      state.selectedFaq = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //   مدیریت `POST` - ایجاد پرسشاپاسخ
      .addCase(createFaq.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFaq.fulfilled, (state, action) => {
        state.loading = false;
        // اگر faqs یک آرایه باشد
        if (Array.isArray(state.faqs)) {
          state.faqs.push(action.payload.data);
        }
      })
      .addCase(createFaq.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      //   مدیریت `PATCH` - ویرایش پرسشاپاسخ
      .addCase(updateFaq.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFaq.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedFaq = action.payload.data;

        // بروزرسانی پرسشاپاسخ در لیست پرسش‌ها و پاسخ‌ها
        if (Array.isArray(state.faqs)) {
          const index = state.faqs.findIndex(
            (faq) => faq._id === action.payload.data._id
          );
          if (index !== -1) {
            state.faqs[index] = action.payload.data;
          }
        }
      })
      .addCase(updateFaq.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      //   مدیریت `DELETE` - حذف پرسشاپاسخ
      .addCase(deleteFaq.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFaq.fulfilled, (state, action) => {
        state.loading = false;

        // حذف پرسشاپاسخ از لیست پرسش‌ها و پاسخ‌ها
        if (Array.isArray(state.faqs)) {
          state.faqs = state.faqs.filter(
            (faq) => faq._id !== action.payload
          );
        }
      })
      .addCase(deleteFaq.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      //   مدیریت `GET` - دریافت لیست پرسش‌ها و پاسخ‌ها
      .addCase(fetchFaqs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFaqs.fulfilled, (state, action) => {
        state.loading = false;
        state.faqs = action.payload.data || action.payload;
      })
      .addCase(fetchFaqs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      //   مدیریت `GET` - دریافت یک پرسشاپاسخ
      .addCase(fetchFaqById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedFaq = null;
      })
      .addCase(fetchFaqById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedFaq = action.payload.data;
      })
      .addCase(fetchFaqById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { resetStatus } = faqsSlice.actions;
export default faqsSlice.reducer;
