import dotenv from 'dotenv'
import aws from 'aws-sdk'

dotenv.config()

const region = 'ca-central-1'
const bucketName = process.env.S3_BUCKET
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
const awsExpiry = Number(process.env.AWS_EXPIRY)

const s3 = new aws.S3({
	region,
	accessKeyId,
	secretAccessKey,
	signatureVersion: 'v4',
})

export async function generateUploadURL(fileName) {
	const params = {
		Bucket: bucketName,
		Key: fileName,
		Expires: awsExpiry,
	}

	const uploadURL = await s3.getSignedUrlPromise('putObject', params)
	return uploadURL
}

export async function generateGetURL(fileName) {
	const params = {
		Bucket: bucketName,
		Key: fileName,
		Expires: awsExpiry,
	}

	const getURL = await s3.getSignedUrlPromise('getObject', params)
	return getURL
}

export async function deleteObject(fileName) {
	const params = {
		Bucket: bucketName,
		Key: fileName,
		Expires: awsExpiry,
	}

	const deletedObj = await s3.getSignedUrlPromise('deleteObject', params)
	return deletedObj
}
