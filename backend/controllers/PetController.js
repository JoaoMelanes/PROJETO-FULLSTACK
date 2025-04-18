// helpers
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const ObjectId = require('mongoose').Types.ObjectId
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

    static async getAll(req, res){

        const pets = await Pet.find().sort('-createdAt')

        res.status(200).json({
            pets: pets,
        })
    }

    static async myPets(req, res){

        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({"user._id": user._id}).sort('-createdAt')

        res.status(200).json({pets})
    }

    static async myAdoptions(req,res){

        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({"adopter._id": user._id}).sort('-createdAt')

        res.status(200).json({pets})
    }

    static async petDescripiton(req, res){

        const petId = req.params.id

        if(!ObjectId.isValid(petId)){
            res.status(422).json({message: 'Id invalido!'})
            return
        }

        const pet = await Pet.findOne({_id: petId})

        if(!pet){
            res.status(404).json({message: "Pet inexistente"})
        }

        try{
            res.status(200).json({pet})
        }catch(e){
            res.status(404).json({message: e})
            return
        }
    }

    static async petRemove(req, res){

        const petId = req.params.id

        if(!ObjectId.isValid(petId)){
            res.status(404).json({message: "Id invalido"})
        }

        const pet = await Pet.findById({_id: petId})

        if(!pet){
            res.status(404).json({message: "pet não existe"})
        }

        const token = getToken(req)
        const user = getUserByToken(token)

        if(pet.user._id.toString() !== user._id){
            res.status(422).json({message: "Houve um problema com sua solicitação!!, tente novamente mais tarde"})
        }
        
        try{
            res.status(200).json({message: `Pet removido id:${petId}`})
        }catch(e){
            res.status(404).json({message: e})
            return
        }
    }
}