const apiURL = "http://localhost:3067"

const movieList = document.querySelector("#movie-list")
const addForm = document.querySelector("#add-form")
const editForm = document.querySelector("#edit-form")
const navButtons = document.querySelectorAll(".nav-btn")
const refreshBtn = document.querySelector("#refresh-btn")

async function buscarFilmes() {
  try {
    const resposta = await fetch(`${apiURL}/show-movies`)

    if (!resposta.ok) {
      throw new Error("Erro ao buscar filmes")
    }

    const filmes = await resposta.json()

    if (!filmes.length) {
      movieList.innerHTML = '<div class="empty-state">Nenhum filme cadastrado ainda. Que tal adicionar o primeiro?</div>'
      return
    }

    movieList.innerHTML = filmes
      .map(
        (filme) => `
          <article class="movie-card">
            <div class="movie-poster">🎞️</div>
            <div class="movie-content">
              <h3>${filme.name}</h3>
              <div class="movie-meta">
                <span><strong>Gênero:</strong> ${filme.genero}</span>
                <span><strong>Duração:</strong> ${filme.duracao} min</span>
                <span><strong>Classificação:</strong> ${filme.classificacao_etria === 0 ? "Livre" : `${filme.classificacao_etria}+`}</span>
              </div>
              <div class="movie-actions">
                <button class="icon-btn" data-action="editar" data-id="${filme.id}">Editar</button>
                <button class="icon-btn delete" data-action="apagar" data-id="${filme.id}">Apagar</button>
              </div>
            </div>
          </article>
        `
      )
      .join("")
  } catch (error) {
    console.error(error)
    movieList.innerHTML = '<div class="empty-state">Não foi possível carregar os filmes. Verifique o backend.</div>'
  }
}

async function criarFilme(event) {
  event.preventDefault()

  const data = new FormData(addForm)
  const filme = {
    name: data.get("name"),
    genero: data.get("genero"),
    duracao: Number(data.get("duracao")),
    classificacao_etria: Number(data.get("classificacao_etria"))
  }

  const resposta = await fetch(`${apiURL}/create-movies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(filme)
  })

  if (!resposta.ok) {
    alert("Erro ao cadastrar filme.")
    return
  }

  addForm.reset()
  mostrarView("catalogo")
  buscarFilmes()
}

async function apagarFilme(id) {
  const confirmacao = window.confirm("Deseja apagar este filme?")

  if (!confirmacao) return

  const resposta = await fetch(`${apiURL}/delete-movies/${id}`, {
    method: "DELETE"
  })

  if (!resposta.ok) {
    alert("Erro ao apagar filme.")
    return
  }

  buscarFilmes()
}

function prepararEdicao(id) {
  const filme = Array.from(document.querySelectorAll(".movie-card"))
    .find((card) => card.querySelector("[data-action='editar']")?.dataset.id === String(id))

  const title = filme?.querySelector("h3")?.textContent || ""
  const meta = filme?.querySelector(".movie-meta")?.textContent || ""

  const dados = {
    id,
    name: title,
    genero: meta.split("Gênero:")[1]?.split("Duração:")[0]?.trim() || "",
    duracao: Number((meta.match(/Duração:\s*(\d+)/) || [])[1] || 0),
    classificacao_etria: Number((meta.match(/Classificação:\s*(\d+)/) || [])[1] || 0)
  }

  document.querySelector("#movie-id").value = dados.id
  document.querySelector("#edit-name").value = dados.name
  document.querySelector("#edit-genero").value = dados.genero
  document.querySelector("#edit-duracao").value = dados.duracao
  document.querySelector("#edit-classificacao_etria").value = dados.classificacao_etria

  mostrarView("editar")
}

async function atualizarFilme(event) {
  event.preventDefault()

  const id = document.querySelector("#movie-id").value
  const data = new FormData(editForm)

  const filmeAtualizado = {
    name: data.get("name"),
    genero: data.get("genero"),
    duracao: Number(data.get("duracao")),
    classificacao_etria: Number(data.get("classificacao_etria"))
  }

  const resposta = await fetch(`${apiURL}/update-movies/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(filmeAtualizado)
  })

  if (!resposta.ok) {
    alert("Erro ao atualizar filme.")
    return
  }

  editForm.reset()
  mostrarView("catalogo")
  buscarFilmes()
}

function mostrarView(viewName) {
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("active", view.id === viewName)
  })

  document.querySelectorAll(".nav-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === viewName)
  })
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => mostrarView(button.dataset.view))
})

refreshBtn.addEventListener("click", buscarFilmes)
addForm.addEventListener("submit", criarFilme)
editForm.addEventListener("submit", atualizarFilme)

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]")

  if (!target) return

  const { action, id } = target.dataset

  if (action === "apagar") {
    apagarFilme(id)
    return
  }

  if (action === "editar") {
    prepararEdicao(id)
  }
})

buscarFilmes()