import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// Async thunks
export const fetchProgress = createAsyncThunk(
  'progress/fetchProgress',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/progress');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchCourseProgress = createAsyncThunk(
  'progress/fetchCourseProgress',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/progress/course/${courseId}`);
      return response.data;
    } catch (error) {
      // If progress not found (404), return empty data instead of rejecting
      if (error.response && error.response.status === 404) {
        return { data: null };
      }
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateLessonProgress = createAsyncThunk(
  'progress/updateLessonProgress',
  async ({ lessonId, courseId, watchTime }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/progress/lesson/${lessonId}`, {
        courseId,
        watchTime,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const initialState = {
  userProgress: [],
  currentCourseProgress: null,
  loading: false,
  error: null,
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentCourseProgress: (state) => {
      state.currentCourseProgress = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Progress
      .addCase(fetchProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.userProgress = action.payload.data;
      })
      .addCase(fetchProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Course Progress
      .addCase(fetchCourseProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourseProgress = action.payload.data;
      })
      .addCase(fetchCourseProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Lesson Progress
      .addCase(updateLessonProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLessonProgress.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentCourseProgress) {
          state.currentCourseProgress = action.payload.data.progress;
        }
      })
      .addCase(updateLessonProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentCourseProgress } = progressSlice.actions;
export default progressSlice.reducer;