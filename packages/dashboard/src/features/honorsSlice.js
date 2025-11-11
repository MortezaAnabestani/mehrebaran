import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_PUBLIC_API_URL;

//   1. `POST` ایجاد افتخار جدید
export const createHonor = createAsyncThunk("honors/create", async (formData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}/honors`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "خطایی رخ داده است!");
  }
});

//   2. `PUT` ویرایش افتخار
export const updateHonor = createAsyncThunk(
  "honors/update",
  async ({ slug, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/honors/${slug}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("successfully!", response.data);

      return response.data;
    } catch (error) {
      console.log("rejected!", error.response?.data?.error);
      return rejectWithValue(error.response?.data?.error || "ویرایش افتخار انجام نشد!");
    }
  }
);

//   3. `DELETE` حذف افتخار
export const deleteHonor = createAsyncThunk("honors/delete", async (slug, { rejectWithValue }) => {
  try {
    await axios.delete(`${BASE_URL}/honors/${slug}`);
    console.log("حذف شما با موفقیت انجام شد");
    return slug;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "حذف افتخار انجام نشد!");
  }
});

//   4. `GET` دریافت لیست افتخارات
export const fetchHonors = createAsyncThunk("honors/fetch", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/honors`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "بارگیری افتخارات انجام نشد!");
  }
});

export const fetchHonorBySlug = createAsyncThunk("honors/fetchBySlug", async (slug, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/honors/${slug}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "بارگیری افتخار انجام نشد!");
  }
});

//   ایجاد `Slice` مدیریت افتخارات
const honorsSlice = createSlice({
  name: "honors",
  initialState: {
    honors: [],
    selectedHonor: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetStatus: (state) => {
      state.selectedHonor = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //   مدیریت `POST`
      .addCase(createHonor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHonor.fulfilled, (state, action) => {
        state.loading = false;
        state.honors.push(action.payload);
      })
      .addCase(createHonor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //   مدیریت `PUT`
      .addCase(updateHonor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHonor.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedHonor = action.payload;
      })
      .addCase(updateHonor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //   مدیریت `DELETE`
      .addCase(deleteHonor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHonor.fulfilled, (state, action) => {
        state.loading = false;
        state.honors = state.honors.filter((honor) => honor._id !== action.payload);
      })
      .addCase(deleteHonor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //   مدیریت `GET`
      .addCase(fetchHonors.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHonors.fulfilled, (state, action) => {
        state.loading = false;
        state.honors = action.payload;
      })
      .addCase(fetchHonors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //   مدیریت `GET` برای یک افتخار
      .addCase(fetchHonorBySlug.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHonorBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedHonor = action.payload;
      })
      .addCase(fetchHonorBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetStatus } = honorsSlice.actions;
export default honorsSlice.reducer;
