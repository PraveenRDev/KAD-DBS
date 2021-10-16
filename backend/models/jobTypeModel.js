import mongoose from 'mongoose'

const jobTypeSchema = mongoose.Schema(
	{
		jobType: {
			type: String,
			required: true,
		},
		additionalInfo: {
			type: String,
			default: null,
		},
	},
	{
		timestamps: true,
	}
)

const JobType = mongoose.model('JobType', jobTypeSchema)

export default JobType
