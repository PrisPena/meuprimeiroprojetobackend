const express = require("express")
const router = express.Router()

const app = express()
const porta = 3333

function mostraAlunos(request, response){
    response.json({
        id: 1,
        nome: "Priscila Pena",
        idade: 31,
        notapsemestre: 10,
        notassemestre: 8,
        professor: "João",
        sala: "A2",
    })
}
function mostraPorta(){
    console.log("Servidor criado e rodando na porta ", porta)
}

app.use(router.get("/aluno", mostraAlunos))
app.listen(porta, mostraPorta)