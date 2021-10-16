import mongoose from 'mongoose'

const deletedDumpSchema = mongoose.Schema(
	{
		serialNumber: {
			type: Number,
			default: null,
		},
		jobNumber: {
			type: String,
			default: null,
		},
		jobTypeId: {
			type: mongoose.Schema.Types.ObjectId,
			default: null,
		},
		jobTypeDetails: {
			type: Object,
			default: null,
		},
		lots: {
			type: String,
			default: null,
		},
		block: {
			type: String,
			default: null,
		},
		roadAllowance: {
			type: String,
			default: null,
		},
		registeredPlanNumber: {
			type: String,
			default: null,
		},
		registryOffice: {
			type: String,
			default: null,
		},
		city: {
			type: String,
			default: null,
		},
		rpNo: {
			type: String,
			default: null,
		},
		range: {
			type: String,
			default: null,
		},
		concession: {
			type: String,
			default: null,
		},
		municipality: {
			type: String,
			default: null,
		},
		streetNumber: {
			type: String,
			default: null,
		},
		streetName: {
			type: String,
			default: null,
		},
		streetType: {
			type: String,
			default: null,
		},
		clientId: {
			type: mongoose.Schema.Types.ObjectId,
			default: null,
		},
		clientDetails: {
			type: Object,
			default: null,
		},
		companyId: {
			type: mongoose.Schema.Types.ObjectId,
			default: null,
		},
		companyDetails: {
			type: Object,
			default: null,
		},
		originalFileName: {
			type: String,
			default: null,
		},
		project: {
			type: String,
			default: null,
		},
		startedDate: {
			type: Date,
			default: null,
		},
		endDate: {
			type: Date,
			default: null,
		},
		status: {
			type: Number,
			default: 1, // 1: active, 2: deleted
		},
	},
	{
		timestamps: true,
	}
)

const DeletedDump = mongoose.model('DeletedDump', deletedDumpSchema)

export default DeletedDump
