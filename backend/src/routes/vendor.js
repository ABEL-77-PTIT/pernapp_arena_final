import express from 'express'

const router = express.Router()
import Controller from '../controllers/vendor.js'

router.get('/count', Controller.count)
router.get('/', Controller.find)
router.get('/:id', Controller.findById)
router.post('/', Controller.create)
router.put('/:id', Controller.update)
router.delete('/:id', Controller.delete)

export default router
