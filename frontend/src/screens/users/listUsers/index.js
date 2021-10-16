import { useState, useEffect } from 'react'
import axios from 'axios'
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'
import Loader from '../../../components/UI/Loader'
import Message from '../../../components/UI/Message'
import Button from 'react-bootstrap/Button'
import Paginator from '../../../components/pagination'

const ListUsers = () => {
	const [users, setUsers] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)
	const [skip, setSkip] = useState(0)

	useEffect(() => {
		;(async () => {
			try {
				setLoading(true)
				setError(null)
				const config = {
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				}

				const { data } = await axios.get('/api/users', config)
				setLoading(false)
				setUsers(data)
			} catch (error) {
				setLoading(false)
				setError(error.response && error.response.data.message ? error.response.data.message : error.message)
			}
		})()
	}, [])

	const handleDelete = () => {}

	return (
		<Container>
			{loading && <Loader />}
			{error && <Message variant='danger'>{error}</Message>}
			{!loading && (
				<>
					<h1>All Users</h1>
					<Table>
						<thead className='table-dark'>
							<tr>
								<th className='text-center'>Username</th>
								<th className='text-center'>Admin Privileges</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{users &&
								users?.length &&
								users.slice(skip, skip + 10).map((user) => (
									<tr key={user._id}>
										<td className='text-center'>{user.username}</td>
										<td className='text-center'>{user.isAdmin ? 'yes' : 'No'}</td>
										<td>
											<Button variant='danger' onClick={handleDelete}>
												Delete
											</Button>
										</td>
									</tr>
								))}
						</tbody>
					</Table>
					<Paginator totalCount={users.length} itemsPerPage={10} setSkip={setSkip} />
				</>
			)}
		</Container>
	)
}

export default ListUsers
