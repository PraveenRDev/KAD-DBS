import mongoose from 'mongoose'

const JobFileSchema = mongoose.Schema(
	{
		fileName: { type: String, required: true, default: '' },
		folderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'JobFolder',
		},
		path: { type: String, required: true, default: '' },
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{
		timestamps: true,
	}
)

const JobFile = mongoose.model('JobFile', JobFileSchema)

export default JobFile
