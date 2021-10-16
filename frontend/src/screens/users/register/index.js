import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import FormContainer from '../../../components/UI/FormContainer'
import Loader from '../../../components/UI/Loader'
import Message from '../../../components/UI/Message'

const Register = ({ userDetails = null }) => {
	const history = useHistory()

	const [loading, setLoading] = useState(false)
	const [message, setMessage] = useState(null)

	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [isAdmin, setIsAdmin] = useState(false)
	const [validated, setValidated] = useState(false)

	useEffect(() => {
		if (userDetails && !userDetails.isAdmin) {
			history.push('/')
		}
		// eslint-disable-next-line
	}, [userDetails])

	const submitHandler = async (e) => {
		e.preventDefault()
		if (username && password) {
			setLoading(true)
			try {
				const config = {
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				}
				const response = await axios.post('/api/users', { username, password, isAdmin }, config)
				setLoading(false)
				if (response) {
					setMessage({ isSuccess: true, text: 'A user has been successfully created' })
				}
			} catch (error) {
				setLoading(false)
				setMessage(
					error.response && error.response.data.message ? { isSuccess: false, text: error.response.data.message } : { isSuccess: false, text: error.message }
				)
			}
		} else {
			setValidated(true)
		}
	}

	return (
		<Container>
			<FormContainer>
				{loading && <Loader />}
				{message && <Message variant={message.isSuccess ? 'success' : 'danger'}>{message.text}</Message>}
				<h4>Create New User</h4>
				<br />
				<Form noValidate validated={validated} onSubmit={submitHandler}>
					<Form.Group className='mb-3' controlId='username'>
						<Form.Label>Username</Form.Label>
						<Form.Control
							readOnly={loading}
							type='text'
							placeholder='Enter username'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
							autoComplete='off'
						></Form.Control>
						<Form.Control.Feedback type='invalid'>Please provide a valid username.</Form.Control.Feedback>
					</Form.Group>

					<Form.Group className='mb-3' controlId='password'>
						<Form.Label>Password</Form.Label>
						<Form.Control
							readOnly={loading}
							type='password'
							placeholder='Enter password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							autoComplete='off'
						></Form.Control>
						<Form.Control.Feedback type='invalid'>Please provide a valid password.</Form.Control.Feedback>
					</Form.Group>
					<Form.Group className='mb-3' controlId='password'>
						<Form.Label>Allow Admin Privileges</Form.Label>
						<br />
						<Form.Check inline label='Yes' name='isAdmin' type='radio' value='' checked={isAdmin} onChange={() => setIsAdmin(true)} />
						<Form.Check inline label='No' name='isAdmin' type='radio' value='' checked={!isAdmin} onChange={() => setIsAdmin(false)} />
					</Form.Group>
					<Button type='submit' variant='primary' size='lg' disabled={loading}>
						{loading ? 'Creating..' : 'Create'}
					</Button>
				</Form>
			</FormContainer>
		</Container>
	)
}

export default Register
