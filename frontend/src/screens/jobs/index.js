import React from 'react'
import Container from 'react-bootstrap/Container'
import Accordion from 'react-bootstrap/Accordion'
import Filter from '../../components/filter'
import Results from '../../components/results'

const Jobs = ({ userDetails }) => {
	return (
		<>
			<Container>
				<Accordion defaultActiveKey='0' className='mb-3'>
					<Accordion.Item eventKey='0'>
						<Accordion.Header>Advanced Search</Accordion.Header>
						<Accordion.Body>
							<Filter />
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>
			</Container>
			<Container fluid className='px-4'>
				<Results isAdmin={userDetails && userDetails.isAdmin} />
			</Container>
		</>
	)
}

export default Jobs
