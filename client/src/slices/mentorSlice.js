import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchMentorOverview = createAsyncThunk(
  'mentor/fetchOverview',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/mentor/overview');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch overview');
    }
  }
);

const mentorSlice = createSlice({
  name: 'mentor',
  initialState: {
    overview: {
      totalCourses: 0,
      totalStudents: 0,
      avgRating: 0,
      monthlyEarnings: 0
    },
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMentorOverview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMentorOverview.fulfilled, (state, action) => {
        state.loading = false;
        state.overview = action.payload;
      })
      .addCase(fetchMentorOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default mentorSlice.reducer;