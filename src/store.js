import { configureStore } from '@reduxjs/toolkit'
import userSlices from './slices/userSlices'
import activerUserSlice from './slices/activeChatslice'

export default configureStore({
  reducer: {
    userdata:userSlices,
    activeUser: activerUserSlice
  },
})