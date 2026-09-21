import express from "express"
import cors from "cors"
import mysql2 from "mysql2"

const app = express()
const sql = mysql2.createPool({
    host: "benserverplex.ddns.net",
    user: "alunos",
    password: "senhaAlunos",
    database: "alunos_filmes03TB"
})

app.use(cors())
app.use(express.json())

app.get("/", (request, response) => {
    response.json({ message: "API dos filmes funcionando" })
})

app.get("/show-movies", (request, response) => {
    const selectCommand = "SELECT * FROM filmes_MatheusHenriquePaulaPereira"

    sql.query(selectCommand, (error, data) => {
        if (error) {
            console.log(error)
            return response.status(500).json({ message: "Erro ao buscar filmes" })
        }

        response.json(data)
    })
})

app.post("/create-movies", (request, response) => {
    const { name, genero, duracao, classificacao_etria } = request.body

    const insertCommand = "INSERT INTO filmes_MatheusHenriquePaulaPereira(name, genero, duracao, classificacao_etria) VALUES (?, ?, ?, ?)"

    sql.query(insertCommand, [name, genero, duracao, classificacao_etria], (error) => {
        if (error) {
            console.log(error)
            return response.status(500).json({ message: "Erro ao criar filme" })
        }

        response.status(201).json({
            message: "Filme adicionado com sucesso"
        })
    })
})

app.delete("/delete-movies/:id", (request, response) => {
    const { id } = request.params

    const deleteCommand = "DELETE FROM filmes_MatheusHenriquePaulaPereira WHERE id=?"

    sql.query(deleteCommand, [id], (error) => {
        if (error) {
            console.log(error)
            return response.status(500).json({ message: "Erro ao excluir filme" })
        }

        response.json({
            message: "Filme apagado com sucesso!"
        })
    })
})

app.put("/update-movies/:id", (request, response) => {
    const { id } = request.params
    const { name, genero, duracao, classificacao_etria } = request.body

    const updateCommand = "UPDATE filmes_MatheusHenriquePaulaPereira SET name=?, genero=?, duracao=?, classificacao_etria=? WHERE id=?"

    sql.query(updateCommand, [name, genero, duracao, classificacao_etria, id], (error) => {
        if (error) {
            console.log(error)
            return response.status(500).json({ message: "Erro ao atualizar filme" })
        }

        response.json({
            message: "Filme atualizado com sucesso!"
        })
    })
})

app.listen(3067, () => {
    console.log("servidor rodando na porta 3067")
})