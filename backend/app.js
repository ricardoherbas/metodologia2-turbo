const Server = require('./core/server')
const { iniciarIA } = require('./init/ia.init')

const server = new Server()
server.listen()
setTimeout(() => {
  iniciarIA()
    .then(() => {
      console.log('Calentamiento de IA completado')
    })
    .catch(err => {
      console.error('Error calentando IA:', err.message)
    })
}, 20000)
