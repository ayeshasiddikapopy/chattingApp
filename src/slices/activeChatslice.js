import { createSlice } from '@reduxjs/toolkit'

export const activerUserSlice = createSlice({
  name: 'activeChatUser',
  // initialState: {
  //  activeChatuser : {
  //   sendername: 'sendername',
  //   senderid: 'senderid',
  //   receivername:'receivername',
  //   receiverid:'receiverid',
  //   }
  // },
    initialState: {
      activeChatuser : localStorage.getItem("activeUser")
      ? JSON.parse(localStorage.getItem("activeUser"))
      : "",
  },
  reducers: {
    activeChatuser: (state, action) => {
      state.activeChatuser = action.payload   // dispatch(activeChatuser(payload))
    },
  }, 
})

export const { activeChatuser} = activerUserSlice.actions;

export default activerUserSlice.reducer;