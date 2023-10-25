const mongoose = require("mongoose")

const alunoSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true

    },
    nome: {
        type: String,
        required: true

    },
    idade: {
        type: Number,
        required: true

    },
    notapsemestre: {
        type: Number,
        required: true

    },
    notassemestre: {
        type: Number,
        required: true

    }, 
    professor: {
        type: String,
        required: true

    },
    sala: {
        type: String,
        required: true

    }

})

module.exports = mongoose.model("estudantes", alunoSchema)
