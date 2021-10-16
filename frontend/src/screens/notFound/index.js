import Container from 'react-bootstrap/Container'

const NotFound = () => {
	return (
		<Container className='text-center p-4'>
			<h1 className='mb-4 text-info'>404 - Not Found!</h1>
			<p>Page you are looking for is not found..</p>
		</Container>
	)
}

export default NotFound
