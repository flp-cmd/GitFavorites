import { GithubUser } from "./GithubUser.js"

export class Favorites {
  constructor(root){
    this.root = document.querySelector(root)
    this.load()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem
    ('@github-favorites:')) || []

  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async add(username) {
    try {

      const userExists = this.entries.find(entry => entry.login === username)

      if(userExists) {
        throw new Error('Usuário já favoritado!')
      }

      const user = await GithubUser.search(username)

      if(user.login === undefined){
        throw new Error('Usuário não encontrado!')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()

    } catch(error){
      alert(error.message)
    }
  }

  delete(user) {
    const filteredEntries = this.entries
    .filter(entry => entry.login != user.login)

    this.entries = filteredEntries
    this.update()
    this.save()
  }

}

export class FavoritesView extends Favorites {
  constructor(root){
    super(root)

    this.tbody = this.root.querySelector("table tbody")

    this.update()
    this.onAdd()
  }

  onAdd(){
    const addButton = this.root.querySelector('#search button')
    const input = this.root.querySelector('#search input')

    
    addButton.onclick = () => {
      this.add(input.value)
      input.value = ''
    }

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        addButton.click()
      }
    })
  }

  update() {
    this.removeAllTr()

    const content = this.root.querySelector('.no-user')
    const wrapper = this.root.querySelector('.table-container')

    if (this.entries[length] == undefined) {
        content.classList.remove('hide')
        wrapper.classList.add('fixed-box')
     } else {
         content.classList.add('hide')
         wrapper.classList.remove('fixed-box')
     }


    this.entries.forEach(user => {
      const row = this.createRow()

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user a p').textContent = user.name
      row.querySelector('.user span').textContent = `/${user.login}`
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers
      row.querySelector('#remove-btn').onclick = () => {
      const isOk = confirm('Tem certeza que deseja deletar esta linha?')
        
        if (isOk) {
          this.delete(user)
        }
      }

    this.tbody.append(row)
    })
  }

  createRow() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
    <td class="user">
      <img src="https://github.com/diego3g.png" alt="">
      <a href="https://github.com/diego3g" target="_blank">
        <p>Diego Fernandes</p>
        <span>/diego3g</span>
      </a>
    </td>
    <td class="repositories">
      76
    </td>
    <td class="followers">
      9589
    </td>
    <td>
      <button id="remove-btn">Remover</button>
    </td>
    `

    return tr
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr')
    .forEach((tr) => {
      tr.remove()
    })
  }
}