
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


const socketSlice = createSlice({
  name: 'sockety',
  initialState: {
     socket:null,
     onlineUsers: null
   
  },
  reducers: {
    setSocket:(state,action)=>{
        state.socket = action.payload
    },
      setOnlineUsers:(state,action)=>{
        state.onlineUsers = action.payload
    },
    
  },
  extraReducers: (builder) => {
    // No extra reducers needed since loginUser thunk is removed
  }
});

export const { setSocket,setOnlineUsers} = socketSlice.actions;
export default socketSlice.reducer;
