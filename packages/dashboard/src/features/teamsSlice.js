import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

//   1. `POST` ایجاد تیم جدید
export const createTeam = createAsyncThunk("teams/create", async ({ needId, teamData }, { rejectWithValue }) => {
  try {
    const response = await api.post(`/needs/${needId}/teams`, teamData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در ایجاد تیم رخ داده است!");
  }
});

//   2. `PATCH` ویرایش تیم
export const updateTeam = createAsyncThunk(
  "teams/update",
  async ({ needId, teamId, teamData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/needs/${needId}/teams/${teamId}`, teamData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "خطایی در ویرایش تیم رخ داده است!");
    }
  }
);

//   3. `DELETE` حذف تیم
export const deleteTeam = createAsyncThunk("teams/delete", async ({ needId, teamId }, { rejectWithValue }) => {
  try {
    await api.delete(`/needs/${needId}/teams/${teamId}`);
    console.log("حذف تیم با موفقیت انجام شد");
    return teamId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در حذف تیم رخ داده است!");
  }
});

//   4. `GET` دریافت لیست تیم‌های یک نیاز
export const fetchTeams = createAsyncThunk("teams/fetch", async (needId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/needs/${needId}/teams`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در دریافت تیم‌ها رخ داده است!");
  }
});

//   دریافت لیست تیم‌های کاربر
export const fetchMyTeams = createAsyncThunk("teams/fetchMyTeams", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/teams/my-teams");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "خطایی در دریافت تیم‌های شما رخ داده است!");
  }
});

//   دریافت جزئیات یک تیم
export const fetchTeamById = createAsyncThunk(
  "teams/fetchById",
  async ({ needId, teamId }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/needs/${needId}/teams/${teamId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "خطایی در دریافت تیم رخ داده است!");
    }
  }
);

//   دریافت آمار تیم
export const fetchTeamStats = createAsyncThunk(
  "teams/fetchStats",
  async ({ needId, teamId }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/needs/${needId}/teams/${teamId}/stats`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "خطایی در دریافت آمار تیم رخ داده است!");
    }
  }
);

//   اضافه کردن عضو به تیم
export const addMember = createAsyncThunk(
  "teams/addMember",
  async ({ needId, teamId, userId }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/needs/${needId}/teams/${teamId}/members`, { userId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "خطایی در افزودن عضو رخ داده است!");
    }
  }
);

//   حذف عضو از تیم
export const removeMember = createAsyncThunk(
  "teams/removeMember",
  async ({ needId, teamId, userId }, { rejectWithValue }) => {
    try {
      await api.delete(`/needs/${needId}/teams/${teamId}/members/${userId}`);
      return { teamId, userId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "خطایی در حذف عضو رخ داده است!");
    }
  }
);

//   تغییر نقش عضو
export const updateMemberRole = createAsyncThunk(
  "teams/updateMemberRole",
  async ({ needId, teamId, userId, role }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/needs/${needId}/teams/${teamId}/members/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "خطایی در تغییر نقش عضو رخ داده است!");
    }
  }
);

//   ارسال دعوت‌نامه
export const inviteUser = createAsyncThunk(
  "teams/inviteUser",
  async ({ needId, teamId, email }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/needs/${needId}/teams/${teamId}/invite`, { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "خطایی در ارسال دعوت‌نامه رخ داده است!");
    }
  }
);

//   ایجاد `Slice` مدیریت تیم‌ها
const teamsSlice = createSlice({
  name: "teams",
  initialState: {
    teams: [],
    myTeams: [],
    selectedTeam: null,
    teamStats: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetStatus: (state) => {
      state.selectedTeam = null;
      state.teamStats = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearTeams: (state) => {
      state.teams = [];
    },
  },
  extraReducers: (builder) => {
    builder
      //   مدیریت `POST` - ایجاد تیم
      .addCase(createTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        if (Array.isArray(state.teams)) {
          state.teams.unshift(action.payload.data);
        }
      })
      .addCase(createTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.success = false;
      })

      //   مدیریت `PATCH` - ویرایش تیم
      .addCase(updateTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTeam = action.payload.data;
        state.success = true;

        // بروزرسانی تیم در لیست تیم‌ها
        if (Array.isArray(state.teams)) {
          const index = state.teams.findIndex(
            (team) => team._id === action.payload.data._id
          );
          if (index !== -1) {
            state.teams[index] = action.payload.data;
          }
        }
      })
      .addCase(updateTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.success = false;
      })

      //   مدیریت `DELETE` - حذف تیم
      .addCase(deleteTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        // حذف تیم از لیست تیم‌ها
        if (Array.isArray(state.teams)) {
          state.teams = state.teams.filter(
            (team) => team._id !== action.payload
          );
        }
      })
      .addCase(deleteTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.success = false;
      })

      //   مدیریت `GET` - دریافت لیست تیم‌ها
      .addCase(fetchTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = action.payload.data || action.payload;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      //   مدیریت `GET` - دریافت تیم‌های من
      .addCase(fetchMyTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.myTeams = action.payload.data || action.payload;
      })
      .addCase(fetchMyTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      //   مدیریت `GET` - دریافت یک تیم
      .addCase(fetchTeamById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedTeam = null;
      })
      .addCase(fetchTeamById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTeam = action.payload.data;
      })
      .addCase(fetchTeamById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      //   مدیریت آمار تیم
      .addCase(fetchTeamStats.fulfilled, (state, action) => {
        state.teamStats = action.payload.data;
      })

      //   مدیریت اضافه کردن عضو
      .addCase(addMember.fulfilled, (state, action) => {
        state.success = true;
        if (state.selectedTeam) {
          state.selectedTeam = action.payload.data;
        }
      })

      //   مدیریت حذف عضو
      .addCase(removeMember.fulfilled, (state, action) => {
        state.success = true;
        if (state.selectedTeam) {
          state.selectedTeam.members = state.selectedTeam.members.filter(
            (member) => member.user._id !== action.payload.userId
          );
        }
      })

      //   مدیریت تغییر نقش عضو
      .addCase(updateMemberRole.fulfilled, (state, action) => {
        state.success = true;
        if (state.selectedTeam) {
          state.selectedTeam = action.payload.data;
        }
      })

      //   مدیریت ارسال دعوت‌نامه
      .addCase(inviteUser.fulfilled, (state) => {
        state.success = true;
      });
  },
});

export const { resetStatus, clearTeams } = teamsSlice.actions;
export default teamsSlice.reducer;
