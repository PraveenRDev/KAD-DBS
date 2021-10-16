import express from 'express'
const router = express.Router()
import { addJobtypesToDB, addCompanyToDB, addJobsToDB, addClientsToB } from '../controllers/dataManager.js'

router.route('/addJobtypesToDB').put(addJobtypesToDB)
router.route('/addCompanyToDB').put(addCompanyToDB)
router.route('/addJobsToDB').put(addJobsToDB)
router.route('/addClientsToB').put(addClientsToB)

export default router
