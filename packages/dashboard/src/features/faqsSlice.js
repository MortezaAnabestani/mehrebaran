import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_PUBLIC_API_URL;

//   1. `POST` ایجاد پرسشاپاسخ جدید
export const createFaq = createAsyncThunk("faqs/create", async (formData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}/faqs`, formData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "خطایی رخ داده است!");
  }
});

//   2. `PUT` ویرایش پرسشاپاسخ
export const updateFaq = createAsyncThunk("faqs/update", async ({ id, formData }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${BASE_URL}/faqs/${id}`, formData, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("successfully!", response.data);

    return response.data;
  } catch (error) {
    console.log("rejected!", error.response?.data?.error);
    return rejectWithValue(error.response?.data?.error || "ویرایش پرسشاپاسخ انجام نشد!");
  }
});

//   3. `DELETE` حذف پرسشاپاسخ
export const deleteFaq = createAsyncThunk("faqs/delete", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${BASE_URL}/faqs/${id}`);
    console.log("حذف شما با موفقیت انجام شد");
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "حذف پرسشاپاسخ انجام نشد!");
  }
});

//   4. `GET` دریافت لیست نویسندگان
export const fetchFaqs = createAsyncThunk("faqs/fetch", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/faqs`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "بارگیری نویسندگان انجام نشد!");
  }
});

export const fetchFaqById = createAsyncThunk("faqs/fetchById", async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/faqs/${id}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "بارگیری پرسشاپاسخ انجام نشد!");
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
      //   مدیریت `POST`
      .addCase(createFaq.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFaq.fulfilled, (state, action) => {
        state.loading = false;
        state.faqs.push(action.payload);
      })
      .addCase(createFaq.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //   مدیریت `PUT`
      .addCase(updateFaq.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFaq.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedFaq = action.payload;
      })
      .addCase(updateFaq.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //   مدیریت `DELETE`
      .addCase(deleteFaq.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFaq.fulfilled, (state, action) => {
        state.loading = false;
        state.faqs = state.faqs.filter((faq) => faq._id !== action.payload);
      })
      .addCase(deleteFaq.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //   مدیریت `GET`
      .addCase(fetchFaqs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFaqs.fulfilled, (state, action) => {
        state.loading = false;
        state.faqs = action.payload;
      })
      .addCase(fetchFaqs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //   مدیریت `GET` برای یک پرسشاپاسخ
      .addCase(fetchFaqById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFaqById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedFaq = action.payload;
      })
      .addCase(fetchFaqById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetStatus } = faqsSlice.actions;
export default faqsSlice.reducer;
