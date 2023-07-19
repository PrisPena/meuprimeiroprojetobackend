const express = require("express") // aqui estou iniciando o express
const router = express.Router() // aqui estou configurando a primeira parte da rota
const cors = require('cors') // aqui estou trazendo o pacote cors que permite consumir essa api no front

const conectaBancoDeDados = require("./bancoDeDados") // aqui estou ligando ao arquivo banco de dados
conectaBancoDeDados() // chamando a função que conecta o banco de dados

const mulher = require("./mulherModel") // aqui estou ligando ao arquivo mulherModel

const app = express() // aqui estou iniciando o app
app.use(express.json()) //aqui eu digo que o app tem que usar o json do express para os requests
app.use(cors())
const porta = 3333 // aqui estou criando a porta 

// função GET
async function mostraMulheres(request, response) {
    try{
        const mulheresVindasDoBancoDeDados = await mulher.find()
        response.json(mulheresVindasDoBancoDeDados)
        
    } catch(erro) {
        console.log(erro)
    }
}

// função POST
async function criaMulher (request, response){
    const novaMulher = new mulher({
        nome: request.body.nome,
        imagem: request.body.imagem,
        minibio: request.body.minibio, 
        citacao: request.body.citacao
    })
    try {
        const mulherCriada = await novaMulher.save()
        response.status(201).json(mulherCriada)

    } catch(erro) {
        console.log(erro)
    }
}

//função PATCH
async function corrigeMulher (request, response){
    try{
        const mulherEncontrada = await mulher.findById(request.params.id)

    if (request.body.nome){
        mulherEncontrada.nome = request.body.nome
    }

    if (request.body.minibio){
        mulherEncontrada.minibio = request.body.minibio
    }

    if (request.body.imagem){
        mulherEncontrada.imagem = request.body.imagem
    }

    if (request.body.citacao){
        mulherEncontrada.citacao = request.body.citacao
    }

    const mulherAtualizadaNoBancoDeDados = await mulherEncontrada.save()

    response.json(mulherAtualizadaNoBancoDeDados)    
    } catch(erro){
        console.log(erro)
    }
}

//DELETE 
async function deletaMulher (request,response){
    try{
        await mulher.findByIdAndDelete(request.params.id)
        response.json({mensagem: "Mulher deletada com sucesso!"})

    } catch(erro){
        console.log(erro)
    }
}

app.use(router.get("/mulheres", mostraMulheres)) //segunda conf da rota, onde configurei rota get/mulheres
app.use(router.post("/mulheres", criaMulher)) // configurei rota post/mulheres
app.use(router.patch("/mulheres/:id", corrigeMulher)) // configurei a rota patch
app.use(router.delete("/mulheres/:id", deletaMulher)) // configurei a rota delete 

//função porta
function mostraPorta (){
    console.log("Servidor criado e rodando na porta", porta)
}

app.listen(porta, mostraPorta) // servidor ouvindo a porta

