const { Schema, model } = require('mongoose')

const mensajeSchema = new Schema({
    user: {
        type:String,
        required: true
    },
    ms: {type: String},
    time: {
        type: String,
    }
})

module.exports = model('mensajes', mensajeSchema)