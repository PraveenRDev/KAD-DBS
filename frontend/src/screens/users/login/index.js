import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import { login, loginFailure, loginSuccess } from '../../../+store/userSlice'
import { useSelector, useDispatch } from 'react-redux'
import FormContainer from '../../../components/UI/FormContainer'
import Loader from '../../../components/UI/Loader'
import Message from '../../../components/UI/Message'

const Login = ({ history }) => {
	const dispatch = useDispatch()
	const { loading, details, error } = useSelector((state) => state.user)

	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [validated, setValidated] = useState(false)

	const submitHandler = (e) => {
		e.preventDefault()
		if (username && password) {
			loginUser(username, password)
		} else {
			setValidated(true)
		}
	}

	useEffect(() => {
		if (localStorage.getItem('token')) {
			history.push('/jobs')
		} else if (details) {
			localStorage.setItem('token', details.token)
			history.push('/jobs')
		}
	}, [details, history])

	const loginUser = async (username, password) => {
		try {
			dispatch(login())
			const config = { headers: { 'Content-Type': 'application/json' } }

			const { data } = await axios.post('/api/users/login', { username, password }, config)
			dispatch(loginSuccess(data))
		} catch (error) {
			dispatch(loginFailure(error.response && error.response.data.message ? error.response.data.message : error.message))
		}
	}

	return (
		<Container>
			<FormContainer>
				<h1>Login</h1>
				<br />
				{loading && <Loader />}
				{error && <Message variant='danger'>{error}</Message>}
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
					<Button type='submit' variant='primary' size='lg' disabled={loading}>
						{loading ? 'Loggin in..' : 'Login'}
					</Button>
				</Form>
			</FormContainer>
		</Container>
	)
}

export default Login
