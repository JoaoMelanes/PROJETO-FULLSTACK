const { model } = require('mongoose')
const multer = require('multer')
const path = require('path')

// Destination to store the image 
const imageStorage = multer.diskStorage({
    destination: function(req, file, cb){
        let folder = ""

        if(req.baseUrl.includes("users")){
            folder = "users"
        } else if(req.baseUrl.includes("pets")){
            folder = "pets"
        }

        cb(null, `public/images/${folder}`)
    },
    filename: function (req, file, cb){
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const imageUpload = multer({
    storage: imageStorage,
    fileFilter: function(req, file, cb){
        if(!file.originalname.match(/\.(png|jpg)$/)){
            return cb(new Error("Por favor, envie apenas jpg ou png!"))
        }
        cb(undefined, true)
    }


})

module.exports = {imageUpload}