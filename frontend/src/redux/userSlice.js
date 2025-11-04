// userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { serverUrl } from '../App';



const userSlice = createSlice({
  name: 'user',
  initialState: {
    userData: null,
    loading: false,
    error: null,
    suggestedUsers: null,
    profileData: null,
    following: [],
    searchData: [],
    notificationData:[]

  },
  reducers: {
    logout: (state) => {
      state.userData = null;
      state.error = null;
    },
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload;
    },
    setProfileData: (state, action) => {
      state.profileData = action.payload;
    },
    setSearchData:(state,action)=>{
     state.searchData = action.payload
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setNotificationData:(state,action)=>{
      state.notificationData = action.payload
    },
    setFollowing: (state,action) =>{
      state.following = action.payload
    },
    toggleFollow:(state,action)=>{
      const targetUserId = action.payload
      if(state.following.includes(targetUserId)){
        state.following = state.following.filter(id=>id!= targetUserId)
      }
      else{
        state.following.push(targetUserId)
      }
    }
  },
  extraReducers: (builder) => {
    // No extra reducers needed since loginUser thunk is removed
  }
});

export const { logout , setSuggestedUsers, setProfileData, setUserData,toggleFollow,setFollowing,setSearchData,setNotificationData} = userSlice.actions;
export default userSlice.reducer;
