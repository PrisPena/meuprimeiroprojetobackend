const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const express = require("express") // aqui estou iniciando o express
const router = express.Router() // aqui estou configurando a primeira parte da rota




const conectaBancoDeDados = require("./bancoDeDados") // aqui estou ligando ao arquivo banco de dados
conectaBancoDeDados() // chamando a função que conecta o banco de dados

const aluno = require("./alunoModel") // aqui estou ligando ao arquivo alunoModel

const app = express() // aqui estou iniciando o app
app.use(cors());
app.use(express.json()) //aqui eu digo que o app tem que usar o json do express para os requests
const porta = 3333 // aqui estou criando a porta 

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Alunos',
            version: '1.0.0',
            description: 'Uma API para gerenciamento de alunos',
        },
        servers: [
            {
                url: `http://localhost:${porta}`,
            },
        ],
    },
    apis: [__filename],  // Indica que este arquivo contém documentação Swagger
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

// função GET
async function mostraAlunos(request, response) {
    try{
        const alunosVindosDoBancoDeDados = await aluno.find()
        response.json(alunosVindosDoBancoDeDados)
        
    } catch(erro) {
        console.log(erro)
    }
}

// função POST
async function criaAluno (request, response){
    const novoAluno = new aluno({
        nome: request.body.nome,
        idade: request.body.idade,
        notapsemestre: request.body.notapsemestre, 
        notassemestre: request.body.notapsemestre, 
        professor: request.body.professor,
        sala: request.body.sala,
    })
    try {
        const alunoCriado = await novoAluno.save()
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

/**
 * @swagger
 * /alunos:
 *   get:
 *     summary: Retorna a lista de alunos
 *     responses:
 *       200:
 *         description: Uma lista de alunos.
 */
app.use(router.get("/alunos", mostraAlunos));

/**
 * @swagger
 * /alunos:
 *   post:
 *     summary: Cria um novo aluno
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               idade:
 *                 type: number
 *               notapsemestre:
 *                 type: number
 *               notassemestre:
 *                 type: number
 *               professor:
 *                 type: string
 *               sala:
 *                 type: string
 *     responses:
 *       201:
 *         description: Aluno criado com sucesso.
 */
app.use(router.post("/alunos", criaAluno));

/**
 * @swagger
 * /alunos/{id}:
 *   patch:
 *     summary: Atualiza um aluno existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do aluno a ser atualizado.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               idade:
 *                 type: number
 *               notapsemestre:
 *                 type: number
 *               notassemestre:
 *                 type: number
 *               professor:
 *                 type: string
 *               sala:
 *                 type: string
 *     responses:
 *       200:
 *         description: Aluno atualizado com sucesso.
 */
app.use(router.patch("/alunos/:id", corrigeAluno));

/**
 * @swagger
 * /alunos/{id}:
 *   delete:
 *     summary: Deleta um aluno
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do aluno a ser deletado.
 *     responses:
 *       200:
 *         description: Aluno deletado com sucesso.
 */

app.use(router.get("/alunos", mostraAlunos)) //segunda conf da rota, onde configurei rota get/mulheres
app.use(router.post("/alunos", criaAluno)) // configurei rota post/mulheres
app.use(router.patch("/alunos/:id", corrigeAluno)) // configurei a rota patch
app.use(router.delete("/alunos/:id", deletaAluno)) // configurei a rota delete 

//função porta
function mostraPorta (){
    console.log("Servidor criado e rodando na porta", porta)
}

app.listen(porta, mostraPorta) // servidor ouvindo a porta

