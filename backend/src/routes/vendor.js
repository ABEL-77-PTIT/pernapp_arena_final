import express from 'express'

const router = express.Router()
import Controller from '../controllers/vendor.js'

router.get('/count', Controller.count)
router.get('/', Controller.find)
router.get('/:id')
router.post('/', Controller.create)
router.put('/:id')
router.delete('/:id')

export default router
