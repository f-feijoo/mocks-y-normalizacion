const { Schema, model } = require("mongoose");

const mensajeSchema = new Schema({
  id: {
    type: Number,
  },
  autor: {
    id: {
      type: String,
    },
    nombre: {
      type: String,
    },
    apellido: {
      type: String,
    },
    edad: {
      type: Number,
    },
    alias: {
      type: String,
    },
    avatar: {
      type: String,
    },
  },
  texto: {
    type: String,
  },
  timestamp: {
    type: String,
  },
});

module.exports = model("mensajes", mensajeSchema);
