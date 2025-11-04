
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


const postSlice = createSlice({
  name: 'post',
  initialState: {
    postData: [],
  },
  reducers: {
    setPostData:(state,action)=>{
        state.postData = action.payload
    }
  },
  extraReducers: (builder) => {
    // No extra reducers needed since loginUser thunk is removed
  }
});

export const { setPostData} = postSlice.actions;
export default postSlice.reducer;
