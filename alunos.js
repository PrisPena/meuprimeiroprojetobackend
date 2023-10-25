const express = require("express") // aqui estou iniciando o express
const router = express.Router() // aqui estou configurando a primeira parte da rota


const conectaBancoDeDados = require("./bancoDeDados") // aqui estou ligando ao arquivo banco de dados
conectaBancoDeDados() // chamando a função que conecta o banco de dados

const aluno = require("./alunoModel") // aqui estou ligando ao arquivo mulherModel

const app = express() // aqui estou iniciando o app
app.use(express.json()) //aqui eu digo que o app tem que usar o json do express para os requests
const porta = 3333 // aqui estou criando a porta 

// função GET
async function mostraAlunos(request, response) {
    try{
        const alunosVindosDoBancoDeDados = await aluno.find()
        response.json(alunosVindosDoBancoDeDadosVindasDoBancoDeDados)
        
    } catch(erro) {
        console.log(erro)
    }
}

// função POST
async function criaAluno (request, response){
    const novoAluno = new aluno({
        id: request.body.id,
        nome: request.body.nome,
        idade: request.body.idade,
        notapsemestre: request.body.notapsemestre, 
        notassemestre: request.body.notapsemestre, 
        professor: request.body.professor,
        sala: request.body.sala,
    })
    try {
        const alunoCriado = await novaAluno.save()
        response.status(201).json(alunoCriado)

    } catch(erro) {
        console.log(erro)
    }
}

//função PATCH
async function corrigeAluno (request, response){
    try{
        const alunoEncontrado = await aluno.findById(request.params.id)

    if (request.body.nome){
        alunoEncontrado.nome = request.body.nome
    }

    if (request.body.idade){
        alunoEncontrado.idade = request.body.idade
    }

    if (request.body.notapsemestre){
        alunoEncontrado.notapsemestre = request.body.notapsemestre
    }

    if (request.body.notassemestre){
        alunoEncontrado.notassemestre = request.body.notassemestre
    }

    if (request.body.professor){
        alunoEncontrado.professor = request.body.professor
    }

    if (request.body.sala){
        alunoEncontrado.sala = request.body.sala
    }

    const alunoAtualizadoNoBancoDeDados = await alunoEncontrado.save()

    response.json(alunoAtualizadoNoBancoDeDados)    
    } catch(erro){
        console.log(erro)
    }
}

//DELETE 
async function deletaAluno (request,response){
    try{
        await aluno.findByIdAndDelete(request.params.id)
        response.json({mensagem: "Aluno deletado com sucesso!"})

    } catch(erro){
        console.log(erro)
    }
}

app.use(router.get("/alunos", mostraAlunos)) //segunda conf da rota, onde configurei rota get/mulheres
app.use(router.post("/alunos", criaAluno)) // configurei rota post/mulheres
app.use(router.patch("/alunos/:id", corrigeAluno)) // configurei a rota patch
app.use(router.delete("/alunos/:id", deletaAluno)) // configurei a rota delete 

//função porta
function mostraPorta (){
    console.log("Servidor criado e rodando na porta", porta)
}

app.listen(porta, mostraPorta) // servidor ouvindo a porta

