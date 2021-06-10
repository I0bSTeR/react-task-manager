import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
  },
  reducers: {
    saveToken: (state, action) => {
        state.token = action.payload
    },
    removeToken: (state) => {
        state.token = null
    }
  },
})

// Action creators are generated for each case reducer function
export const { saveToken, removeToken } = authSlice.actions

export default authSlice.reducer