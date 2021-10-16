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
		companyId: {
			type: mongoose.Schema.Types.ObjectId,
			default: null,
			ref: 'Company',
		},
	},
	{
		timestamps: true,
	}
)

const Client = mongoose.model('Client', clientSchema)

export default Client
