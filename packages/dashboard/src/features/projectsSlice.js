import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

// Fetch all projects
export const fetchProjects = createAsyncThunk(
  "projects/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/projects", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در دریافت پروژه‌ها رخ داده است!"
      );
    }
  }
);

// Fetch project by ID or slug
export const fetchProjectById = createAsyncThunk(
  "projects/fetchById",
  async (identifier, { rejectWithValue }) => {
    try {
      const response = await api.get(`/projects/${identifier}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در دریافت پروژه رخ داده است!"
      );
    }
  }
);

// Create new project
export const createProject = createAsyncThunk(
  "projects/create",
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await api.post("/projects", projectData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در ایجاد پروژه رخ داده است!"
      );
    }
  }
);

// Update project
export const updateProject = createAsyncThunk(
  "projects/update",
  async ({ id, projectData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/projects/${id}`, projectData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در ویرایش پروژه رخ داده است!"
      );
    }
  }
);

// Delete project
export const deleteProject = createAsyncThunk(
  "projects/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/projects/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در حذف پروژه رخ داده است!"
      );
    }
  }
);

// Increment project view
export const incrementProjectView = createAsyncThunk(
  "projects/incrementView",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/projects/${id}/increment-view`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "خطایی در افزایش بازدید رخ داده است!"
      );
    }
  }
);

const projectsSlice = createSlice({
  name: "projects",
  initialState: {
    projects: [],
    selectedProject: null,
    loading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedProject: (state) => {
      state.selectedProject = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all projects
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload.data || action.payload;
        state.totalPages = action.payload.totalPages || 1;
        state.currentPage = action.payload.currentPage || 1;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch project by ID
    builder
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProject = action.payload.data || action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create project
    builder
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.unshift(action.payload.data || action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update project
    builder
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProject = action.payload.data || action.payload;
        state.projects = state.projects.map((project) =>
          project._id === updatedProject._id ? updatedProject : project
        );
        state.selectedProject = updatedProject;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete project
    builder
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.filter(
          (project) => project._id !== action.payload
        );
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Increment view
    builder
      .addCase(incrementProjectView.fulfilled, (state, action) => {
        const updatedProject = action.payload.data || action.payload;
        if (state.selectedProject && state.selectedProject._id === updatedProject._id) {
          state.selectedProject = updatedProject;
        }
      });
  },
});

export const { clearError, clearSelectedProject } = projectsSlice.actions;
export default projectsSlice.reducer;
