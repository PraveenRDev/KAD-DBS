import mongoose from 'mongoose'

const jobSchema = mongoose.Schema(
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
		client: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Client',
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

const Job = mongoose.model('Job', jobSchema)

export default Job
