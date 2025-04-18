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
router.post('/remove/:id', verifyToken, PetController.petRemove)


module.exports = router