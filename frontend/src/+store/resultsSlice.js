import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	loading: false,
	error: null,
	details: null,
}

export const resultsSlice = createSlice({
	name: 'results',
	initialState,
	reducers: {
		fetchResults: (state) => {
			state.loading = true
			state.error = null
			state.details = null
		},
		fetchResultsSuccess: (state, action) => {
			state.loading = false
			state.details = action.payload
		},
		fetchResultsFailure: (state, action) => {
			state.loading = false
			state.error = action.payload
		},
		clearResults: (state, action) => {
			state.details = null
			state.loading = false
			state.error = null
		},
	},
})

export const { fetchResults, fetchResultsSuccess, fetchResultsFailure, clearResults } = resultsSlice.actions

export default resultsSlice.reducer
