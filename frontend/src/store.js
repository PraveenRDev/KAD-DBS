import { configureStore } from '@reduxjs/toolkit'
import resultsSlice from './+store/resultsSlice'
import userSlice from './+store/userSlice'

export const store = configureStore({
	reducer: {
		user: userSlice,
		result: resultsSlice,
	},
})
