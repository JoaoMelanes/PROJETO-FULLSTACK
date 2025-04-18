// helpers
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
// model
const Pet = require('../models/Pet')

module.exports = class PetController{
    static async create(req, res){

        const {name, age, weight, color} = req.body
        const images = req.files

        console.log(images)
        const available = true

        // uploads images


        // validation
        if(!name){
            res.status(422).json({message: "O nome é obrigatorio"})
            return
        }
        if(!age){
            res.status(422).json({message: "A idade é obrigatorio"})
            return
        }
        if(!weight){
            res.status(422).json({message: "O peso é obrigatorio"})
            return
        }
        if(!color){
            res.status(422).json({message: "A cor é obrigatorio"})
            return
        }
        if(images.length === 0){
            res.status(422).json({message: "A imgem é obrigatorio"})
            return
        }

        console.log(images)

        // get pet owner
        const token = getToken(req)
        const user = await getUserByToken(token)

        // create a pet
        const pet = new Pet({
            name,
            age,
            weight,
            color,
            available,
            images: [],
            user: {
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone
            },

        })

        images.map((image) => {
            pet.images.push(image.filename)
        })

        console.log(images)

        try{

            const newPet = await pet.save()
            res.status(201).json({message: 'Pet cadastrado com sucesso!', newPet})

        }catch(e){
            res.status(500).json({message: e})
        }
    }
}