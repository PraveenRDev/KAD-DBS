import { useEffect } from 'react'
import './App.css'
import axios from 'axios'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Login from './screens/users/login'
import Jobs from './screens/jobs'
import Header from './components/header'
import Job from './screens/jobs/create-job'
import JobOperation from './screens/jobs/job-operation'
import { clearUser, loginSuccess } from './+store/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import Register from './screens/users/register'
import NotFound from './screens/notFound'
import JobDirectoryDashboard from './screens/jobDirectory/Dashboard'
import JobDirectory from './screens/jobDirectory'
// import JobDirectory from './screens/jobDirectory_1'

function App() {
	const dispatch = useDispatch()
	const userLogin = useSelector((state) => state.user)
	const { details } = userLogin
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
				<Header userDetails={details} />
				<main className='py-5'>
					<Switch>
						<Route path='/' exact component={Login} />
						<Route path='/job/:jobId?' exact component={Job} />
						<Route path='/job-operation' component={() => <JobOperation userDetails={details} />} />
						<Route path='/jobs' exact component={() => <Jobs userDetails={details} />} />
						<Route path='/user' exact component={() => <Register userDetails={details} />} />

						{/* Job Directory */}
						<Route path='/jobs-directory' exact component={() => <JobDirectoryDashboard userDetails={JobDirectoryDashboard} />} />
						<Route path='/job-directory/:folderId' exact component={() => <JobDirectory userDetails={details} />} />
						<Route exact component={NotFound} />
					</Switch>
				</main>
			</Router>
		</>
	)
}

export default App
