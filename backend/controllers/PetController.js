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
            return
        }

        const pet = await Pet.findById({_id: petId})

        if(!pet){
            res.status(404).json({message: "pet não existe"})
            return
        }

        const token = getToken(req)
        const user = await getUserByToken(token)

        if(pet.user._id.toString() !== user._id.toString()){
            res.status(422).json({message: "Houve um problema com sua solicitação!!, tente novamente mais tarde"})
            return
        }
        
        try{
            await Pet.findByIdAndDelete(petId)
            res.status(200).json({message: `Pet removido id:${petId}`})
        }catch(e){
            res.status(404).json({message: e})
            return
        }
    }

    static async petEdit(req, res){

        const petId = req.params.id

        if(!ObjectId.isValid(petId)){
            res.status(404).json({message: "Id invalido"})
            return
        }

        const {name, age, weight, color, available} = req.body

        const images = req.files

        const updatedDate = {}

        const pet = await Pet.findOne({_id: petId})

        if(!pet){
            res.status(422).json({message: "Pet não existe"})
            return
        }

        const token = getToken(req)
        const user = await getUserByToken(token)

        if(pet.user._id.toString() !== user._id.toString() ){
            res.status(404).json({message: "Houve um problema com sua solicitação, tente novamente mais tarde"})
            return
        }

        if(!name){
            res.status(422).json({message: "O nome é obrigatorio"})
            return
        } else{
            updatedDate.name = name
        }

        if(!age){
            res.status(422).json({message: "A idade é obrigatorio"})
            return
        }else{
            updatedDate.age = age
        }

        if(!weight){
            res.status(422).json({message: "O peso é obrigatorio"})
            return
        }else{
            updatedDate.weight = weight
        }

        if(!color){
            res.status(422).json({message: "A cor é obrigatorio"})
            return
        }else{
            updatedDate.color = color
        }

        
        if(!available){
            res.status(422).json({message: "Confirmar doação é obrigatorio"})
            return
        }else{
            updatedDate.available = available
        }

        if(images.lenght === 0){
            res.status(422).json({message: "A imagem é obrigatorio"})
            return
        }else{
            updatedDate.images = []
            images.map((image) => {
                updatedDate.images.push(images.filename)
            })
        }

        await Pet.findOneAndUpdate(petId, updatedDate)

        res.status(200).json({message: "Pet atualizado!"})

    }

    static async petSchedule(req, res){
        const petId = req.params.id

        // check if id exist
        if(!ObjectId.isValid(petId)){
            res.status(404).json({message: "Id invalido"})
            return
        }

        // check if pet exist
        const pet = await Pet.findOne({_id: petId})

        if(!pet){
            res.status(422).json({message: "Pet não existe"})
            return
        }

        // check if pet not is my pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        if(pet.user._id.equals(user._id) ){
            res.status(404).json({message: "Você não pode agendar uma visita com seu próprio pet"})
            return
        }

        console.log(pet.adopter)

        // check if user has already scheduled a visit
        if(pet.adopter){
            if(pet.adopter._id.equals(user._id)){
                res.status(404).json({message: "Você já agendou uma visita para este pet"})
            return
            }
        }

        // add user to pet
        pet.adopter = {
            _id: user._id,
            name: user.name,
            image: user.image
        }

        await Pet.findByIdAndUpdate(petId, pet)

        res.status(200).json({message: `A visita foi agendada com sucesso, entre em contato com ${pet.user.name}, pelo telefone: ${pet.user.phone}`})

    }

    static async petAdoption(req, res){ 

        const petId = req.params.id

        // check if id exist
        if(!ObjectId.isValid(petId)){
            res.status(404).json({message: "Id invalido"})
            return
        }

        // check if pet exist
        const pet = await Pet.findOne({_id: petId})

        if(!pet){
            res.status(422).json({message: "Pet não existe"})
            return
        }

        

    }
}