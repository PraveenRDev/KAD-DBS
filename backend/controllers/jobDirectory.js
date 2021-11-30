import mongoose from 'mongoose'
import asyncHandler from 'express-async-handler'
import JobFile from '../models/jobFileModel.js'
import Job from '../models/jobModel.js'
import JobFolder from './../models/jobFolderModel.js'
import { generateGetURL, generateUploadURL, deleteObject } from './s3.js'

// @desc    Get all Directory by JobIds
// @route   POST /api/jobDirectory
// @access  private
export const getJobsDirectory = asyncHandler(async (req, res) => {
	const allFolders = await JobFolder.aggregate([
		{
			$match: { parentFolderId: null, accessPermission: req.user.isAdmin ? { $in: [1, 2] } : 2 },
		},
		{
			$project: {
				_id: 1,
				jobId: 1,
				name: 1,
			},
		},
		{
			$sort: { name: -1 },
		},
	])

	if (allFolders && allFolders.length > 0) {
		res.status(200).json(allFolders)
	} else {
		res.status(404)
		throw new Error('No any jobs Found')
	}
})

// @desc    Get all Directory by JobIds
// @route   POST /api/jobDirectory
// @access  private
// export const createCommonFolders = asyncHandler(async (req, res) => {
// 	const allJobs = await Job.find({}, { jobNumber: 1 }).sort({ jobNumber: 1 })

// 	if (allJobs && allJobs.length > 0) {
// 		await allJobs.forEach(async (job) => {
// 			const jobParentFolder = await JobFolder.create({
// 				jobId: job._id,
// 				name: job.jobNumber,
// 				parentFolderId: null,
// 				path: [],
// 				createdBy: '6168b8b52d59ec995c5038a5',
// 			})
// 			;['DRAWING', 'SEARCH', 'SURVEY DATA'].forEach(async (commonFolder) => {
// 				await JobFolder.create({
// 					jobId: job._id,
// 					name: commonFolder,
// 					parentFolderId: jobParentFolder._id,
// 					path: [{ folderName: job.jobNumber, folderId: jobParentFolder._id }],
// 					createdBy: '6168b8b52d59ec995c5038a5',
// 				})
// 			})
// 		})
// 		res.status(200).json(allJobs)
// 	} else {
// 		res.status(404)
// 		throw new Error('No any jobs Found')
// 	}
// })

// @desc    create new folder
// @route   POST /api/jobDirectory
// @access  private
export const createNewFolder = asyncHandler(async (req, res) => {
	const { jobId, name, parentFolderId, accessPermission, path = [] } = req.body

	const newFolder = await JobFolder.create({
		jobId,
		name: name.toUpperCase(),
		parentFolderId,
		path,
		accessPermission: !req.user.isAdmin ? 2 : accessPermission,
		createdBy: req.user._id || '',
	})

	if (newFolder) {
		res.status(200).json(newFolder)
	} else {
		res.status(401)
		throw new Error('Invalid folder data')
	}
})

// @desc    Access folder by id
// @route   GET /api/jobDirectory/128736
// @access  private
export const getFolderById = asyncHandler(async (req, res) => {
	const { folderId } = req.params

	if (folderId) {
		const folder = await JobFolder.findOne({ _id: folderId, accessPermission: req.user.isAdmin ? { $in: [1, 2] } : 2 })
		if (folder) {
			const childFolders = (await JobFolder.find({ parentFolderId: folderId, accessPermission: req.user.isAdmin ? { $in: [1, 2] } : 2 })) || []
			res.status(200).json({ folder, childFolders })
		} else {
			res.status(404)
			throw new Error('Folder not found')
		}
	} else {
		res.status(500)
		throw new Error('Internal Server Error')
	}
})

export const getFilesUploadURLs = asyncHandler(async (req, res) => {
	const { filePaths } = req.body
	if (filePaths && filePaths.length > 0) {
		const filePathPromises = await filePaths.map(async (path) => await generateUploadURL(path))
		const putURLS = await Promise.all(filePathPromises)

		if (putURLS) {
			res.status(200).json({ putURLS })
		} else {
			res.status(401)
			throw new Error('Error Occurred, please retry')
		}
	}
})

export const getIndividualFileURL = asyncHandler(async (req, res) => {
	const { filePath } = req.body

	if (filePath) {
		const fileURL = await generateGetURL(filePath)

		if (fileURL) {
			res.status(200).json({ fileURL })
		} else {
			res.status(401)
			throw new Error('Error Occurred, please retry')
		}
	}
})

export const createNewFiles = asyncHandler(async (req, res) => {
	const { currentFolderId, fileUrls } = req.body

	const newFiles =
		fileUrls.newFiles && fileUrls.newFiles.length
			? fileUrls.newFiles.map((fileUrl) => {
					const urlArray = fileUrl.split('/')
					return {
						fileName: urlArray[urlArray.length - 1],
						folderId: currentFolderId,
						path: fileUrl,
						createdBy: req.user._id || '',
					}
			  })
			: []

	const existingFilesNames =
		fileUrls.existingFiles && fileUrls.existingFiles.length
			? fileUrls.existingFiles.map((fileUrl) => {
					const urlArray = fileUrl.split('/')
					return urlArray[urlArray.length - 1]
			  })
			: []

	if ((newFiles && newFiles.length > 0) || (existingFilesNames && existingFilesNames.length > 0)) {
		let response = null
		if (newFiles.length > 0) {
			response = await JobFile.insertMany(newFiles)
		}
		if (existingFilesNames.length > 0) {
			response = await JobFile.updateMany({ fileName: { $in: existingFilesNames }, folderId: currentFolderId }, { $set: { updatedAt: new Date() } })
		}
		if (response) {
			res.status(200).json('Files created successfully')
		} else {
			res.status(401)
			throw new Error('Invalid folder data')
		}
	} else {
		res.status(404)
		throw new Error('No Files Found')
	}
})

export const getFilesByFolder = asyncHandler(async (req, res) => {
	const { folderId } = req.params

	if (folderId) {
		const files = await JobFile.find({ folderId }, { fileName: 1, path: 1, createdAt: 1, updatedAt: 1 })
		if (files && files.length > 0) {
			res.status(200).json(files)
		} else {
			res.status(404)
			throw new Error('No files exist in folder')
		}
	} else {
		res.status(500)
		throw new Error('Internal Server Error')
	}
})

export const deleteIndividualFile = asyncHandler(async (req, res) => {
	const { fileId, filePath } = req.body

	const response = await JobFile.deleteOne({ _id: fileId })

	if (response) {
		const deletedResponse = await deleteObject(filePath)

		if (deletedResponse) {
			res.status(200).json(deletedResponse)
		} else {
			res.status(404)
			throw new Error('Partially deleted')
		}
	} else {
		res.status(404)
		throw new Error('No files to delete')
	}
})

export const deleteFolder = asyncHandler(async (req, res) => {
	const { folderId } = req.params

	const response = await JobFolder.aggregate([
		{ $match: { $or: [{ 'path.folderId': folderId.toString() }, { _id: mongoose.Types.ObjectId(folderId) }] } },
		{
			$group: {
				_id: null,
				folderIds: { $push: '$_id' },
			},
		},
		{
			$project: { folderIds: 1, _id: 0 },
		},
	])

	if (response && response.length > 0 && response[0].folderIds && response[0].folderIds.length > 0) {
		const deletedFolders = await JobFolder.deleteMany({ _id: { $in: response[0].folderIds } })
		let deleteFileURLs = []
		const files = await JobFile.find({ folderId: { $in: response[0].folderIds } }, { path: 1 })
		if (files.length > 0) {
			await JobFile.deleteMany({ folderId: { $in: response[0].folderIds } })
			deleteFileURLs = await files.map(async (file) => await deleteObject(file.path))
			deleteFileURLs = await Promise.all(deleteFileURLs)
		}

		res.status(200).json({ deletedFolders, deleteFileURLs })
	} else {
		res.status(404)
		throw new Error('No folders to delete')
	}
})

export const editAccessPermission = asyncHandler(async (req, res) => {
	const { folderId } = req.params
	const { newPermision } = req.body
	const folderIdsResponse = await JobFolder.aggregate([
		{ $match: { $or: [{ 'path.folderId': folderId.toString() }, { _id: mongoose.Types.ObjectId(folderId) }] } },
		{
			$group: {
				_id: null,
				folderIds: { $push: '$_id' },
			},
		},
		{
			$project: { folderIds: 1, _id: 0 },
		},
	])

	if (folderIdsResponse && folderIdsResponse.length > 0 && folderIdsResponse[0].folderIds && folderIdsResponse[0].folderIds.length > 0) {
		const response = await JobFolder.updateMany({ _id: { $in: folderIdsResponse[0].folderIds } }, { $set: { accessPermission: newPermision } })
		if (response) {
			res.status(200).json(response)
		} else {
			res.status(500)
			throw new Error('Internal Server Error: Error: EAP')
		}
	} else {
		res.status(404)
		throw new Error('Folder not found')
	}
})
