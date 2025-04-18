const router = require('express').Router()
const PetController = require('../controllers/PetController')

// middlewares
const verifyToken = require('../helpers/verify-token')
const {imageUpload} = require('../helpers/image-upload')

router.post('/create',verifyToken, imageUpload.array("images"), PetController.create)
router.get('/', PetController.getAll)
router.get('/mypets', verifyToken, PetController.myPets)
router.get('/myadoptions', verifyToken, PetController.myAdoptions)
router.get('/:id', PetController.petDescripiton)
router.delete('/remove/:id', verifyToken, PetController.petRemove)
router.patch('/edit/:id', verifyToken, imageUpload.array("images"), PetController.petEdit)


module.exports = router