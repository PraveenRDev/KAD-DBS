import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import './style.scss'
import Loader from '../UI/Loader'
import Select from 'react-select'
import { fetchResults, fetchResultsSuccess, fetchResultsFailure } from '../../+store/resultsSlice'
import queryString from 'query-string'
import { COLUMN_NAMES, DEFAULT_VALUE } from './data'
import { useJsonToCsv } from 'react-json-csv'

const Filter = () => {
	let history = useHistory()
	const { saveAsCsv } = useJsonToCsv()
	const dispatch = useDispatch()
	const { loading: loadingResults, details } = useSelector((state) => state.result)

	const [filters, setFilter] = useState(DEFAULT_VALUE)
	const [sort, setSort] = useState('jobNumber')
	const [sortBy, setSortBy] = useState('1')
	const [loading, setLoading] = useState(false)

	const [dropDowns, setDropDowns] = useState({
		jobTypes: [],
		cityTowns: [],
		municipalities: [],
		streetTypes: [],
		clients: [],
		companies: [],
	})

	const handleTextChange = (e) =>
		setFilter({
			...filters,
			[e.target.name]: {
				...filters[e.target.name],
				value: e.target.value,
			},
		})

	const handleCheckboxChange = (e) =>
		setFilter({
			...filters,
			[e.target.name]: {
				...filters[e.target.name],
				show: e.target.checked,
			},
		})

	const handleRadioChange = (e) => setSort(e.target.value)

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
					const response = await axios.get('/api/jobs/getDropDownData', config)
					if (response && response.data) {
						setLoading(false)
						setDropDowns({
							jobTypes: response.data.jobTypes,
							cityTowns: response.data.city,
							municipalities: response.data.municipality,
							streetTypes: response.data.streetType,
							clients: response.data.clients,
							companies: response.data.companies,
						})
					}
				} catch (error) {
					history.push('/')
				}
			})()
		}
	}, [history])

	useEffect(() => {
		if (history.location.search) {
			const parsed = queryString.parse(history.location.search)
			if (parsed) {
				const decodedFilters = JSON.parse(decodeURIComponent(parsed.filters))
				const decodedSort = JSON.parse(decodeURIComponent(parsed.sort))
				const decodedSortBy = JSON.parse(decodeURIComponent(parsed.sortBy))

				setFilter(decodedFilters)
				setSort(decodedSort)
				setSortBy(decodedSortBy)
			}
		}
	}, [history.location.search])

	const resetAll = () => {
		history.push(`/jobs`)
		setSort('jobNumber')
		setFilter(DEFAULT_VALUE)
	}

	const handleMultiSelectDropDown = (selectedValues, dropdownName) => {
		setFilter({
			...filters,
			[dropdownName]: {
				...filters[dropdownName],
				value: selectedValues,
			},
		})
	}

	const downloadResults = () => {
		const filename = `KAD LANKA-${new Date()}`
		let fields = {}
		details.columnNames.forEach((name) => {
			fields[COLUMN_NAMES[name]] = name
		})
		const data = details.result
		saveAsCsv({ data, fields, filename })
	}

	const handleSearch = async () => {
		const encodedFilters = encodeURIComponent(JSON.stringify(filters))
		const encodedsort = encodeURIComponent(JSON.stringify(sort))
		const encodedsortBy = encodeURIComponent(JSON.stringify(sortBy))

		history.push(`?filters=${encodedFilters}&sort=${encodedsort}&sortBy=${encodedsortBy}`)
		try {
			dispatch(fetchResults())
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			}

			const { data } = await axios.post('/api/jobs/filterResults', { filters, sort, sortBy }, config)
			dispatch(fetchResultsSuccess(data))
		} catch (error) {
			dispatch(fetchResultsFailure(error.response && error.response.data.message ? error.response.data.message : error.message))
		}
	}

	return (
		<>
			{loading && <Loader />}
			{!loading && (
				<Form className='filter-name'>
					<Row>
						<Col xs={12} md={4}>
							<Form.Group className='mb-3'>
								<Row>
									<Col xs={7} md={4} lg={7}>
										<Form.Label>Job Number</Form.Label>
									</Col>
									<Col xs={2} md={4} lg={2}>
										<Form.Check
											disabled={loadingResults}
											inline
											label='Sort'
											type='radio'
											name='sortBy'
											value='jobNumber'
											checked={sort === 'jobNumber'}
											onChange={handleRadioChange}
										/>
									</Col>
									<Col xs={2} md={4} lg={2}>
										<Form.Check
											disabled={loadingResults}
											inline
											label='Show'
											type='checkbox'
											name='jobNumber'
											checked={filters.jobNumber.show}
											onChange={handleCheckboxChange}
										/>
									</Col>
								</Row>
								<Form.Control
									disabled={loadingResults}
									size='md'
									type='text'
									name='jobNumber'
									value={filters.jobNumber.value}
									onChange={handleTextChange}
									placeholder='Separate by Semicolan'
									autoComplete='off'
								/>
							</Form.Group>
							<Form.Group className='mb-3'>
								<Row>
									<Col xs={7} md={4} lg={7}>
										<Form.Label>Job Type</Form.Label>
									</Col>
									<Col xs={2} md={4} lg={2}>
										<Form.Check
											disabled={loadingResults}
											inline
											label='Sort'
											type='radio'
											name='sortBy'
											value='jobType'
											checked={sort === 'jobType'}
											onChange={handleRadioChange}
										/>
									</Col>
									<Col xs={2} md={4} lg={2}>
										<Form.Check
											disabled={loadingResults}
											inline
											label='Show'
											type='checkbox'
											name='jobTypes'
											checked={filters.jobTypes.show}
											onChange={handleCheckboxChange}
										/>
									</Col>
								</Row>
								<Select
									onChange={(e) => handleMultiSelectDropDown(e, 'jobTypes')}
									options={dropDowns.jobTypes.map((type) => ({ value: type._id, label: type.jobType }))}
									isMulti
									closeMenuOnSelect={false}
									value={filters.jobTypes.value}
									maxMenuHeight={200}
									isDisabled={loadingResults}
								/>
							</Form.Group>
							<Form.Group className='mb-3'>
								<Row>
									<Col xs={7} md={4} lg={7}>
										<Form.Label>Lots</Form.Label>
									</Col>
									<Col xs={2} md={4} lg={2}>
										<Form.Check
											disabled={loadingResults}
											inline
											label='Sort'
											type='radio'
											name='sortBy'
											value='lots'
											checked={sort === 'lots'}
											onChange={handleRadioChange}
										/>
									</Col>
									<Col xs={2} md={4} lg={2}>
										<Form.Check
											disabled={loadingResults}
											inline
											label='Show'
											type='checkbox'
											name='lots'
											checked={filters.lots.show}
											onChange={handleCheckboxChange}
										/>
									</Col>
								</Row>
								<Form.Control
									disabled={loadingResults}
									size='md'
									type='text'
									name='lots'
									value={filters.lots.value}
									onChange={handleTextChange}
									placeholder='Separate by Semicolan'
									autoComplete='off'
								/>
							</Form.Group>
							<Form.Group className='mb-3'>
								<Row>
									<Col xs={7} md={4} lg={7}>
										<Form.Label>Block</Form.Label>
									</Col>
									<Col xs={2} md={4} lg={2}>
										<Form.Check
											disabled={loadingResults}
											inline
											label='Sort'
											type='radio'
											name='sortBy'
											value='block'
											checked={sort === 'block'}
											onChange={handleRadioChange}
										/>
									</Col>
									<Col xs={2} md={4} lg={2}>
										<Form.Check
											disabled={loadingResults}
											inline
											label='Show'
											type='checkbox'
											name='block'
											checked={filters.block.show}
											onChange={handleCheckboxChange}
										/>
									</Col>
								</Row>
								<Form.Control
									disabled={loadingResults}
									size='md'
									type='text'
									name='block'
									value={filters.block.value}
									onChange={handleTextChange}
									placeholder='Separate by Semicolan'
									autoComplete='off'
								/>
							</Form.Group>
							<Form.Group className='mb-3'>
								<Row>
									<Col xs={7} md={4} lg={7}>
										<Form.Label>Road Allowance</Form.Label>
									</Col>
									<Col xs={2} md={4} lg={2}>
										<Form.Check
											disabled={loadingResults}
											inline
											label='Sort'
											type='radio'
											name='sortBy'
											value='roadAllowance'
											checked={sort === 'roadAllowance'}
											onChange={handleRadioChange}
										/>
									</Col>
									<Col xs={2} md={4} lg={2}>
										<Form.Check
											disabled={loadingResults}
											inline
											label='Show'
											type='checkbox'
											name='roadAllowance'
											checked={filters.roadAllowance.show}
											onChange={handleCheckboxChange}
										/>
									</Col>
								</Row>
								<Form.Control
									disabled={loadingResults}
									size='md'
									type='text'
									name='roadAllowance'
									value={filters.roadAllowance.value}
									onChange={handleTextChange}
									placeholder='Separate by Semicolan'
									autoComplete='off'
								/>
							</Form.Group>
							<Form.Group className='mb-3'>
								<Row>
									<Col xs={7} md={4} lg={7}>
										<Form.Label>Registered Plan No</Form.Label>
									</Col>
									<Col xs={2} md={4} lg={2}>
										<Form.Check
											disabled={loadingResults}
											inline
											label='Sort'
											type='radio'
											name='sortBy'
											value='registeredPlanNumber'
											checked={sort === 'registeredPlanNumber'}
											onChange={handleRadioChange}
										/>
									</Col>
									<Col xs={2} md={4} lg={2}>
										<Form.Check
											disabled={loadingResults}
											inline
											label='Show'
											type='checkbox'
											name='registeredPlanNo'
											checked={filters.registeredPlanNo.show}
											onChange={handleCheckboxChange}
										/>
									</Col>
								</Row>
								<Form.Control
									disabled={loadingResults}
									size='md'
									type='text'
									name='registeredPlanNo'
									value={filters.registeredPlanNo.value}
									onChange={handleTextChange}
									placeholder='Separate by Semicolan'
									autoComplete='off'
								/>
							</Form.Group>
							<Form.Group className='mb-3'>
								<Row>
									<Col xs={7} md={4} lg={7}>
										<Form.Label>Registry Office</Form.Label>
									</Col>
									<Col xs={2} md={4} lg={2}>
										<Form.Check
											disabled={loadingResults}
											inline
											label='Sort'
											type='radio'
											name='sortBy'
											value='registryOffice'
											checked={sort === 'registryOffice'}
											onChange={handleRadioChange}
										/>
									</Col>
									<Col xs={2} md={4} lg={2}>
										<Form.Check
											disabled={loadingResults}
											inline
											label='Show'
											type='checkbox'
											name='registryOffice'
											checked={filters.registryOffice.show}
											onChange={handleCheckboxChange}
										/>
									</Col>
								</Row>
								<Form.Control
									disabled={loadingResults}
									size='md'
									type='text'
									name='registryOffice'
									value={filters.registryOffice.value}
									onChange={handleTextChange}
									placeholder='Separate by Semicolan'
									autoComplete='off'
								/>
							</Form.Group>
							<Form.Group className='mb-3'>
								<Row>
									<Col xs={7} md={4} lg={7}>
										<Form.Label>Range</Form.Label>
									</Col>
									<Col xs={2} md={4} lg={2}>
										<Form.Check
											disabled={loadingResults}
											inline
											label='Sort'
											type='radio'
											name='sortBy'
											value='range'
											checked={sort === 'range'}
											onChange={handleRadioChange}
										/>
									</Col>
									<Col xs={2} md={4} lg={2}>
										<Form.Check
											disabled={loadingResults}
											inline
											label='Show'
											type='checkbox'
											name='range'
											checked={filters.range.show}
											onChange={handleCheckboxChange}
										/>
									</Col>
								</Row>
								<Form.Control
									disabled={loadingResults}
									size='md'
									type='text'
									name='range'
									value={filters.range.value}
									onChange={handleTextChange}
									placeholder='Separate by Semicolan'
									autoComplete='off'
								/>
							</Form.Group>
						</Col>
						<Col xs={12} md={4}>
							<Form.Group className='mb-3'>
								<Row>
									<Col xs={7} md={4} lg={7}>
										<Form.Label>City/Town</Form.Label>
									</Col>
									<Col xs={2} md={4} lg={2}>
										<Form.Check
											disabled={loadingResults}
											inline
											label='Sort'
											type='radio'
											name='sortBy'
											value='city'
											checked={sort === 'city'}
											onChange={handleRadioChange}
										/>
									</Col>
									<Col xs={2} md={4} lg={2}>
										<Form.Check
											disabled={loadingResults}
											inline
											label='Show'
											type='checkbox'
											name='cityTown'
											checked={filters.cityTown.show}
											onChange={handleCheckboxChange}
										/>
									</Col>
								</Row>
								<Select
									onChange={(e) => handleMultiSelectDropDown(e, 'cityTown')}
									options={dropDowns.cityTowns.map((city) => ({ value: city, label: city }))}
									isMulti
									closeMenuOnSelect={false}
									value={filters.cityTown.value}
									maxMenuHeight={200}
									isDisabled={loadingResults}
								/>
							</Form.Group>
							<Form.Group className='mb-3'>
								<Row>
									<Col xs={7} md={4} lg={7}>
										<Form.Label>RP No</Form.Label>
									</Col>
									<Col xs={2} md={4} lg={2}>
										<Form.Check
											disabled={loadingResults}
											inline
											label='Sort'
											type='radio'
											name='sortBy'
											value='rpNo'
											checked={sort === 'rpNo'}
											onChange={handleRadioChange}
										/>
									</Col>
									<Col xs={2} md={4} lg={2}>
										<Form.Check
											disabled={loadingResults}
											inline
											label='Show'
											type='checkbox'
											name='rpNo'
											checked={filters.rpNo.show}
											onChange={handleCheckboxChange}
										/>
									</Col>
								</Row>
								<Form.Control
									disabled={loadingResults}
									size='md'
									type='text'
									name='rpNo'
									value={filters.rpNo.value}
									onChange={handleTextChange}
									placeholder='Separate by Semicolan'
									autoComplete='off'
								/>
							</Form.Group>
							<Form.Group className='mb-3'>
								<Row>
									<Col xs={7} md={4} lg={7}>
										<Form.Label>Concession</Form.Label>
									</Col>
									<Col xs={2} md={4} lg={2}>
										<Form.Check
											disabled={loadingResults}
											inline
											label='Sort'
											type='radio'
											name='sortBy'
											value='concession'
											checked={sort === 'concession'}
											onChange={handleRadioChange}
										/>
									</Col>
									<Col xs={2} md={4} lg={2}>
										<Form.Check
											disabled={loadingResults}
											inline
											label='Show'
											type='checkbox'
											name='concession'
											checked={filters.concession.show}
											onChange={handleCheckboxChange}
										/>
									</Col>
								</Row>
								<Form.Control
									disabled={loadingResults}
									size='md'
									type='text'
									name='concession'
									value={filters.concession.value}
									onChange={handleTextChange}
									placeholder='Separate by Semicolan'
									autoComplete='off'
								/>
							</Form.Group>
							<Form.Group className='mb-3'>
								<Row>
									<Col xs={7} md={4} lg={7}>
										<Form.Label>Municipality</Form.Label>
									</Col>
									<Col xs={2} md={4} lg={2}>
										<Form.Check
											disabled={loadingResults}
											inline
											label='Sort'
											type='radio'
											name='sortBy'
											value='municipality'
											checked={sort === 'municipality'}
											onChange={handleRadioChange}
										/>
									</Col>
									<Col xs={2} md={4} lg={2}>
										<Form.Check
											disabled={loadingResults}
											inline
											label='Show'
											type='checkbox'
											name='municipality'
											checked={filters.municipality.show}
											onChange={handleCheckboxChange}
										/>
									</Col>
								</Row>
								<Select
									onChange={(e) => handleMultiSelectDropDown(e, 'municipality')}
									options={dropDowns.municipalities.map((municipality) => ({ value: municipality, label: municipality }))}
									isMulti
									closeMenuOnSelect={false}
									value={filters.municipality.value}
									maxMenuHeight={200}
									isDisabled={loadingResults}
								/>
							</Form.Group>
							<Form.Group className='mb-3'>
								<Row>
									<Col xs={7} md={4} lg={7}>
										<Form.Label>Street Number</Form.Label>
									</Col>
									<Col xs={2} md={4} lg={2}>
										<Form.Check
											disabled={loadingResults}
											inline
											label='Sort'
											type='radio'
											name='sortBy'
											value='streetNumber'
											checked={sort === 'streetNumber'}
											onChange={handleRadioChange}
										/>
									</Col>
									<Col xs={2} md={4} lg={2}>
										<Form.Check
											disabled={loadingResults}
											inline
											label='Show'
											type='checkbox'
											name='streetNumber'
											checked={filters.streetNumber.show}
											onChange={handleCheckboxChange}
										/>
									</Col>
								</Row>
								<Form.Control
									disabled={loadingResults}
									size='md'
									type='text'
									name='streetNumber'
									value={filters.streetNumber.value}
									onChange={handleTextChange}
									placeholder='Separate by Semicolan'
									autoComplete='off'
								/>
							</Form.Group>
							<Form.Group className='mb-3'>
								<Row>
									<Col xs={7} md={4} lg={7}>
										<Form.Label>Street Name</Form.Label>
									</Col>
									<Col xs={2} md={4} lg={2}>
										<Form.Check
											disabled={loadingResults}
											inline
											label='Sort'
											type='radio'
											name='sortBy'
											value='streetName'
											checked={sort === 'streetName'}
											onChange={handleRadioChange}
										/>
									</Col>
									<Col xs={2} md={4} lg={2}>
										<Form.Check
											disabled={loadingResults}
											inline
											label='Show'
											type='checkbox'
											name='streetName'
											checked={filters.streetName.show}
											onChange={handleCheckboxChange}
										/>
									</Col>
								</Row>
								<Form.Control
									disabled={loadingResults}
									size='md'
									type='text'
									name='streetName'
									value={filters.streetName.value}
									onChange={handleTextChange}
									placeholder='Separate by Semicolan'
									autoComplete='off'
								/>
							</Form.Group>
							<Form.Group className='mb-3'>
								<Row>
									<Col xs={7} md={4} lg={7}>
										<Form.Label>Street Type</Form.Label>
									</Col>
									<Col xs={2} md={4} lg={2}>
										<Form.Check
											disabled={loadingResults}
											inline
											label='Sort'
											type='radio'
											name='sortBy'
											value='streetType'
											checked={sort === 'streetType'}
											onChange={handleRadioChange}
										/>
									</Col>
									<Col xs={2} md={4} lg={2}>
										<Form.Check
											disabled={loadingResults}
											inline
											label='Show'
											type='checkbox'
											name='streetType'
											checked={filters.streetType.show}
											onChange={handleCheckboxChange}
										/>
									</Col>
								</Row>
								<Select
									onChange={(e) => handleMultiSelectDropDown(e, 'streetType')}
									options={dropDowns.streetTypes.map((streetType) => ({ value: streetType, label: streetType }))}
									isMulti
									closeMenuOnSelect={false}
									value={filters.streetType.value}
									maxMenuHeight={200}
									isDisabled={loadingResults}
								/>
							</Form.Group>
							<Form.Group className='mb-3'>
								<Row>
									<Col xs={7} md={4} lg={7}>
										<Form.Label>Clients</Form.Label>
									</Col>
									<Col xs={2} md={4} lg={2}>
										<Form.Check
											disabled={loadingResults}
											inline
											label='Sort'
											type='radio'
											name='sortBy'
											value='clientName'
											checked={sort === 'clientName'}
											onChange={handleRadioChange}
										/>
									</Col>
									<Col xs={2} md={4} lg={2}>
										<Form.Check
											disabled={loadingResults}
											inline
											label='Show'
											type='checkbox'
											name='client'
											checked={filters.client.show}
											onChange={handleCheckboxChange}
										/>
									</Col>
								</Row>
								<Select
									onChange={(e) => handleMultiSelectDropDown(e, 'client')}
									options={dropDowns.clients.map((client) => ({ value: client._id, label: client.clientName }))}
									isMulti
									closeMenuOnSelect={false}
									value={filters.client.value}
									maxMenuHeight={200}
									isDisabled={loadingResults}
								/>
							</Form.Group>
						</Col>
						<Col xs={12} md={4}>
							<Form.Group className='mb-3'>
								<Row>
									<Col xs={7} md={4} lg={7}>
										<Form.Label>Companies</Form.Label>
									</Col>
									<Col xs={2} md={4} lg={2}>
										<Form.Check
											disabled={loadingResults}
											inline
											label='Sort'
											type='radio'
											name='sortBy'
											value='companyName'
											checked={sort === 'companyName'}
											onChange={handleRadioChange}
										/>
									</Col>
									<Col xs={2} md={4} lg={2}>
										<Form.Check
											disabled={loadingResults}
											inline
											label='Show'
											type='checkbox'
											name='company'
											checked={filters.company.show}
											onChange={handleCheckboxChange}
										/>
									</Col>
								</Row>
								<Select
									onChange={(e) => handleMultiSelectDropDown(e, 'company')}
									options={dropDowns.companies.map((company) => ({ value: company._id, label: company.companyName }))}
									isMulti
									closeMenuOnSelect={false}
									value={filters.company.value}
									maxMenuHeight={200}
									isDisabled={loadingResults}
								/>
							</Form.Group>
							<Form.Group className='mb-3'>
								<Row>
									<Col xs={7} md={4} lg={7}>
										<Form.Label>Original File Name</Form.Label>
									</Col>
									<Col xs={2} md={4} lg={2}>
										<Form.Check
											disabled={loadingResults}
											inline
											label='Sort'
											type='radio'
											name='sortBy'
											value='originalFileName'
											checked={sort === 'originalFileName'}
											onChange={handleRadioChange}
										/>
									</Col>
									<Col xs={2} md={4} lg={2}>
										<Form.Check
											disabled={loadingResults}
											inline
											label='Show'
											type='checkbox'
											name='originalFileName'
											checked={filters.originalFileName.show}
											onChange={handleCheckboxChange}
										/>
									</Col>
								</Row>
								<Form.Control
									disabled={loadingResults}
									size='md'
									type='text'
									name='originalFileName'
									value={filters.originalFileName.value}
									onChange={handleTextChange}
									placeholder='Separate by Semicolan'
									autoComplete='off'
								/>
							</Form.Group>
							<Form.Group className='mb-3'>
								<Row>
									<Col xs={7} md={4} lg={7}>
										<Form.Label>Project</Form.Label>
									</Col>
									<Col xs={2} md={4} lg={2}>
										<Form.Check
											disabled={loadingResults}
											inline
											label='Sort'
											type='radio'
											name='sortBy'
											value='project'
											checked={sort === 'project'}
											onChange={handleRadioChange}
										/>
									</Col>
									<Col xs={2} md={4} lg={2}>
										<Form.Check
											disabled={loadingResults}
											inline
											label='Show'
											type='checkbox'
											name='project'
											checked={filters.project.show}
											onChange={handleCheckboxChange}
										/>
									</Col>
								</Row>
								<Form.Control
									disabled={loadingResults}
									size='md'
									type='text'
									name='project'
									value={filters.project.value}
									onChange={handleTextChange}
									placeholder='Separate by Semicolan'
									autoComplete='off'
								/>
							</Form.Group>
							<div className='border-bottom'></div>
							<div className='p-4'>
								<Form.Group className='mb-3'>
									<Col xs={7} md={4} lg={7}>
										<Form.Label>Sort By</Form.Label>
									</Col>
									<Col xs={2} md={4} lg={2}>
										<Form.Check
											disabled={loadingResults}
											inline
											label='Ascending'
											type='radio'
											name='overAllSortBy'
											value='1'
											checked={sortBy === '1'}
											onChange={(e) => setSortBy(e.target.value)}
										/>
										<Form.Check
											disabled={loadingResults}
											inline
											label='Descending'
											type='radio'
											name='overAllSortBy'
											value='-1'
											checked={sortBy === '-1'}
											onChange={(e) => setSortBy(e.target.value)}
										/>
									</Col>
								</Form.Group>
								<div className='d-grid gap-2'>
									<Button disabled={loadingResults} variant='primary' size='lg' onClick={handleSearch}>
										{loadingResults ? 'Searching..' : 'Search'}
									</Button>
									<Button
										disabled={loadingResults || !details || (details && details.result && details.result.length === 0)}
										variant='outline-success'
										size='lg'
										onClick={downloadResults}
									>
										Download
									</Button>
									<Button disabled={loadingResults} variant='secondary' size='lg' onClick={resetAll}>
										Clear All
									</Button>
								</div>
							</div>
						</Col>
					</Row>
				</Form>
			)}
		</>
	)
}

export default Filter
