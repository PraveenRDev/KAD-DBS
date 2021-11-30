import express from 'express'
import {
	createNewFiles,
	createNewFolder,
	getFilesByFolder,
	getIndividualFileURL,
	getFilesUploadURLs,
	getFolderById,
	getJobsDirectory,
	deleteIndividualFile,
	deleteFolder,
	editAccessPermission,
} from '../controllers/jobDirectory.js'
const router = express.Router()
import { admin, protect } from '../middleware/authMiddleware.js'

// s3 upload
router.route('/getFilesUploadURLs').post(protect, getFilesUploadURLs)
router.route('/getIndividualFileURL').post(protect, getIndividualFileURL)

router.route('/').get(protect, getJobsDirectory).post(protect, createNewFolder)
router.route('/:folderId').get(protect, getFolderById).delete(protect, admin, deleteFolder).put(protect, admin, editAccessPermission)

router.route('/files').post(protect, createNewFiles)
router.route('/files/:folderId').get(protect, getFilesByFolder)
router.route('/deleteFile').post(protect, admin, deleteIndividualFile)

// deleteFolder
export default router
