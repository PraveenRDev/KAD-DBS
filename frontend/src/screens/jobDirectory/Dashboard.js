import { useState, useEffect } from 'react'
import axios from 'axios'

import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder } from '@fortawesome/free-solid-svg-icons'

import { Link, useHistory } from 'react-router-dom'
import Loader from '../../components/UI/Loader'
import Paginator from '../../components/pagination'

const JobDirectoryDashboard = () => {
	let history = useHistory()

	const [jobFolders, setJobFolders] = useState(null)

	const [loading, setLoading] = useState(false)
	const [skip, setSkip] = useState(0)

	useEffect(() => {
		if (!localStorage.getItem('token')) {
			history.push('/')
		} else {
			;(async () => {
				try {
					setLoading(true)
					const config = {
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${localStorage.getItem('token')}`,
						},
					}
					const response = await axios.get('/api/jobDirectory', config)
					if (response && response.data) {
						setLoading(false)
						setJobFolders(response.data)
					}
				} catch (error) {
					history.push('/')
				}
			})()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<>
			{loading && <Loader />}
			{!loading && jobFolders && (
				<Container>
					<h1>Job Directory</h1>

					{jobFolders.slice(skip, skip + 10).map((folder) => (
						<Button as={Link} to={`/job-directory/${folder._id}`} className='text-truncate w-100 mb-2' variant='outline-light'>
							<FontAwesomeIcon icon={faFolder} className='me-2' />
							{folder.name}
						</Button>
					))}
					<Paginator totalCount={jobFolders.length} itemsPerPage={10} setSkip={setSkip} />
				</Container>
			)}
		</>
	)
}

export default JobDirectoryDashboard
