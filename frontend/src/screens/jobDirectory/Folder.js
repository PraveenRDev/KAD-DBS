import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder } from '@fortawesome/free-solid-svg-icons'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Folder = ({ folder }) => {
	return (
		<Button as={Link} to={`${folder._id}`} className='text-truncate w-100' variant='outline-light'>
			<FontAwesomeIcon icon={faFolder} className='me-2' />
			{folder.name}
		</Button>
	)
}

export default Folder
