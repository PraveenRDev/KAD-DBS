import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table'
import { useSelector, useDispatch } from 'react-redux'
import { clearResults } from '../../+store/resultsSlice'
import Paginator from '../pagination'
import Loader from '../UI/Loader'
import Message from '../UI/Message'
import { Link } from 'react-router-dom'
import './style.scss'

const Results = () => {
	const results = useSelector((state) => state.result)
	const dispatch = useDispatch()
	const { loading, error, details } = results
	const [skip, setSkip] = useState(0)

	useEffect(() => {
		return () => {
			dispatch(clearResults())
		}
	}, [dispatch])

	return (
		<>
			{loading && <Loader />}
			{error && <Message variant='danger'>{error}</Message>}
			{details && (
				<>
					<div className='table-wrapper mb-2'>
						<Table striped bordered hover responsive className='results-table'>
							<thead className='table-dark'>
								<tr>
									{details.columnNames.map((name, i) => (
										<th key={i}>{name}</th>
									))}
								</tr>
							</thead>
							<tbody>
								{details.result.slice(skip, skip + 10).map((data) => (
									<tr key={data._id}>
										{details.columnNames.includes('Job Number') && (
											<td>
												<Link to={`job/${data._id}`} target='_blank'>
													{data.jobNumber}
												</Link>
											</td>
										)}
										{details.columnNames.includes('Job Type') && <td>{data.jobType}</td>}
										{details.columnNames.includes('Lots') && <td>{data.lots}</td>}
										{details.columnNames.includes('Block') && <td>{data.block}</td>}
										{details.columnNames.includes('Road Allowance') && <td>{data.roadAllowance}</td>}
										{details.columnNames.includes('Registered Plan No') && <td>{data.registeredPlanNumber}</td>}
										{details.columnNames.includes('Registry Office') && <td>{data.registryOffice}</td>}
										{details.columnNames.includes('City/Town') && <td>{data.city}</td>}
										{details.columnNames.includes('RP No') && <td>{data.rpNo}</td>}
										{details.columnNames.includes('Concession') && <td>{data.concession}</td>}
										{details.columnNames.includes('Range') && <td>{data.range}</td>}
										{details.columnNames.includes('Municipality') && <td>{data.municipality}</td>}
										{details.columnNames.includes('Street Number') && <td>{data.streetNumber}</td>}
										{details.columnNames.includes('Street Name') && <td>{data.streetName}</td>}
										{details.columnNames.includes('Street Type') && <td>{data.streetType}</td>}
										{details.columnNames.includes('Client') && <td>{data.clientName}</td>}
										{details.columnNames.includes('Company') && <td>{data.companyName}</td>}
										{details.columnNames.includes('Original File Name') && <td>{data.originalFileName}</td>}
										{details.columnNames.includes('Project') && <td>{data.project}</td>}
									</tr>
								))}
							</tbody>
						</Table>
					</div>
					<Paginator totalCount={details.result.length} itemsPerPage={10} setSkip={setSkip} />
				</>
			)}
		</>
	)
}

export default Results
