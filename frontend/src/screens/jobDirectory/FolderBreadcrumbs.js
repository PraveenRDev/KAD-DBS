import React from 'react'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import { Link } from 'react-router-dom'

function FolderBreadcrumbs({ currentFolder }) {
	// const path = currentFolder.path
	return (
		<Breadcrumb className='flex-grow-1' listProps={{ className: 'bg-white pl-0  border-0 shadow-none' }}>
			{currentFolder &&
				currentFolder.path.map((folder, index) => (
					<Breadcrumb.Item
						key={index}
						linkAs={Link}
						className='text-truncate d-inline-block'
						style={{ maxWidth: '150px' }}
						linkProps={{
							to: {
								pathname: folder.folderId ? `/job-directory/${folder.folderId}` : `/job-directory/${currentFolder._id}`,
								state: { folder: { ...folder, path: currentFolder.path.slice(1, index) } },
							},
						}}
					>
						{folder.folderName}
					</Breadcrumb.Item>
				))}
			{currentFolder && (
				<Breadcrumb.Item className='text-truncate d-inline-block' style={{ maxWidth: '200px' }} active>
					{currentFolder.name}
				</Breadcrumb.Item>
			)}
		</Breadcrumb>
	)
}

export default FolderBreadcrumbs
