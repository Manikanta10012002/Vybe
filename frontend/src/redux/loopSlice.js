// userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { serverUrl } from '../App';



const loopSlice = createSlice({
  name: 'loop',
  initialState: {
    loopData: [],
  },
  reducers: {
    setLoopData:(state,action)=>{
        state.loopData = action.payload
    }
  },
  extraReducers: (builder) => {
    // No extra reducers needed since loginUser thunk is removed
  }
});

export const { setLoopData} = loopSlice.actions;
export default loopSlice.reducer;
