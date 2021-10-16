import { useEffect } from 'react'
import './App.css'
import axios from 'axios'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Login from './screens/users/login'
import Jobs from './screens/jobs'
import Header from './components/header'
import Job from './screens/jobs/create-job'
import JobOperation from './screens/jobs/job-operation'
import { clearUser, loginSuccess } from './+store/userSlice'
import { useDispatch } from 'react-redux'
import Register from './screens/users/register'

function App() {
	const dispatch = useDispatch()

	useEffect(() => {
		if (localStorage.getItem('token')) {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			}
			axios
				.get('/api/users/loginWithToken', config)
				.then(({ data }) => {
					if (data) {
						dispatch(loginSuccess(data))
					}
				})
				.catch((err) => {
					localStorage.removeItem('token')
					dispatch(clearUser())
				})
		} else {
			localStorage.removeItem('token')
			dispatch(clearUser())
		}
	}, [dispatch])

	return (
		<>
			<Router>
				<Header />
				<main className='py-5'>
					<Route path='/' exact component={Login} />
					<Route path='/job/:jobId?' exact component={Job} />
					<Route path='/job-operation' exact component={JobOperation} />
					<Route path='/jobs' exact component={Jobs} />
					<Route path='/user/:userId?' exact component={Register} />
					{/* <Route path='/users' exact component={ListUsers} /> */}
				</main>
			</Router>
		</>
	)
}

export default App
