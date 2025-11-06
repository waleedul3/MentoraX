import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// Async thunks
export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(params).toString();
  const response = await api.get(`/courses?${queryString}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchCourse = createAsyncThunk(
  'courses/fetchCourse',
  async (courseId, { rejectWithValue }) => {
    try {
  const response = await api.get(`/courses/${courseId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const enrollCourse = createAsyncThunk(
  'courses/enrollCourse',
  async (courseId, { rejectWithValue }) => {
    try {
  const response = await api.post(`/courses/${courseId}/enroll`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchEnrolledCourses = createAsyncThunk(
  'courses/fetchEnrolledCourses',
  async (_, { rejectWithValue }) => {
    try {
  const response = await api.get('/courses/enrolled');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const initialState = {
  courses: [],
  currentCourse: null,
  enrolledCourses: [],
  loading: false,
  error: null,
  pagination: null,
};

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentCourse: (state) => {
      state.currentCourse = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Courses
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        // support APIs that return either { data: [...] } or directly an array
        state.courses = action.payload.data || action.payload || [];
        state.pagination = (action.payload && action.payload.pagination) || null;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Single Course
      .addCase(fetchCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload.data || action.payload || null;
      })
      .addCase(fetchCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Enroll Course
      .addCase(enrollCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(enrollCourse.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(enrollCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Enrolled Courses
      .addCase(fetchEnrolledCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnrolledCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.enrolledCourses = action.payload.data;
      })
      .addCase(fetchEnrolledCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentCourse } = courseSlice.actions;
export default courseSlice.reducer;