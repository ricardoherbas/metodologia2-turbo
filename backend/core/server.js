const express=require('express')
const cors=require('cors')
require('dotenv').config()
const errorHandler=require('../middlewares/error-handler')
class Server{
  constructor(){
    this.app=express()
    this.port=process.env.PORT||3000
    this.middleware()
    this.rutas()
    this.errorHandlerGlobal()
  }
  middleware(){
    this.app.use(cors())
    this.app.use(express.json())
  }
  rutas(){
    this.app.use('/api/auth',require('../routes/auth.route'))
    this.app.use('/api/usuarios',require('../routes/usuarios.route'))
    this.app.use('/api/categorias',require('../routes/categorias.route'))
    this.app.use('/api/movimientos',require('../routes/movimientos.route'))
    this.app.use('/api/metas-ahorro',require('../routes/metas_ahorro.route'))
    this.app.use('/api/aportes-metas',require('../routes/aportes_metas.route'))
    this.app.use('/api/ia',require('../routes/ia.route'))
  }
  errorHandlerGlobal(){
    this.app.use(errorHandler)
  }
  getApp(){
    return this.app
  }
  listen(){
    this.app.listen(this.port,'0.0.0.0',()=>{
      console.log(`La API está escuchando en el puerto: ${this.port}`)
    })
  }
}
module.exports=Server