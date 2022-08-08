import express from 'express'

const router = express.Router()
import Controller from '../controllers/vendor.js'
import MulterUpload from '../connector/multer/index.js'
import Validator from '../validator/vendor.js'

router.get('/count', Controller.count)
router.get('/', Controller.find)
router.get('/:id', Controller.findById)
router.post('/', MulterUpload.none(), Validator.create, Controller.create)
router.put('/:id', MulterUpload.none(), Validator.update, Controller.update)
router.delete('/:id', Controller.delete)

export default router
