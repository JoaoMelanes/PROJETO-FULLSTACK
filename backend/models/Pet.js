const mongoose = require('mongoose')
const { Schema } = mongoose

const Pet = mongoose.model(
    "Pet",
    new Schema({
        name: {type: String, required: true},
        age: {type: Number, required: true},
        images: {type: Array, required: true},
        weight: {type: Number, required: true},
        color: {type: String, required: true},
        avaliable: {type: Boolean},
        user: Object,
        adopter: Object,
    },
    {timestamps: true},
)
)

module.exports = Pet