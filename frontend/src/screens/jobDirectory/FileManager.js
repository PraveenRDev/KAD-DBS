import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import React, { useState, useEffect, useMemo } from 'react'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'
import Button from 'react-bootstrap/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile } from '@fortawesome/free-solid-svg-icons'
import Paginator from '../../components/pagination'
import { Link, useHistory } from 'react-router-dom'
import FileSaver from 'file-saver'
import Loader from '../../components/UI/Loader'
import Message from '../../components/UI/Message'
import Modal from 'react-bootstrap/Modal'

const baseStyle = {
	flex: 1,
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	padding: '20px',
	borderWidth: 2,
	borderRadius: 2,
	borderColor: '#eeeeee',
	borderStyle: 'dashed',
	backgroundColor: '#fafafa',
	color: '#bdbdbd',
	outline: 'none',
	transition: 'border .24s ease-in-out',
}

const activeStyle = {
	borderColor: '#2196f3',
}

const acceptStyle = {
	borderColor: '#00e676',
}

const rejectStyle = {
	borderColor: '#ff1744',
}

const FileManager = ({ currentFolder }) => {
	const config = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('token')}`,
		},
	}
	let timer
	const [files, setFiles] = useState([])
	const [loading, setLoading] = useState(false)
	const [message, setMessage] = useState(null)
	const [isFetching, setIsFetching] = useState(false)
	const [folderFiles, setFolderFiles] = useState([])
	const [skip, setSkip] = useState(0)
	const [deletePopup, setDeletePopup] = useState(false)
	const [fileToDelete, setFileToDelete] = useState(null)

	const { acceptedFiles, getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({ disabled: isFetching })

	const style = useMemo(
		() => ({
			...baseStyle,
			...(isDragActive ? activeStyle : {}),
			...(isDragAccept ? acceptStyle : {}),
			...(isDragReject ? rejectStyle : {}),
		}),
		[isDragActive, isDragReject, isDragAccept]
	)

	const renderFiles = files.map((file, i) => (
		<li key={file.path} className='mb-2'>
			<Button className='btn btn-danger btn-sm me-2' disabled={isFetching} onClick={() => setFiles(files.filter((f) => f.path !== file.path))}>
				X
			</Button>
			<span>{i + 1}) </span>
			{file.path} - {file.size} bytes
		</li>
	))

	useEffect(() => {
		if (currentFolder) {
			loadFiles()
		}
		return () => {
			if (timer) {
				clearTimeout()
			}
		}
	}, [currentFolder])

	useEffect(() => {
		if (message) {
			timer = setTimeout(() => setMessage(null), 2000)
		}
	}, [message])

	const loadFiles = async () => {
		setLoading(true)
		try {
			const response = await axios.get('/api/jobDirectory/files/' + currentFolder._id, config)
			setLoading(false)
			if (response && response.data) {
				setFolderFiles(response.data)
			} else {
				setFolderFiles([])
			}
		} catch (error) {
			setFolderFiles([])
			setLoading(false)
			setMessage(error.response && error.response.data.message ? error.response.data.message : error.message)
		}
	}

	useEffect(() => {
		//  && files.length + acceptedFiles.length <= 5
		if (acceptedFiles && acceptedFiles.length) {
			const filePaths = new Set(files.map(({ path }) => path))
			const uniqueFiles = [...files, ...acceptedFiles.filter(({ path }) => !filePaths.has(path) && !path.startsWith('/'))]
			setFiles(uniqueFiles)
		}
	}, [acceptedFiles])

	const uploadFiles = async () => {
		setMessage(null)
		try {
			if (files && files.length > 0) {
				setIsFetching(true)
				let folderName = ''
				// root level
				if (currentFolder.path.length === 0) {
					folderName = currentFolder.name
					folderName += '/'
				} else if (currentFolder.path.length > 0) {
					currentFolder.path.forEach((p) => {
						folderName += p.folderName
						folderName += '/'
					})

					folderName += currentFolder.name
					folderName += '/'
				}
				const readyFiles = files.map((readyFile) => folderName + readyFile.path)
				let readyFilesPath = {}
				files.forEach((readyFile) => {
					readyFilesPath = { ...readyFilesPath, [readyFile.path]: readyFile }
				})

				if (readyFiles.length === files.length) {
					try {
						const { data } = await axios.post('/api/jobDirectory/getFilesUploadURLs', { filePaths: readyFiles }, config)
						if (data.putURLS.length === files.length) {
							const files = await data.putURLS.map(async (putURL) => {
								const fileName = decodeURI(putURL).split(folderName)[1].split('?')[0]
								const s3Config = {
									headers: { 'Content-Type': 'multipart/form-data' },
								}
								return decodeURI(await (await axios.put(putURL, readyFilesPath[fileName], s3Config)).request.responseURL.split('.com/')[1].split('?')[0])
							})
							const uploadedFilePaths = await Promise.all(files)
							// console.log(uploadedFilePaths.forEach((file) => console.log('file:- ', file)))
							// const filePaths = new Set(files.map(({ path }) => path))
							// uploadedFilePaths.filter(({ path }) => !filePaths.has(path)

							let newFiles = []
							let existingFiles = []
							if (folderFiles && folderFiles.length > 0) {
								const filePaths = new Set(folderFiles.map((file) => file.fileName))
								newFiles = uploadedFilePaths.filter((file) => !filePaths.has(file.split(folderName)[1]))
								existingFiles = uploadedFilePaths.filter((file) => filePaths.has(file.split(folderName)[1]))
							}

							await axios.post(
								'/api/jobDirectory/files',
								{ currentFolderId: currentFolder._id, fileUrls: folderFiles.length > 0 ? { newFiles, existingFiles } : { newFiles: uploadedFilePaths } },
								config
							)
							setMessage('Uploaded Successfully')

							setIsFetching(false)
							loadFiles()
							setFiles([])
							// refresh files
						} else {
							setIsFetching(false)
							// files missing..
						}
					} catch (error) {
						setIsFetching(false)
						setMessage(error.response && error.response.data.message ? error.response.data.message : error.message)
					}
				}
			}
		} catch (error) {
			setIsFetching(false)
			setMessage(error.response && error.response.data.message ? error.response.data.message : error.message)
		}
	}

	const downloadFile = async (filePath, fileName) => {
		try {
			const { data } = await axios.post('/api/jobDirectory/getIndividualFileURL', { filePath }, config)
			if (data && data.fileURL) {
				FileSaver.saveAs(data.fileURL, decodeURI(fileName))
			}
		} catch (error) {
			setMessage(error.response && error.response.data.message ? error.response.data.message : error.message)
		}
	}

	const deleteFile = async () => {
		setDeletePopup(false)
		if (fileToDelete) {
			const { fileId, filePath } = fileToDelete
			try {
				setIsFetching(true)
				const response = await axios.post('/api/jobDirectory/deleteFile', { fileId, filePath }, config)
				setIsFetching(false)
				if (response.data && response.status === 200) {
					await axios.delete(response.data)
					setMessage('File has been successfully deleted')
				} else {
					setMessage('partially deleted')
				}
			} catch (error) {
				setIsFetching(false)
				setMessage(error.response && error.response.data.message ? error.response.data.message : error.message)
			}
			loadFiles()
		}
	}
	const showDeletePopup = (fileId, filePath, fileName) => {
		setDeletePopup(true)
		setFileToDelete({ fileId, filePath, fileName })
	}
	return (
		<>
			{fileToDelete && (
				<Modal show={deletePopup} onHide={() => setDeletePopup(false)}>
					<Modal.Body>
						<h4>Do you want to delete the file?</h4>
						<p>Deleting may result in permenant removal of the file {fileToDelete.fileName}</p>
					</Modal.Body>
					<Modal.Footer>
						<Button variant='danger' onClick={() => setDeletePopup(false)}>
							Close
						</Button>
						<Button variant='secondary' onClick={() => deleteFile()}>
							Yes
						</Button>
					</Modal.Footer>
				</Modal>
			)}
			{loading && <Loader />}
			{message && <Message>{message}</Message>}
			{!loading && (
				<Row>
					<Col md={6}>
						{folderFiles.slice(skip, skip + 12).map((file) => (
							<div key={file._id} className='d-flex align-items-baseline'>
								<Button
									disabled={isFetching}
									onClick={() => downloadFile(file.path, file.fileName)}
									className='text-truncate text-left w-100 mb-2 '
									variant='outline-light'
									data-toggle='tooltip'
									data-placement='right'
									title={`Last modified: ${file.updatedAt.split('T')[0]} ${file.updatedAt.split('T')[1].substring(0, 8)}`}
								>
									<div className='d-flex align-items-baseline'>
										<FontAwesomeIcon icon={faFile} className='me-2' />

										<div className='text-info'>{file.fileName}</div>
									</div>
								</Button>
								<Button className='ms-1' variant='danger' disabled={isFetching} onClick={() => showDeletePopup(file._id, file.path, file.fileName)}>
									X
								</Button>
							</div>
						))}
						<Paginator totalCount={folderFiles.length} itemsPerPage={12} setSkip={setSkip} />
					</Col>
					<Col md={6}>
						<div className='container flex-row'>
							<div {...getRootProps({ style })}>
								<input {...getInputProps()} />
								<p>Upload Files</p>
							</div>
							{files && files.length > 0 && (
								<aside className='mt-2'>
									<h4>Files Ready To Upload</h4>
									<ul>{renderFiles}</ul>
									<Row>
										<Button className='btn btn-dark btn-lg' disabled={isFetching} onClick={uploadFiles}>
											Upload
										</Button>
									</Row>
								</aside>
							)}
						</div>
					</Col>
				</Row>
			)}
		</>
	)
}

export default FileManager
