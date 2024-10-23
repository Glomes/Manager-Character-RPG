import express from 'express'

const app = express()

//express usar json
app.use(express.json())

// mock database
const character = [
  { id: 1, name: 'Orfeu', title: 'The Sagacious', class: 'Bard', race: 'aasimar', level: 4, system: 'D&D' },
  { id: 2, name: 'Ywnduim', title: 'The Doctor', class: 'Rogue', race: 'Drow-elf', level: 4, system: 'D&D' },
  { id: 3, name: 'Zirin', title: 'The Cooker', class: 'Warrior', race: 'Dwarf', level: 4, system: 'D&D' },
  { id: 4, name: 'Minssey', title: 'The lancer', class: 'Warlock', race: 'Halfling', level: 4, system: 'D&D' },
  { id: 5, name: 'Draknir', title: 'The Sage', class: 'Sorcerer', race: 'Dragonborn', level: 4, system: 'D&D' },
  { id: 6, name: 'Vex', title: 'The Vanish', class: 'Rogue', race: 'Halfling', level: 4, system: 'D&D' }
]

//Busca por id
function idSearch(id) {
  return character.filter(character => character.id == id)
}

// retorno por id
function searchIndexId(id) {
  return character.findIndex(character => character.id == id)
}

//Rota especifica
app.get('/characters/:id', (req, res) => {
  res.json(idSearch(req.params.id))
})


app.delete('/characters/:id', (req, res) => {
  let index = searchIndexId(req.params.id)
  character.splice(index, 1)
  res.send(`Character of Id ${req.params.id} deleted!`)


})

app.put('/characters/:id', (req, res) => {
  let index = searchIndexId(req.params.id)

  character[index].name = req.body.name
  character[index].title = req.body.title
  character[index].class = req.body.class
  character[index].race = req.body.race
  character[index].level = req.body.level
  character[index].system = req.body.system

  res.json(character)
})

//Rota Raiz
app.get('/', (req, res) => {
  res.send('Esta tudo ok')
})


app.get('/characters', (req, res) => {
  res.status(200).send(character)
})


app.post('/characters', (req, res) => {
  character.push(req.body)
  res.status(201).send("Post Sucessful!")
})


export default app
