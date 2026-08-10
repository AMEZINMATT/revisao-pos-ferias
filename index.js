import express from "express"
import mysql2 from "mysql2"

const app = express()

app.use(express.json())

//CRUD WKNGPADGADNMPGOOAD´PMG´POADG,A

app.listen(3067 , () =>{
    console.log("servidor rodando na porta 67")
})

app.get("/show-movies", (request,response) => {
    const selectCommand = "SELECT * FROM filmes_MatheusHenriquePaulaPereira"

    sql.query(selectCommand, (error, data) => {
        if (error)
        {
            console.log(error)
            return
        }

        response.json(data)
    })
})

app.post("/create-movies", (request,response) => {
    //console.log(request.body)

    const { name, genero, duracao, classificacao_etria } = request.body

    const insertCommand = "INSERT INTO filmes_MatheusHenriquePaulaPereira( name, genero, duracao, classificacao_etria ) VALUES (?, ?, ?, ?)"

    sql.query(insertCommand,[name, genero, duracao, classificacao_etria], (error) => {
        if (error){
            console.log(error)
            return
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
                return
            }

            response.json({
                message: " Filme apagado com sucesso!"
            })
    })
})

// atualizar tarefas
app.put("/update-movies/:id", async (request, response) => {
    const { id } = request.params

    const selectTaskCommand = "SELECT * FROM filmes_MatheusHenriquePaulaPereira WHERE id=?"

    const task = await sql.promise().query(selectTaskCommand, [id], (error, data) => {
        if (error) {
            console.log(error)
            return
        }
        
        return data
    })

    const updateCommand = "UPDATE filmes_MatheusHenriquePaulaPereira WHERE id=?"

    sql.query(updateCommand, [task[0][0].status ? 0 : 1, id], (error) => {
        if (error) {
            console.log(error)
            return
        }
        
        response.json({
	        message: "Filme atualizado com sucesso!"
        })
    })
})

const sql = mysql2.createPool({
    host: "benserverplex.ddns.net",
    user: "alunos",
    password: "senhaAlunos",
    database: "alunos_filmes03TB"
})