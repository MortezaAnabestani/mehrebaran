import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_PUBLIC_API_URL;

//   1. `POST` ایجاد ادمین جدید
export const createAdmin = createAsyncThunk("admins/create", async (formData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}/admins/create`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "خطایی رخ داده است!");
  }
});

//   2. `PUT` ویرایش ادمین
export const updateAdmin = createAsyncThunk(
  "admins/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/admins/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("successfully!", response?.data);

      return response?.data;
    } catch (error) {
      console.log("rejected!", error.response?.data?.error);
      return rejectWithValue(error.response?.data?.error || "ویرایش ادمین انجام نشد!");
    }
  }
);

//   3. `DELETE` حذف ادمین
export const deleteAdmin = createAsyncThunk("admins/delete", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${BASE_URL}/admins/${id}`);
    console.log("حذف شما با موفقیت انجام شد");
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "حذف ادمین انجام نشد!");
  }
});

//   4. `GET` دریافت لیست ادمین‌ها
export const fetchAdmins = createAsyncThunk("admins/fetch", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/admins/all`);
    return response?.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "بارگیری ادمین‌ها انجام نشد!");
  }
});

export const fetchAdminById = createAsyncThunk("admins/fetchById", async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/admins/one/${id}`);
    return response?.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "بارگیری ادمین انجام نشد!");
  }
});

//   ایجاد `Slice` مدیریت ادمین‌ها
const adminsSlice = createSlice({
  name: "admins",
  initialState: {
    admins: [],
    selectedAdmin: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetStatus: (state) => {
      state.selectedAdmin = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //   مدیریت `POST`
      .addCase(createAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admins.push(action.payload);
      })
      .addCase(createAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //   مدیریت `PUT`
      .addCase(updateAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAdmin = action.payload;
      })
      .addCase(updateAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //   مدیریت `DELETE`
      .addCase(deleteAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admins = state.admins.filter((admin) => admin._id !== action.payload);
      })
      .addCase(deleteAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //   مدیریت `GET`
      .addCase(fetchAdmins.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdmins.fulfilled, (state, action) => {
        state.loading = false;
        state.admins = action.payload;
      })
      .addCase(fetchAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //   مدیریت `GET` برای یک ادمین
      .addCase(fetchAdminById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAdmin = action.payload;
      })
      .addCase(fetchAdminById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetStatus } = adminsSlice.actions;
export default adminsSlice.reducer;
