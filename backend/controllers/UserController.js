const createUserToken = require('../helpers/create-user-token')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// helpers
const createToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const { get } = require('mongoose')
const getUserById = require('../helpers/get-user-by-token')
const getUserByToken = require('../helpers/get-user-by-token')


module.exports = class UserController{
    static async register(req, res){

        const { name, email, phone, password, confirmpassword} = req.body

        // validation
        if(!name){
            res.status(422).json({message: 'A confirmação de nome é obrigatoria'})
            return
        }
        
        if(!email){
            res.status(422).json({message: 'A confirmação de email é obrigatoria'})
            return
        }

        if(!password){
            res.status(422).json({message: 'A confirmação de senha é obrigatoria'})
            return
        }

        if(!confirmpassword){
            res.status(422).json({message: 'A confirmação de senha é obrigatoria'})
            return
        }

        if(!phone){
            res.status(422).json({message: 'A confirmação de phone é obrigatoria'})
            return
        }

        if(password !== confirmpassword){
            res.status(422).json({message: 'A senha e a confimação da senha precisam ser iguais'})
            return
        }

        // check if user exist

        const userExist = await User.findOne({email: email})

        if(userExist){
            res.status(422).json({message:'Por favor, utilize outro email'})
            return
        }
        
        // create a password
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        //create user
        const user = new User({
            name,
            email,
            password: passwordHash,
            phone
        })

        try{
            const newUser = await user.save()
            
            await createUserToken(newUser, req, res)

        }catch(e){
            res.status(500).json({message: e})
        }
    }

    static async login(req, res){
        const {email, password} = req.body

        if(!email){
            res.status(422).json({message: 'Insira um email, ao campo!'})
            return
        }

        if(!password){
            res.status(422).json({message: 'Insira a senha, ao campo!'})
            return
        }

        // validation email
        const user = await User.findOne({email: email})

        if(!user){
            res.status(422).json({message: 'Usuario inexistente, tente outro e-mail'})
            return
        }

        // check password
        const passwordValid = await bcrypt.compare(password, user.password)

        if(!passwordValid){
            res.status(422).json({message: 'Senha invalida'})
            return
        }

        await createUserToken(user, req, res)
    }

    static async checkUser(req, res){
        let currentUSer

        if(req.headers.authorization){

            const token = getToken(req)
            const decoded = jwt.verify(token, 'nossosecret') 

            currentUSer = await User.findById(decoded.id)

            currentUSer.password = undefined

        }else{
            currentUSer = null
        }

        res.status(200).json({message: currentUSer})
    }

    static async getUserById(req, res){
        const id = req.params.id

        const user = await User.findById(id).select("-password")

        if(!user){
            res.status(422).json({messagem: 'Usuario não encontrado'})
            return
        }

        res.status(200).json({user})
    }

    static async editUser(req, res){
        const id = req.params.id
        
        // check user exist
        const token = getToken(req)
        const user = await getUserByToken(token)
        console.log(user)

        const { name, email, phone, password, confirmpassword } = req.body
        let image = ""

        if(req.file){
            
        }

        // validation

        if(!name){
            res.status(422).json({message: 'A confirmação de nome é obrigatoria'})
            return
        }

        user.name = name

        if(!email){
            res.status(422).json({message: 'A confirmação de email é obrigatoria'})
            return
        }
        // check if email has already taken
        const userExist = await User.findOne({email: email})

        if(user.email !== email && userExist){
            res.status(200).json({message: "Por favor utilize outro e-mail!"})
            return
        }

        user.email = email

        if(!password){
            res.status(422).json({message: 'A confirmação de senha é obrigatoria'})
            return
        }

        user.password = password

        if(!confirmpassword){
            res.status(422).json({message: 'A confirmação de senha é obrigatoria'})
            return
        }

        user.confirmpassword = confirmpassword

        if(!phone){
            res.status(422).json({message: 'A confirmação de phone é obrigatoria'})
            return
        }

        user.phone = phone

        if(password !== confirmpassword){
            res.status(422).json({message: 'A senha e a confimação da senha precisam ser iguais'})
            return
        }else if(password === confirmpassword && password != null){
            // create password

            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)

            user.password = passwordHash
        }

        try{
            // returns user updated data
            await User.findOneAndUpdate(
                { _id: user.id }, 
                { $set: user },
                { new: true }
            )

            res.status(200).json({message: "Usuario atualizado com sucesso"})
        }catch(e){
            res.status(500).json({messaage: e})
            return
        }
    }
}