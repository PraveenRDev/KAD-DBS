import React, { useState } from 'react'
import axios from 'axios'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderPlus, faLock, faLockOpen, faFolderMinus } from '@fortawesome/free-solid-svg-icons'
import { useHistory } from 'react-router-dom'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'

const AddFolderButton = ({ currentFolder, isAdmin }) => {
	const history = useHistory()

	const config = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('token')}`,
		},
	}

	const [open, setOpen] = useState(false)
	const [name, setName] = useState('')
	const [allowAccess, setAccess] = useState(false)
	const openModal = () => {
		setOpen(true)
	}
	const closeModal = () => {
		setOpen(false)
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			if (currentFolder == null) return
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			}
			const path = [...currentFolder.path]
			path.push({ folderName: currentFolder.name, folderId: currentFolder._id })

			const { data } = await axios.post(
				'/api/jobDirectory',
				{
					jobId: currentFolder.jobId,
					name,
					accessPermission: allowAccess ? 2 : 1,
					parentFolderId: currentFolder._id,
					path,
				},
				config
			)
			// setName('')
			// closeModal()

			if (data) {
				history.push('/job-directory/' + data._id)
			}
		} catch (error) {
			console.error(error)
		}
	}

	const deleteFolder = async () => {
		try {
			if (currentFolder == null) return

			const { data } = await axios.delete('/api/jobDirectory/' + currentFolder._id, config)

			if (data) {
				const { deleteFileURLs } = data
				if (deleteFileURLs.length > 0) {
					await deleteFileURLs.map(async (file) => await axios.delete(file))
				}
			}
			history.push('/job-directory/' + currentFolder.parentFolderId)
		} catch (error) {
			console.error(error)
		}
	}

	const toggleAccess = async () => {
		try {
			await axios.put('/api/jobDirectory/' + currentFolder._id, { newPermision: currentFolder.accessPermission === 1 ? 2 : 1 }, config)
			history.go(0)
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<>
			<DropdownButton variant='light' id='dropdown-basic-button' title='Options'>
				<Dropdown.Item onClick={openModal}>
					<FontAwesomeIcon icon={faFolderPlus} className='me-2' />
					<span>New Folder</span>
				</Dropdown.Item>
				{currentFolder && isAdmin && (
					<Dropdown.Item onClick={toggleAccess}>
						{currentFolder && currentFolder.accessPermission === 1 ? (
							<>
								<FontAwesomeIcon icon={faLockOpen} className='me-2' />
								<span>Allow Access</span>
							</>
						) : (
							<>
								<FontAwesomeIcon icon={faLock} className='me-2' />
								<span>Disable Access</span>
							</>
						)}
					</Dropdown.Item>
				)}
				{currentFolder && currentFolder.parentFolderId && isAdmin && (
					<Dropdown.Item onClick={deleteFolder}>
						<FontAwesomeIcon icon={faFolderMinus} className='me-2' />
						<span>Delete Folder</span>
					</Dropdown.Item>
				)}
			</DropdownButton>
			<Modal show={open} onHide={closeModal}>
				<Form onSubmit={handleSubmit}>
					<Modal.Body>
						<Form.Group>
							<Form.Label>Folder Name</Form.Label>
							<Form.Control type='text' required value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
						</Form.Group>
						{isAdmin && (
							<Form.Group className='mt-2'>
								<Form.Check type='checkbox' value={allowAccess} onChange={(e) => setAccess(e.target.value)} label='Allow User Access' />
							</Form.Group>
						)}
					</Modal.Body>
					<Modal.Footer>
						<Button variant='secondary' onClick={closeModal}>
							Close
						</Button>
						<Button variant='primary' type='submit'>
							Add Folder
						</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		</>
	)
}

export default AddFolderButton
