import { useReducer, useEffect } from 'react'
import axios from 'axios'

const ACTIONS = {
	SELECT_FOLDER: 'select-folder',
	UPDATE_FOLDER: 'update-folder',
}

export const ROOT_FOLDER = { name: 'Root', id: null, path: [] }

function reducer(state, { type, payload }) {
	switch (type) {
		case ACTIONS.SELECT_FOLDER:
			return {
				loading: true,
				folderId: payload.folderId,
				folder: payload.folder,
				childFiles: [],
				childFolders: [],
			}
		case ACTIONS.UPDATE_FOLDER:
			return {
				...state,
				loading: false,
				folder: payload.folder,
				childFolders: payload.childFolders,
			}
		default:
			return state
	}
}

export function useFolder(folderId = null, folder = null) {
	const [state, dispatch] = useReducer(reducer, {
		loading: false,
		folderId,
		folder,
		childFolders: [],
		childFiles: [],
	})

	useEffect(() => {
		dispatch({ type: ACTIONS.SELECT_FOLDER, payload: { folderId, folder } })
	}, [folderId, folder])

	useEffect(() => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		}
		axios
			.get('/api/jobDirectory/' + folderId, config)
			.then((response) => {
				return dispatch({
					type: ACTIONS.UPDATE_FOLDER,
					payload: { folder: response.data.folder, childFolders: response.data.childFolders },
				})
			})
			.catch((error) => {
				console.log('error: ', error)
			})
	}, [folderId])

	return state
}
