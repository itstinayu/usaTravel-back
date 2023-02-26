import { Router } from 'express'
import content from '../middleware/content.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/upload.js'
import { jwt } from '../middleware/auth.js'
import { createGuide, getAllGuides, getGuide, getSellGuides, editGuide, deleteGuide } from '../controllers/guides.js'

const router = Router()

router.post('/', content('multipart/form-data'), jwt, admin, upload, createGuide)
router.get('/', getSellGuides)
router.get('/all', jwt, admin, getAllGuides)
router.get('/:id', getGuide)
router.patch('/:id', content('multipart/form-data'), jwt, admin, upload, editGuide)
router.patch('/delete/:id', content('application/json'), jwt, admin, deleteGuide)

export default router
