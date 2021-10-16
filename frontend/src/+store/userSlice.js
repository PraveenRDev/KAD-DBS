import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	loading: false,
	error: null,
	details: null,
}

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		login: (state) => {
			state.loading = true
			state.error = null
		},
		loginSuccess: (state, action) => {
			state.loading = false
			state.details = action.payload
		},
		loginFailure: (state, action) => {
			state.loading = false
			state.error = action.payload
		},
		clearUser: (state) => {
			state.loading = false
			state.error = null
			state.details = null
		},
	},
})

export const { login, loginSuccess, loginFailure, clearUser } = userSlice.actions

export default userSlice.reducer
