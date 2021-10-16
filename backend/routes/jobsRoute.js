import express from 'express'
const router = express.Router()
import { getDropDownData, filterResults, createJob, getJobByNumber, deleteJob, updateJob, getJobByJobId } from '../controllers/jobController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

router.route('/getDropDownData').get(protect, getDropDownData)
router.route('/filterResults').post(protect, filterResults)
router.route('/createJob').post(protect, createJob)

// operations
router.route('/deleteJob').post(protect, admin, deleteJob)
router.route('/getJobByNumber').post(protect, getJobByNumber)
router.route('/getJobByJobId').post(protect, getJobByJobId)
router.route('/updateJob').post(protect, updateJob)

export default router
