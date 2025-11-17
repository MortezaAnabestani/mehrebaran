import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_PUBLIC_API_URL;

// Fetch all help requests
export const fetchHelpRequests = createAsyncThunk(
  "helpRequests/fetchAll",
  async ({ status, search, page = 1 } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (status) params.append("status", status);
      if (search) params.append("search", search);
      params.append("page", page);
      params.append("limit", "20");

      const response = await axios.get(`${BASE_URL}/help-requests?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update help request status
export const updateHelpRequestStatus = createAsyncThunk(
  "helpRequests/updateStatus",
  async ({ id, status, adminNotes }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/help-requests/${id}/status`,
        { status, adminNotes },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete help request
export const deleteHelpRequest = createAsyncThunk(
  "helpRequests/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/help-requests/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get stats
export const fetchHelpRequestStats = createAsyncThunk(
  "helpRequests/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/help-requests/stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const helpRequestsSlice = createSlice({
  name: "helpRequests",
  initialState: {
    helpRequests: [],
    stats: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      totalPages: 1,
      total: 0,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchHelpRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHelpRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.helpRequests = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchHelpRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update status
      .addCase(updateHelpRequestStatus.fulfilled, (state, action) => {
        const index = state.helpRequests.findIndex((hr) => hr._id === action.payload.data._id);
        if (index !== -1) {
          state.helpRequests[index] = action.payload.data;
        }
      })
      // Delete
      .addCase(deleteHelpRequest.fulfilled, (state, action) => {
        state.helpRequests = state.helpRequests.filter((hr) => hr._id !== action.payload);
      })
      // Stats
      .addCase(fetchHelpRequestStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export default helpRequestsSlice.reducer;
