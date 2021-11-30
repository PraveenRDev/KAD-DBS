import mongoose from 'mongoose'

const JobFolderSchema = mongoose.Schema(
	{
		jobId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Job',
		},
		name: { type: String, required: true, default: 'New Folder' },
		accessPermission: {
			type: Number,
			default: 1,
		}, // 1 : admin-only, 2: user and admin
		path: { type: Array, default: [] },
		parentFolderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'JobFolder',
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{
		timestamps: true,
	}
)

const JobFolder = mongoose.model('JobFolder', JobFolderSchema)

export default JobFolder
