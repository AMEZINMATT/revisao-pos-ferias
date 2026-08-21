async function buscarFilmes() {
    // acessar a rota GET do backend e exibir os filmes na tela
    const resposta = await fetch("http://localhost:3067")
    const filmes = await resposta.json()
    const sectionFilmes = document.querySelector(".filmes")

    filmes.forEach((filme) => {
        sectionFilmes.innerHTML += `
            <div>
                <h2>${filme.name}</h2>
                <p><strong>Gênero:</strong> ${filme.genero}</p>
                <p><strong>Duração:</strong> ${filme.duracao} minutos</p>
                <p><strong>Classificação indicativa:</strong> ${filme.classificacao_etria > 0 ? filme.classificacao_etria + ' anos' : 'Livre'}</p>
            </div>
        `
    })
}

buscarFilmes()