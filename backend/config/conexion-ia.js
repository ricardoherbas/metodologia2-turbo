const OLLAMA_URL=process.env.OLLAMA_URL||'http://ollama:11434'
async function conexionIA(modelo,prompt){
  try{
    const respuesta=await fetch(`${OLLAMA_URL}/api/generate`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        model:modelo,
        prompt:prompt,
        stream:false,
        keep_alive:-1
      })
    })
    if(!respuesta.ok){
      const error=await respuesta.text()
      throw new Error(`Ollama respondió ${respuesta.status}: ${error}`)
    }
    const datos=await respuesta.json()
    return datos.response
  }catch(err){
    console.error('Error conectando con Ollama:',err.message)
    throw err
  }
}

module.exports={ conexionIA, OLLAMA_URL }