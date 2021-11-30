import Container from 'react-bootstrap/Container'
import { useEffect } from 'react'
import AddFolderButton from './AddFolderButton'
import Folder from './Folder'
import { useFolder } from './hooks/useFolder'
import { useParams } from 'react-router-dom'
import FolderBreadcrumbs from './FolderBreadcrumbs'
import Loader from './../../components/UI/Loader'
import FileManager from './FileManager'
import { useHistory } from 'react-router-dom'

const JobDirectory = ({userDetails}) => {
	let history = useHistory()

	const { folderId } = useParams()
	const { loading, folder, childFolders } = useFolder(folderId)

	useEffect(() => {
		if (!localStorage.getItem('token')) {
			history.push('/')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<>
			{loading && <Loader />}
			{!loading && (
				<Container>
					<div className='d-flex align-items-center'>
						<FolderBreadcrumbs currentFolder={folder}></FolderBreadcrumbs>
						<AddFolderButton currentFolder={folder} isAdmin={userDetails && userDetails.isAdmin}/>
					</div>
					<>
						{childFolders.length > 0 && (
							<div className='d-flex flex-wrap'>
								{childFolders.map((childFolder) => (
									<div key={childFolder._id} style={{ maxWidth: '250px' }} className='p-2'>
										<Folder folder={childFolder}></Folder>
									</div>
								))}
							</div>
						)}
					</>
					<hr />
					<FileManager currentFolder={folder} />
				</Container>
			)}
		</>
	)
}

export default JobDirectory
