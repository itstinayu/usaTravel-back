import { Router } from 'express'
import content from '../middleware/content.js'
import { jwt } from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import { createOrder, getMyOrders, getAllOrders, deleteOrder } from '../controllers/orders.js'

const router = Router()

router.post('/', jwt, createOrder)
router.get('/', jwt, getMyOrders)
router.get('/all', jwt, admin, getAllOrders)
router.patch('/delete/:id', content('application/json'), jwt, admin, deleteOrder)

export default router
