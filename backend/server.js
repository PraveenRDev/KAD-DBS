import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import { notFound, errorHandler } from './middleware/errormiddleware.js'
import path from 'path'
import userRoutes from './routes/userRoutes.js'
import jobsRoutes from './routes/jobsRoute.js'
import jobDirectory from './routes/jobDirectory.js'
// import dataManagerRoutes from './routes/dataManagerRoute.js'

// config file
dotenv.config()

// connect to db
connectDB()

// create express application
const app = express()

app.use(express.json())

app.use('/api/users', userRoutes)
// app.use('/api/dm', dataManagerRoutes)
app.use('/api/jobs', jobsRoutes)
app.use('/api/jobDirectory', jobDirectory)

const __dirname = path.resolve()
if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '/frontend/build')))

	app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html')))
} else {
	app.get('/', (req, res) => {
		res.send('API is running....')
	})
}

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))
