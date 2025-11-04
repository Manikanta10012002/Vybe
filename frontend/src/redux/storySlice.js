// userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { serverUrl } from '../App';



const storySlice = createSlice({
  name: 'story',
  initialState: {
    storyData: null,
    storyList: [],
    currentUserStory: null
  },
  reducers: {
    setStoryData:(state,action)=>{
        state.storyData = action.payload
    },
     setStoryList:(state,action)=>{
        state.storyList = action.payload
    },
    setCurrentUserStory:(state,action)=>{
      state.currentUserStory = action.payload
    }
  },
  extraReducers: (builder) => {
    // No extra reducers needed since loginUser thunk is removed
  }
});

export const { setStoryData,setStoryList,setCurrentUserStory} = storySlice.actions;
export default storySlice.reducer;
