import mongoose from 'mongoose'

const clientSchema = mongoose.Schema(
	{
		clientName: {
			type: String,
			required: true,
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
	},
	{
		timestamps: true,
	}
)

const Client = mongoose.model('Client', clientSchema)

export default Client
