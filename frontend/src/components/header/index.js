import React from 'react'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'
import { clearUser } from '../../+store/userSlice'

const Header = ({ userDetails = null }) => {
	const dispatch = useDispatch()
	const history = useHistory()

	const logout = () => {
		dispatch(clearUser())
		localStorage.removeItem('token')
		history.push('/')
	}

	return (
		<Navbar collapseOnSelect expand='lg' bg='dark' variant='dark'>
			<Container>
				<LinkContainer to={userDetails ? '/jobs' : ''}>
					<Navbar.Brand>KAD Lanka DB Solution</Navbar.Brand>
				</LinkContainer>
				{userDetails && (
					<>
						<Navbar.Toggle aria-controls='responsive-navbar-nav' />
						<Navbar.Collapse id='responsive-navbar-nav'>
							<Nav className='me-auto'>
								<LinkContainer to='/jobs'>
									<Nav.Link>All Jobs</Nav.Link>
								</LinkContainer>
								{!userDetails.isAdmin && (
									<LinkContainer to='/job'>
										<Nav.Link>Create New Job</Nav.Link>
									</LinkContainer>
								)}
								{userDetails.isAdmin && (
									<NavDropdown title='Operations' id='collasible-nav-dropdown'>
										<LinkContainer to='/job'>
											<NavDropdown.Item>Create New Job</NavDropdown.Item>
										</LinkContainer>
										<LinkContainer to='/job-operation'>
											<NavDropdown.Item>Delete Job</NavDropdown.Item>
										</LinkContainer>
										<NavDropdown.Divider />
										<LinkContainer to='/user'>
											<NavDropdown.Item>Create New User</NavDropdown.Item>
										</LinkContainer>
										{/* <LinkContainer to='/users'>
											<NavDropdown.Item>Delete User</NavDropdown.Item>
										</LinkContainer> */}
									</NavDropdown>
								)}
							</Nav>
							<Nav>
								<Nav.Link onClick={logout}>Logout</Nav.Link>
							</Nav>
						</Navbar.Collapse>
					</>
				)}
			</Container>
		</Navbar>
	)
}

export default Header
