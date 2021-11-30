import expressAsyncHandler from 'express-async-handler'
import JobType from '../models/jobTypeModel.js'
import Jobs from '../models/jobModel.js'
import Client from '../models/clientModel.js'
import Company from '../models/companyModel.js'
import Job from '../models/jobModel.js'
import JobFolder from '../models/jobFolderModel.js'
import JobFile from '../models/jobFileModel.js'
import mongoose from 'mongoose'
// import DeletedDump from '../models/deletedDump.js'

// @desc    Get job types
// @route   GET /api/jobs/jobTypes
// @access  Public
export const getDropDownData = expressAsyncHandler(async (req, res) => {
	const jobTypes = await JobType.find({}, { jobType: 1, _id: 1 })
	const city = await Jobs.distinct('city', { city: { $ne: '' } })
	const municipality = await Jobs.distinct('municipality', { municipality: { $ne: '' } })
	const streetType = await Jobs.distinct('streetType', { streetType: { $ne: '' } })
	const clients = await Client.find({}, { clientName: 1, _id: 1 })
	const companies = await Company.find({}, { companyName: 1, _id: 1 })

	if (jobTypes && jobTypes.length > 0 && city && city.length > 0) {
		res.json({
			jobTypes,
			city,
			municipality,
			streetType,
			clients,
			companies,
		})
	} else {
		res.status(500)
		throw new Error('Server Error Occured(code: DDResultsFailure)')
	}
})

export const filterResults = expressAsyncHandler(async (req, res) => {
	const { filters, sort, sortBy } = req.body
	const separateBySemiColan = (value) => value.split(';').map((value) => value.trim())
	const separateFromDropdown = (values, isObjID = false) => values.map((val) => (isObjID ? mongoose.Types.ObjectId(val.value) : val.value))

	if (filters || sort || sortBy) {
		const {
			jobNumber,
			jobTypes,
			lots,
			block,
			roadAllowance,
			registeredPlanNo,
			registryOffice,
			cityTown,
			rpNo,
			concession,
			range,
			municipality,
			streetNumber,
			streetName,
			streetType,
			client,
			company,
			originalFileName,
			project,
		} = filters

		let jobNumberValue = jobNumber.value.trim()
			? separateBySemiColan(jobNumber.value).length > 1
				? { $in: separateBySemiColan(jobNumber.value) }
				: { $regex: jobNumber.value, $options: 'i' }
			: { $exists: 1 }
		let jobTypeId = jobTypes.value.length ? { $in: separateFromDropdown(jobTypes.value, true) } : { $exists: 1 }
		let lotsValue = lots.value.trim()
			? separateBySemiColan(lots.value).length > 1
				? { $in: separateBySemiColan(lots.value) }
				: { $regex: lots.value, $options: 'i' }
			: { $exists: 1 }
		let blockValue = block.value.trim()
			? separateBySemiColan(block.value).length > 1
				? { $in: separateBySemiColan(block.value) }
				: { $regex: block.value, $options: 'i' }
			: { $exists: 1 }
		let roadAllowanceValue = roadAllowance.value.trim()
			? separateBySemiColan(roadAllowance.value).length > 1
				? { $in: separateBySemiColan(roadAllowance.value) }
				: { $regex: roadAllowance.value, $options: 'i' }
			: { $exists: 1 }
		let registeredPlanNumber = registeredPlanNo.value.trim()
			? separateBySemiColan(registeredPlanNo.value).length > 1
				? { $in: separateBySemiColan(registeredPlanNo.value) }
				: { $regex: registeredPlanNo.value, $options: 'i' }
			: { $exists: 1 }

		let registryOfficeValue = registryOffice.value.trim()
			? separateBySemiColan(registryOffice.value).length > 1
				? { $in: separateBySemiColan(registryOffice.value) }
				: { $regex: registryOffice.value, $options: 'i' }
			: { $exists: 1 }

		let rangeValue = range.value.trim()
			? separateBySemiColan(range.value).length > 1
				? { $in: separateBySemiColan(range.value) }
				: { $regex: range.value, $options: 'i' }
			: { $exists: 1 }

		let city = cityTown.value.length ? { $in: separateFromDropdown(cityTown.value) } : { $exists: 1 }

		let rpNoValue = rpNo.value.trim()
			? separateBySemiColan(rpNo.value).length > 1
				? { $in: separateBySemiColan(rpNo.value) }
				: { $regex: rpNo.value, $options: 'i' }
			: { $exists: 1 }
		let concessionValue = concession.value.trim()
			? separateBySemiColan(concession.value).length > 1
				? { $in: separateBySemiColan(concession.value) }
				: { $regex: concession.value, $options: 'i' }
			: { $exists: 1 }

		let municipalityValue = municipality.value.length ? { $in: separateFromDropdown(municipality.value) } : { $exists: 1 }
		let streetNumberValue = streetNumber.value.trim()
			? separateBySemiColan(streetNumber.value).length > 1
				? { $in: separateBySemiColan(streetNumber.value) }
				: { $regex: streetNumber.value, $options: 'i' }
			: { $exists: 1 }
		let streetNameValue = streetName.value.trim()
			? separateBySemiColan(streetName.value).length > 1
				? { $in: separateBySemiColan(streetName.value) }
				: { $regex: streetName.value, $options: 'i' }
			: { $exists: 1 }
		let streetTypeValue = streetType.value.length ? { $in: separateFromDropdown(streetType.value) } : { $exists: 1 }
		let clientId = client.value.length ? { $in: separateFromDropdown(client.value, true) } : { $exists: 1 }
		let companyId = company.value.length ? { $in: separateFromDropdown(company.value, true) } : { $exists: 1 }
		let originalFileNameValue = originalFileName.value.trim()
			? separateBySemiColan(originalFileName.value).length > 1
				? { $in: separateBySemiColan(originalFileName.value) }
				: { $regex: originalFileName.value, $options: 'i' }
			: { $exists: 1 }
		let projectValue = project.value.trim()
			? separateBySemiColan(project.value).length > 1
				? { $in: separateBySemiColan(project.value) }
				: { $regex: project.value, $options: 'i' }
			: { $exists: 1 }

		const allShowFields = [
			{ value: jobNumber, name: 'jobNumber', isDefaultHide: false, label: 'Job Number' },
			{ value: jobTypes, name: 'jobType', isDefaultHide: false, label: 'Job Type' },
			{ value: jobTypes, name: 'jobTypeId', isDefaultHide: true, label: 'Company' },
			{ value: lots, name: 'lots', isDefaultHide: false, label: 'Lots' },
			{ value: block, name: 'block', isDefaultHide: false, label: 'Block' },
			{ value: roadAllowance, name: 'roadAllowance', isDefaultHide: false, label: 'Road Allowance' },
			{ value: registeredPlanNo, name: 'registeredPlanNumber', isDefaultHide: false, label: 'Registered Plan No' },
			{ value: registryOffice, name: 'registryOffice', isDefaultHide: false, label: 'Registry Office' },

			{ value: cityTown, name: 'city', isDefaultHide: false, label: 'City/Town' },
			{ value: rpNo, name: 'rpNo', isDefaultHide: false, label: 'RP No' },
			{ value: concession, name: 'concession', isDefaultHide: false, label: 'Concession' },
			{ value: range, name: 'range', isDefaultHide: false, label: 'Range' },
			{ value: municipality, name: 'municipality', isDefaultHide: false, label: 'Municipality' },
			{ value: streetNumber, name: 'streetNumber', isDefaultHide: false, label: 'Street Number' },
			{ value: streetName, name: 'streetName', isDefaultHide: false, label: 'Street Name' },

			{ value: streetType, name: 'streetType', isDefaultHide: false, label: 'Street Type' },
			{ value: client, name: 'clientName', isDefaultHide: false, label: 'Client' },
			{ value: client, name: 'clientId', isDefaultHide: true, label: 'Client' },
			{ value: company, name: 'companyName', isDefaultHide: false, label: 'Company' },
			{ value: company, name: 'companyId', isDefaultHide: true, label: 'Company' },
			{ value: originalFileName, name: 'originalFileName', isDefaultHide: false, label: 'Original File Name' },
			{ value: project, name: 'project', isDefaultHide: false, label: 'Project' },
		]

		const showColumns = () =>
			allShowFields
				.filter((field) => !field.isDefaultHide)
				.map((field) => {
					if (field.value.show) {
						return field.label
					}
				})
				.filter((field) => !!field)

		const hideFields = () =>
			allShowFields
				.map((field) => {
					if (!field.value.show) {
						return field.name
					}
				})
				.filter((field) => !!field)

		const isUnset =
			hideFields().length !== allShowFields.length && hideFields().length !== 0
				? {
						$unset: hideFields(),
				  }
				: {
						$project: {
							_id: 1,
							jobNumber: 1,
							jobType: 1,
							lots: 1,
							block: 1,
							roadAllowance: 1,
							registeredPlanNumber: 1,
							registryOffice: 1,
							city: 1,
							rpNo: 1,
							range: 1,
							concession: 1,
							municipality: 1,
							streetNumber: 1,
							streetName: 1,
							streetType: 1,
							originalFileName: 1,
							project: 1,
							clientName: 1,
							companyName: 1,
							directoryId: 1,
							directoryPermission: 1,
						},
				  }
		const result = await Job.aggregate([
			{ $match: { status: 1 } },
			{
				$lookup: {
					from: 'clients',
					localField: 'clientId',
					foreignField: '_id',
					as: 'clientDetails',
				},
			},
			{
				$unwind: {
					path: '$clientDetails',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$lookup: {
					from: 'companies',
					localField: 'clientDetails.companyId',
					foreignField: '_id',
					as: 'companyDetails',
				},
			},
			{
				$unwind: {
					path: '$companyDetails',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$lookup: {
					from: 'jobtypes',
					localField: 'jobTypeId',
					foreignField: '_id',
					as: 'jobTypeDetails',
				},
			},
			{
				$unwind: {
					path: '$jobTypeDetails',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$lookup: {
					from: 'jobfolders',
					localField: '_id',
					foreignField: 'jobId',
					as: 'jobsDirectory',
				},
			},
			{
				$project: {
					jobNumber: 1,
					jobTypeId: 1,
					jobType: { $ifNull: ['$jobTypeDetails.jobType', ''] },
					lots: 1,
					block: 1,
					roadAllowance: 1,
					registeredPlanNumber: 1,
					registryOffice: 1,
					city: 1,
					rpNo: 1,
					range: 1,
					concession: 1,
					municipality: 1,
					streetNumber: 1,
					streetName: 1,
					streetType: 1,
					originalFileName: 1,
					project: 1,
					clientId: 1,
					clientName: { $ifNull: ['$clientDetails.clientName', ''] },
					companyId: { $ifNull: ['$companyDetails._id', ''] },
					companyName: { $ifNull: ['$companyDetails.companyName', ''] },
					directoryId: { $first: '$jobsDirectory._id' },
					directoryPermission: { $first: '$jobsDirectory.accessPermission' },
				},
			},
			{
				$match: {
					jobNumber: jobNumberValue,
					jobTypeId: jobTypeId,
					lots: lotsValue,
					block: blockValue,
					roadAllowance: roadAllowanceValue,
					registeredPlanNumber: registeredPlanNumber,
					registryOffice: registryOfficeValue,
					range: rangeValue,
					city,
					rpNo: rpNoValue,
					concession: concessionValue,
					municipality: municipalityValue,
					streetNumber: streetNumberValue,
					streetName: streetNameValue,
					streetType: streetTypeValue,
					clientId,
					companyId,
					originalFileName: originalFileNameValue,
					project: projectValue,
				},
			},
			isUnset,
			{
				$sort: { [sort]: Number(sortBy) },
			},
		])
		res.status(200).json({
			columnNames: showColumns().length === 0 ? allShowFields.filter((field) => !field.isDefaultHide).map((field) => field.label) : showColumns(),
			result,
		})
	} else {
		res.status(500)
		throw new Error('Server Error while searching results')
	}
})

export const createJob = expressAsyncHandler(async (req, res) => {
	const { fields } = req.body

	if (fields) {
		let {
			jobNumber = null,
			jobType = null,
			lots = null,
			block = null,
			roadAllowance = null,
			registeredPlanNo = null,
			registryOffice = null,
			cityTown = null,
			rpNo = null,
			concession = null,
			range = null,
			municipality = null,
			streetNumber = null,
			streetName = null,
			streetType = null,
			client = null,
			clientPhone = null,
			clientEmail = null,
			company = null,
			originalFileName = null,
			project = null,
			startedDate = null,
			endDate = null,
		} = fields

		lots = lots && lots.trim()
		block = block && block.trim()
		roadAllowance = roadAllowance && roadAllowance.trim()
		registeredPlanNo = registeredPlanNo && registeredPlanNo.trim()
		registryOffice = registryOffice && registryOffice.trim()
		range = range && range.trim()
		jobNumber = jobNumber && jobNumber.trim()
		cityTown = cityTown && cityTown.trim()
		rpNo = rpNo && rpNo.trim()
		concession = concession && concession.trim()
		municipality = municipality && municipality.trim()
		streetNumber = streetNumber && streetNumber.trim()
		streetName = streetName && streetName.trim()
		streetType = streetType && streetType.trim()
		originalFileName = originalFileName && originalFileName.trim()
		project = project && project.trim()
		startedDate = startedDate && new Date(startedDate)
		endDate = endDate && new Date(endDate)
		clientPhone = clientPhone && clientPhone.trim()
		clientEmail = clientEmail && clientEmail.trim()

		const existingJobNumber = await Jobs.findOne({ jobNumber }, { jobNumber: 1 })
		if (existingJobNumber) {
			res.status(400)
			throw new Error('Job Number already exists')
		}

		let jobTypeId = null
		if (jobType && jobType.trim()) {
			const job_Type = jobType.trim()
			const jobTypeData = await JobType.findOne({ jobType: job_Type }, { _id: 1 })
			if (jobTypeData) jobTypeId = jobTypeData._id
			else {
				const newJobType = await JobType.create({ jobType: job_Type })
				if (newJobType) jobTypeId = newJobType._id
			}
		}

		let companyId = null
		if (company && company.trim()) {
			const companyName = company.trim()
			const companyData = await Company.findOne({ companyName }, { _id: 1 })
			if (companyData) companyId = companyData._id
			else {
				const newCompany = await Company.create({ companyName })
				if (newCompany) companyId = newCompany._id
			}
		}

		let clientId = null
		if (client && client.trim()) {
			const clientName = client.trim()
			const clientData = await Client.findOne({ clientName }, { _id: 1 })
			if (clientData) clientId = clientData._id
			else {
				const newClient = await Client.create({ clientName, companyId, phoneNo: clientPhone, email: clientEmail })
				if (newClient) clientId = newClient._id
			}
		}

		const newJob = await Job.create({
			jobNumber,
			jobTypeId,
			lots,
			block,
			roadAllowance,
			registeredPlanNumber: registeredPlanNo,
			registryOffice,
			city: cityTown,
			rpNo,
			range,
			concession,
			municipality,
			streetNumber,
			streetName,
			streetType,
			originalFileName,
			project,
			startedDate,
			endDate,
			clientId,
		})

		if (newJob) {
			const jobParentFolder = await JobFolder.create({
				jobId: newJob._id,
				name: newJob.jobNumber,
				parentFolderId: null,
				path: [],
				createdBy: req.user._id,
			})
			;['DRAWING', 'SEARCH', 'SURVEY DATA'].forEach(async (commonFolder) => {
				await JobFolder.create({
					jobId: newJob._id,
					name: commonFolder,
					parentFolderId: jobParentFolder._id,
					path: [{ folderName: jobParentFolder.name, folderId: jobParentFolder._id }],
					createdBy: req.user._id,
				})
			})
			res.status(200).json({
				message: 'A New Job has been created successfully',
				createdJob: newJob._id,
			})
		} else {
			res.status(400)
			throw new Error('Invalid Job data')
		}
	} else {
		res.status(500)
		throw new Error('Server Error Occured(code: CJFailure)')
	}
})

export const deleteJob = expressAsyncHandler(async (req, res) => {
	const { jobNumber } = req.body
	if (jobNumber) {
		const existingJobDetails = await Jobs.aggregate([
			{ $match: { jobNumber } },
			{
				$lookup: {
					from: 'clients',
					localField: 'clientId',
					foreignField: '_id',
					as: 'clientDetails',
				},
			},
			{
				$unwind: {
					path: '$clientDetails',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$lookup: {
					from: 'companies',
					localField: 'clientDetails.companyId',
					foreignField: '_id',
					as: 'companyDetails',
				},
			},
			{
				$unwind: {
					path: '$companyDetails',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$lookup: {
					from: 'jobtypes',
					localField: 'jobTypeId',
					foreignField: '_id',
					as: 'jobTypeDetails',
				},
			},
			{
				$unwind: {
					path: '$jobTypeDetails',
					preserveNullAndEmptyArrays: true,
				},
			},
		])
		if (existingJobDetails && !existingJobDetails.length) {
			res.status(400)
			throw new Error("Job Number doesn't exist")
		} else {
			const existingJob = existingJobDetails[0]

			// if (existingJob.companyDetails) {
			// 	const companyCount = await Client.find({ companyId: existingJob.companyDetails._id }).count()
			// 	if (companyCount === 1) {
			// 		// delete company
			// 		await Company.deleteOne({ _id: existingJob.companyDetails._id })
			// 	}
			// }

			// if (existingJob.clientDetails) {
			// 	const clientCount = await Job.find({ clientId: existingJob.clientDetails._id }).count()
			// 	if (clientCount === 1) {
			// 		// delete client
			// 		await Client.deleteOne({ _id: existingJob.clientDetails._id })
			// 	}
			// }

			// if (existingJob.jobTypeDetails) {
			// 	const jobTypeCount = await Job.find({ jobTypeId: existingJob.jobTypeDetails._id }).count()
			// 	if (jobTypeCount === 1) {
			// 		// delete jobType
			// 		await JobType.deleteOne({ _id: existingJob.jobTypeDetails._id })
			// 	}
			// }

			// await DeletedDump.create(existingJob)

			const response = await Job.deleteOne({ _id: existingJob._id })
			const foldersDelete = await JobFolder.aggregate([
				{ $match: { jobId: existingJob._id } },
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

			if (foldersDelete && foldersDelete.length > 0 && foldersDelete[0].folderIds && foldersDelete[0].folderIds.length > 0) {
				await JobFolder.deleteMany({ _id: { $in: foldersDelete[0].folderIds } })
				await JobFile.deleteMany({ folderId: { $in: foldersDelete[0].folderIds } })
			}
			res.status(200).json({
				message: 'Job is successfully deleted',
				deletedJob: response,
			})
		}
	} else {
		res.status(500)
		throw new Error('Server Error Occured(code: DJFailure)')
	}
})

export const getJobByNumber = expressAsyncHandler(async (req, res) => {
	const { jobNumber } = req.body

	if (jobNumber) {
		const existingJobNumber = await Jobs.findOne({ jobNumber, status: 1 }, { _id: 1 })
		if (!existingJobNumber) {
			res.status(400)
			throw new Error("Job Number doesn't exist")
		} else {
			res.status(200).json({
				message: 'Job exists',
				data: existingJobNumber._id,
			})
		}
	} else {
		res.status(500)
		throw new Error('Server Error Occured(code: GJNFailure)')
	}
})

export const getJobByJobId = expressAsyncHandler(async (req, res) => {
	const { jobId } = req.body
	if (jobId) {
		const existingJobDetails = await Jobs.aggregate([
			{ $match: { _id: mongoose.Types.ObjectId(jobId), status: 1 } },
			{
				$lookup: {
					from: 'clients',
					localField: 'clientId',
					foreignField: '_id',
					as: 'clientDetails',
				},
			},
			{
				$unwind: {
					path: '$clientDetails',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$lookup: {
					from: 'companies',
					localField: 'clientDetails.companyId',
					foreignField: '_id',
					as: 'companyDetails',
				},
			},
			{
				$unwind: {
					path: '$companyDetails',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$lookup: {
					from: 'jobtypes',
					localField: 'jobTypeId',
					foreignField: '_id',
					as: 'jobTypeDetails',
				},
			},
			{
				$unwind: {
					path: '$jobTypeDetails',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$lookup: {
					from: 'jobfolders',
					localField: '_id',
					foreignField: 'jobId',
					as: 'jobsDirectory',
				},
			},
			{
				$project: {
					jobNumber: 1,
					jobTypeId: 1,
					jobType: { $ifNull: ['$jobTypeDetails.jobType', ''] },
					lots: 1,
					block: 1,
					roadAllowance: 1,
					registeredPlanNumber: 1,
					registryOffice: 1,
					city: 1,
					rpNo: 1,
					range: 1,
					concession: 1,
					municipality: 1,
					streetNumber: 1,
					streetName: 1,
					streetType: 1,
					originalFileName: 1,
					project: 1,
					clientId: 1,
					startedDate: 1,
					endDate: 1,
					clientName: { $ifNull: ['$clientDetails.clientName', ''] },
					clientPhone: { $ifNull: ['$clientDetails.phone', ''] },
					clientEmail: { $ifNull: ['$clientDetails.email', ''] },
					companyId: { $ifNull: ['$companyDetails._id', ''] },
					companyName: { $ifNull: ['$companyDetails.companyName', ''] },
					directoryId: { $first: '$jobsDirectory._id' },
				},
			},
		])
		if (!existingJobDetails || (existingJobDetails && existingJobDetails.length === 0)) {
			res.status(400)
			throw new Error("Job Number doesn't exist")
		} else {
			res.status(200).json({
				message: 'Job exists',
				data: existingJobDetails[0],
			})
		}
	} else {
		res.status(500)
		throw new Error('Server Error Occured(code: GJIFailure)')
	}
})

export const updateJob = expressAsyncHandler(async (req, res) => {
	const { jobId, fields } = req.body
	if (fields) {
		let {
			jobNumber = null,
			jobType = null,
			lots = null,
			block = null,
			roadAllowance = null,
			registeredPlanNo = null,
			registryOffice = null,
			cityTown = null,
			rpNo = null,
			concession = null,
			range = null,
			municipality = null,
			streetNumber = null,
			streetName = null,
			streetType = null,
			client = null,
			clientPhone = null,
			clientEmail = null,
			company = null,
			originalFileName = null,
			project = null,
			startedDate = null,
			endDate = null,
		} = fields

		const exisitingJob = await Jobs.findOne({ _id: mongoose.Types.ObjectId(jobId) })

		if (!exisitingJob) {
			res.status(400)
			throw new Error("Job Number doesn't exist")
		} else {
			let jobTypeId = null
			if (jobType && jobType.trim()) {
				const job_Type = jobType.trim()
				const jobTypeData = await JobType.findOne({ jobType: job_Type }, { _id: 1 })
				if (jobTypeData) jobTypeId = jobTypeData._id
				else {
					const newJobType = await JobType.create({ jobType: job_Type })
					if (newJobType) jobTypeId = newJobType._id
				}
			}

			let companyId = null
			if (company && company.trim()) {
				const companyName = company.trim()
				const companyData = await Company.findOne({ companyName }, { _id: 1 })
				if (companyData) companyId = companyData._id
				else {
					const newCompany = await Company.create({ companyName })
					if (newCompany) companyId = newCompany._id
				}
			}

			let clientId = null
			if (client && client.trim()) {
				const clientName = client.trim()
				const clientData = await Client.findOne({ clientName }, { _id: 1 })
				if (clientData) clientId = clientData._id
				else {
					const newClient = await Client.create({ clientName, companyId, phoneNo: clientPhone, email: clientEmail })
					if (newClient) clientId = newClient._id
				}
			}

			const updatedResults = await Jobs.updateOne(
				{ _id: mongoose.Types.ObjectId(jobId) },
				{
					$set: {
						jobNumber,
						jobTypeId,
						lots,
						block,
						roadAllowance,
						registeredPlanNumber: registeredPlanNo,
						registryOffice,
						city: cityTown,
						rpNo,
						range,
						concession,
						municipality,
						streetNumber,
						streetName,
						streetType,
						originalFileName,
						project,
						startedDate,
						endDate,
					},
				}
			)

			if (updatedResults) {
				res.status(200).json({
					message: 'The Job has been updated successfully',
					updatedJob: updatedResults,
				})
			} else {
				res.status(400)
				throw new Error('Invalid Job data')
			}
		}
	} else {
		res.status(500)
		throw new Error('Server Error Occured(code: DJFailure)')
	}
})
