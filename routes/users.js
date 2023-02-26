import { Router } from 'express'
import * as auth from '../middleware/auth.js'
import content from '../middleware/content.js'
import { register, login, logout, extend, getUser, editCart, getCart, getAllUser, editArchive, getArchive, editProductArchive, getProductArchive } from '../controllers/users.js'

const router = Router()

router.post('/', content('application/json'), register)
router.post('/login', content('application/json'), auth.login, login)
router.delete('/logout', auth.jwt, logout)
router.patch('/extend', auth.jwt, extend)
router.get('/me', auth.jwt, getUser)
router.post('/cart', content('application/json'), auth.jwt, editCart)
router.get('/cart', auth.jwt, getCart)
router.get('/allUser', auth.jwt, getAllUser)
router.post('/archive', auth.jwt, editArchive)
router.get('/archive', auth.jwt, getArchive)
router.post('/productArchive', auth.jwt, editProductArchive)
router.get('/productArchive', auth.jwt, getProductArchive)

export default router
