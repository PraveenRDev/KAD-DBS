import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import { jobNumberValidation } from '../create-job/data'
import FormContainer from '../../../components/UI/FormContainer'
import Loader from '../../../components/UI/Loader'
import Message from '../../../components/UI/Message'

const JobOperation = ({ userDetails }) => {
	let timedResponse
	const history = useHistory()

	const [jobNumber, setJobNumber] = useState('')
	const [validated, setValidated] = useState(false)
	const [loading, setLoading] = useState(false)
	const [message, setMessage] = useState(null)

	useEffect(() => {
		if (!jobNumber || !jobNumber.trim() || (jobNumber && jobNumber.trim() && !jobNumberValidation(jobNumber))) {
			setValidated(true)
		} else {
			setValidated(false)
		}
	}, [jobNumber])

	useEffect(() => {
		if (userDetails && !userDetails.isAdmin) {
			history.push('/')
		}
		return () => {
			clearTimeout(timedResponse)
		}
		// eslint-disable-next-line
	}, [userDetails])

	useEffect(() => {
		if (message) {
			// eslint-disable-next-line
			timedResponse = setTimeout(() => {
				setMessage(null)
			}, 1500)
		}
	}, [message])

	const deleteJob = async () => {
		setMessage(null)
		if (!validated) {
			try {
				setLoading(true)
				const config = {
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				}
				const { data } = await axios.post('/api/jobs/deleteJob', { jobNumber }, config)

				if (data) {
					setLoading(false)
					setJobNumber('')
					setMessage({ isSuccess: true, text: data.message })
				}
			} catch (error) {
				setLoading(false)
				setMessage(
					error.response && error.response.data.message ? { isSuccess: false, text: error.response.data.message } : { isSuccess: false, text: error.message }
				)
			}
		}
	}

	// const updateJob = async () => {
	// 	setMessage(null)
	// 	if (!validated) {
	// 		try {
	// 			setLoading(true)
	// 			const config = {
	// 				headers: {
	// 					'Content-Type': 'application/json',
	// 					Authorization: `Bearer ${localStorage.getItem('token')}`,
	// 				},
	// 			}
	// 			const { data } = await axios.post('/api/jobs/getJobByNumber', { jobNumber }, config)

	// 			if (data) {
	// 				setLoading(false)
	// 				history.push(`/job/${data.data}`)
	// 			}
	// 		} catch (error) {
	// 			setLoading(false)
	// 			setMessage(
	// 				error.response && error.response.data.message ? { isSuccess: false, text: error.response.data.message } : { isSuccess: false, text: error.message }
	// 			)
	// 		}
	// 	}
	// }

	const handleChange = (e) => {
		if (message) {
			setMessage(null)
		}
		setJobNumber(e.target.value.toUpperCase())
	}

	return (
		<Container>
			<FormContainer>
				{loading && <Loader />}
				{message && <Message variant={message.isSuccess ? 'success' : 'danger'}>{message.text}</Message>}
				{!loading && (
					<Form noValidate validated={validated}>
						<Row>
							<small className='text-warning bg-dark p-3 rounded mb-3'>
								Danger! Please verify job before performing <b>delete</b>
							</small>
						</Row>
						<Form.Group className='mb-3' controlId='validationCustom01'>
							<Form.Label>Job Number</Form.Label>
							<Form.Control
								placeholder='Enter Job Number (20xx-xxx)'
								required
								pattern='[0-9]{4}-[0-9]{3}'
								size='lg'
								type='text'
								value={jobNumber}
								onChange={handleChange}
								autoComplete='off'
							/>
							<Form.Control.Feedback type='invalid'>Please enter a valid job number</Form.Control.Feedback>
						</Form.Group>
						{/* <Button variant='info' disabled={loading} size='lg' onClick={updateJob}>
							Update
						</Button>{' '} */}
						<Button variant='danger' disabled={loading} size='lg' onClick={deleteJob}>
							Delete
						</Button>
					</Form>
				)}
			</FormContainer>
		</Container>
	)
}

export default JobOperation
