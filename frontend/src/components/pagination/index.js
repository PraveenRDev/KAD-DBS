import React, { useState, useEffect } from 'react'
import Pagination from 'react-bootstrap/Pagination'

const Paginator = ({ totalCount, itemsPerPage, setSkip }) => {
	const [currentPage, setCurrentPage] = useState(1)

	useEffect(() => {
		setSkip((currentPage - 1) * itemsPerPage)
	}, [currentPage, itemsPerPage, setSkip])

	return (
		<Pagination className='d-flex justify-content-end'>
			{currentPage > 1 && (
				<Pagination.Item key={0} onClick={() => setCurrentPage(currentPage - 1)}>
					{currentPage - 1}
				</Pagination.Item>
			)}
			{totalCount > itemsPerPage && (
				<>
					<Pagination.Item active key={1}>
						{currentPage}
					</Pagination.Item>
					{totalCount > currentPage * itemsPerPage && (
						<Pagination.Item key={2} onClick={() => setCurrentPage(currentPage + 1)}>
							{currentPage + 1}
						</Pagination.Item>
					)}
				</>
			)}
		</Pagination>
	)
}

export default Paginator
