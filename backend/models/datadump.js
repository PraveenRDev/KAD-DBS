import mongoose from 'mongoose'

const dataDumpSchema = mongoose.Schema(
	{
		serialNumber: {
			type: Number,
			required: true,
		},
		jobNumber: {
			type: String,
			required: true,
		},
		jobType: {
			type: String,
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
		clientName: {
			type: String,
			default: null,
		},
		phoneNo: {
			type: String,
			default: null,
		},
		email: {
			type: String,
			default: null,
		},
		companyName: {
			type: String,
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
	},
	{
		timestamps: true,
	}
)

const DataDump = mongoose.model('DataDump', dataDumpSchema)

export default DataDump
