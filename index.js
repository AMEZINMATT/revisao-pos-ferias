import express from "express"

const app = express()

//CRUD WKNGPADGADNMPGOOAD´PMG´POADG,A

app.get("/",(request, response) => {
    response.json({
        message:"skibidi"
    })
})

app.listen(3067 , () =>{
    console.log("servidor rodando na porta 67")
})

const sql = mysql2.createPool({
    host: "benserverplex.ddns.net",
    user: "aluno_projetos",
    password: "aluno@projeto",
    database: "alunos_filmes03tb"
})