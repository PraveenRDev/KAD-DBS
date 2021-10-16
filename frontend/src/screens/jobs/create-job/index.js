import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import Loader from '../../../components/UI/Loader'
import Message from '../../../components/UI/Message'
import { DEFAULT_VALUE_JOB_NEW, emailValidation, jobNumberValidation, phoneValidation } from './data'

const Job = ({ match }) => {
	let history = useHistory()
	let timedResponse

	const [validated, setValidated] = useState(false)
	const [loading, setLoading] = useState(false)
	const [message, setMessage] = useState(null)
	const [fields, setFields] = useState(DEFAULT_VALUE_JOB_NEW)
	// const [validations, setValidations] = useState({ client: false })
	const [isUpdate, setIsUpdate] = useState(false)

	const handleTextChange = (e) =>
		setFields({
			...fields,
			[e.target.name]: e.target.name === 'clientEmail' ? e.target.value : e.target.value.toUpperCase(),
		})

	const handleSave = async () => {
		setValidated(false)
		setMessage(null)
		if (
			((fields.clientEmail.trim() || fields.clientPhone.trim() || fields.company.trim()) && !fields.client.trim()) ||
			!fields.jobNumber ||
			(fields.jobNumber && fields.jobNumber.trim() && !jobNumberValidation(fields.jobNumber)) ||
			(fields.clientEmail && fields.clientEmail.trim() && !emailValidation(fields.clientEmail)) ||
			(fields.clientPhone && fields.clientPhone.trim() && !phoneValidation(fields.clientPhone))
		) {
			setValidated(true)
		} else {
			try {
				setLoading(true)
				const config = {
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				}
				const url = isUpdate ? '/api/jobs/updateJob' : '/api/jobs/createJob'
				const postValues = isUpdate ? { jobId: match.params.jobId, fields } : { fields }
				const { data } = await axios.post(url, postValues, config)
				if (data) {
					setMessage({ isSuccess: true, text: data.message })
					setLoading(false)
					if (isUpdate) {
						history.push(`/job/${match.params.jobId}`)
					} else {
						resetAll()
					}
				}
			} catch (error) {
				setLoading(false)
				setMessage(
					error.response && error.response.data.message ? { isSuccess: false, text: error.response.data.message } : { isSuccess: false, text: error.message }
				)
			}
		}
	}

	const resetAll = () => {
		setFields(DEFAULT_VALUE_JOB_NEW)
		setValidated(false)
	}

	const revertAll = () => {
		history.push(`/job/${match.params.jobId}`)
	}

	useEffect(() => {
		if (message) {
			timedResponse = setTimeout(() => {
				setMessage(null)
			}, 1500)
		}
	}, [message])

	useEffect(() => {
		if (!localStorage.getItem('token')) {
			history.push('/')
		}
		if (match && match.params.jobId) {
			setIsUpdate(true)
			// perform update
			;(async () => {
				try {
					setLoading(true)
					const config = {
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${localStorage.getItem('token')}`,
						},
					}
					const { data } = await axios.post('/api/jobs/getJobByJobId', { jobId: match.params.jobId }, config)

					if (data && data.data) {
						const jobDetails = data.data

						setLoading(false)
						setFields({
							jobNumber: jobDetails.jobNumber,
							jobType: jobDetails.jobType,
							lots: jobDetails.lots,
							block: jobDetails.block,
							roadAllowance: jobDetails.roadAllowance,
							registeredPlanNo: jobDetails.registeredPlanNumber,
							registryOffice: jobDetails.registryOffice,
							cityTown: jobDetails.city,
							rpNo: jobDetails.rpNo,
							range: jobDetails.range,
							municipality: jobDetails.municipality,
							streetNumber: jobDetails.streetNumber,
							streetName: jobDetails.streetName,
							streetType: jobDetails.streetType,
							concession: jobDetails.concession,
							client: jobDetails.clientName,
							clientPhone: jobDetails.clientPhone,
							clientEmail: jobDetails.clientEmail,
							company: jobDetails.companyName,
							originalFileName: jobDetails.originalFileName,
							project: jobDetails.project,
							startedDate: jobDetails.startedDate && jobDetails.startedDate.split('T')[0],
							endDate: jobDetails.endDate && jobDetails.endDate.split('T')[0],
						})
					}
				} catch (error) {
					setLoading(false)
					setMessage(
						error.response && error.response.data.message ? { isSuccess: false, text: error.response.data.message } : { isSuccess: false, text: error.message }
					)
				}
			})()
		} else {
			setIsUpdate(false)
			resetAll()
		}
		return () => clearTimeout(timedResponse)
	}, [history, match, timedResponse])

	return (
		<Container>
			{message && <Message variant={message.isSuccess ? 'success' : 'danger'}>{message.text}</Message>}
			{loading && <Loader />}
			{!loading && (
				<Form noValidate validated={validated} className='filter-name'>
					<h4 className='mb-4'>{!isUpdate ? 'Create New Job' : 'Update Job'}</h4>
					<Row>
						<Col xs={12} md={4}>
							<Form.Group className='mb-3' controlId='validationCustom01'>
								<Form.Label>Job Number</Form.Label>
								<Form.Control
									required
									placeholder='20xx-xxx'
									pattern='[0-9]{4}-[0-9]{3}'
									size='md'
									type='text'
									disabled={loading}
									autoComplete='off'
									name='jobNumber'
									value={fields.jobNumber}
									onChange={handleTextChange}
								/>
								<Form.Control.Feedback type='invalid'>Please enter a valid job number</Form.Control.Feedback>
							</Form.Group>
							<Form.Group className='mb-3'>
								<Form.Label>Job Type</Form.Label>
								<Form.Control size='md' type='text' disabled={loading} autoComplete='off' name='jobType' value={fields.jobType} onChange={handleTextChange} />
							</Form.Group>
							<Form.Group className='mb-3'>
								<Form.Label>Lots</Form.Label>
								<Form.Control size='md' type='text' disabled={loading} autoComplete='off' name='lots' value={fields.lots} onChange={handleTextChange} />
							</Form.Group>
							<Form.Group className='mb-3'>
								<Form.Label>Block</Form.Label>
								<Form.Control size='md' type='text' disabled={loading} autoComplete='off' name='block' value={fields.block} onChange={handleTextChange} />
							</Form.Group>
							<Form.Group className='mb-3'>
								<Form.Label>Road Allowance</Form.Label>
								<Form.Control
									size='md'
									type='text'
									disabled={loading}
									autoComplete='off'
									name='roadAllowance'
									value={fields.roadAllowance}
									onChange={handleTextChange}
								/>
							</Form.Group>
							<Form.Group className='mb-3'>
								<Form.Label>Registered Plan Number</Form.Label>
								<Form.Control
									size='md'
									type='text'
									disabled={loading}
									autoComplete='off'
									name='registeredPlanNo'
									value={fields.registeredPlanNo}
									onChange={handleTextChange}
								/>
							</Form.Group>
							<Form.Group className='mb-3'>
								<Form.Label>Registry Office</Form.Label>
								<Form.Control
									size='md'
									type='text'
									disabled={loading}
									autoComplete='off'
									name='registryOffice'
									value={fields.registryOffice}
									onChange={handleTextChange}
								/>
							</Form.Group>
							<Form.Group className='mb-3'>
								<Form.Label>Range</Form.Label>
								<Form.Control size='md' type='text' disabled={loading} autoComplete='off' name='range' value={fields.range} onChange={handleTextChange} />
							</Form.Group>
						</Col>
						<Col xs={12} md={4}>
							<Form.Group className='mb-3'>
								<Form.Label>City/Town</Form.Label>
								<Form.Control size='md' type='text' disabled={loading} autoComplete='off' name='cityTown' value={fields.cityTown} onChange={handleTextChange} />
							</Form.Group>
							<Form.Group className='mb-3'>
								<Form.Label>RP No</Form.Label>
								<Form.Control size='md' type='text' disabled={loading} autoComplete='off' name='rpNo' value={fields.rpNo} onChange={handleTextChange} />
							</Form.Group>
							<Form.Group className='mb-3'>
								<Form.Label>Concession</Form.Label>
								<Form.Control
									size='md'
									type='text'
									disabled={loading}
									autoComplete='off'
									name='concession'
									value={fields.concession}
									onChange={handleTextChange}
								/>
							</Form.Group>
							<Form.Group className='mb-3'>
								<Form.Label>Munipality</Form.Label>
								<Form.Control
									size='md'
									type='text'
									disabled={loading}
									autoComplete='off'
									name='municipality'
									value={fields.municipality}
									onChange={handleTextChange}
								/>
							</Form.Group>
							<Form.Group className='mb-3'>
								<Form.Label>Street Number</Form.Label>
								<Form.Control
									size='md'
									type='text'
									disabled={loading}
									autoComplete='off'
									name='streetNumber'
									value={fields.streetNumber}
									onChange={handleTextChange}
								/>
							</Form.Group>
							<Form.Group className='mb-3'>
								<Form.Label>Street Name</Form.Label>
								<Form.Control
									size='md'
									type='text'
									disabled={loading}
									autoComplete='off'
									name='streetName'
									value={fields.streetName}
									onChange={handleTextChange}
								/>
							</Form.Group>
							<Form.Group className='mb-3'>
								<Form.Label>Street Type</Form.Label>
								<Form.Control
									size='md'
									type='text'
									disabled={loading}
									autoComplete='off'
									name='streetType'
									value={fields.streetType}
									onChange={handleTextChange}
								/>
							</Form.Group>
							<Form.Group className='mb-3' controlId='validationCustom02'>
								<Form.Label>Client Name</Form.Label>
								<Form.Control
									size='md'
									type='text'
									disabled={loading}
									autoComplete='off'
									required={fields.clientEmail.trim() || fields.clientPhone.trim() || fields.company.trim()}
									name='client'
									value={fields.client}
									onChange={handleTextChange}
								/>
								<Form.Control.Feedback type='invalid'>Client Name cannot be empty with company/email/phone entered</Form.Control.Feedback>
							</Form.Group>
						</Col>
						<Col xs={12} md={4}>
							<Form.Group className='mb-3'>
								<Form.Label>Company Name</Form.Label>
								<Form.Control size='md' type='text' disabled={loading} autoComplete='off' name='company' value={fields.company} onChange={handleTextChange} />
							</Form.Group>
							<Form.Group className='mb-3' controlId='validationCustom03'>
								<Form.Label>Client Phone</Form.Label>
								<Form.Control
									size='md'
									type='tel'
									placeholder='123-456-xxxx'
									pattern='[0-9]{3}-[0-9]{3}-[0-9]{4}'
									name='clientPhone'
									value={fields.clientPhone}
									onChange={handleTextChange}
									autoComplete='off'
								/>
								<Form.Control.Feedback type='invalid'>Please enter a valid phone number</Form.Control.Feedback>
							</Form.Group>
							<Form.Group className='mb-3' controlId='validationCustom04'>
								<Form.Label>Client Email</Form.Label>
								<Form.Control
									size='md'
									type='email'
									placeholder='example@example.com'
									name='clientEmail'
									value={fields.clientEmail}
									onChange={handleTextChange}
									autoComplete='off'
								/>
								<Form.Control.Feedback type='invalid'>Please enter valid email</Form.Control.Feedback>
							</Form.Group>
							<Form.Group className='mb-3'>
								<Form.Label>Original File Name</Form.Label>
								<Form.Control
									size='md'
									type='text'
									disabled={loading}
									autoComplete='off'
									name='originalFileName'
									value={fields.originalFileName}
									onChange={handleTextChange}
								/>
							</Form.Group>
							<Form.Group className='mb-3'>
								<Form.Label>Project</Form.Label>
								<Form.Control size='md' type='text' disabled={loading} name='project' value={fields.project} onChange={handleTextChange} autoComplete='off' />
							</Form.Group>
							<Form.Group className='mb-3'>
								<Form.Label>Started Date</Form.Label>
								<Form.Control
									size='md'
									type='date'
									name='startedDate'
									max={fields.endDate}
									value={fields.startedDate || ''}
									onChange={handleTextChange}
									autoComplete='off'
								/>
							</Form.Group>
							<Form.Group className='mb-3'>
								<Form.Label>End Date</Form.Label>
								<Form.Control
									size='md'
									type='date'
									name='endDate'
									min={fields.startedDate}
									value={fields.endDate || ''}
									onChange={handleTextChange}
									autoComplete='off'
								/>
							</Form.Group>
							<div className='border-bottom'></div>
							<div className='p-4'>
								<div className='d-grid gap-2'>
									<Button variant='primary' size='lg' onClick={handleSave}>
										{isUpdate ? (loading ? 'Updating...' : 'Update') : loading ? 'Saving...' : 'Save'}
									</Button>
									{isUpdate ? (
										<Button variant='secondary' size='lg' onClick={revertAll}>
											Revert All
										</Button>
									) : (
										<Button variant='secondary' size='lg' onClick={resetAll}>
											Clear All
										</Button>
									)}
								</div>
							</div>
						</Col>
					</Row>
				</Form>
			)}
		</Container>
	)
}

export default Job
