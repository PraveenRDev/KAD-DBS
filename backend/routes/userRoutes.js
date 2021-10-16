import express from 'express'
const router = express.Router()
import { authUser, listUsers, registerUser } from '../controllers/userController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

router.route('/').post(protect, admin, registerUser).get(protect, admin, listUsers)
router.post('/login', authUser)
router.get('/loginWithToken', protect, (req, res) => res.json(req.user))

export default router
