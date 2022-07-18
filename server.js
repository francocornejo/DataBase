const express = require('express')
const app = express()
const  { Server: IOServer } = require('socket.io')
const path = require('path')
const puerto = 8080

const database=require('./MariaDB-Sqlite3/sqlite3')
const dbMariadb = require('./MariaDB-Sqlite3/mariaDB')

const products = require('./controllers/products')

const productContainer = new products(dbMariadb, "producto")

const messages = require('./controllers/messages')

const messagesContainer = new messages(database, "mensaje")

app.use(express.static(path.join(__dirname, '/public')))

const serverExpress = app.listen(puerto, (err)=>{
    if (err) {
        console.log(`Ocurrio un error ${err}`)
    }else{
        console.log(`Servidor escuchando puerto: ${puerto}`)
    }
})

const io =  new IOServer(serverExpress)

io.on('connection', async socket => {
    console.log(`Se conecto un usuario ID: ${socket.id}`)
    
    const messagesLog = await messagesContainer.getMessages();

    io.emit('server: message', messagesLog)
 
    socket.on('cliente: message', async (data) =>{
        const { email, message } = data
        await messagesContainer.addMessage(email, message)
        const messagesLog = await messagesContainer.getMessages()
        io.emit('server: message', messagesLog)
    } )

    const prod = await productContainer.getAll();
    
    io.emit('server: product', prod)
    
    socket.on('cliente: product', async (data) =>{
        const { title, price, thumbnail } = data
        await productContainer.add(title, price, thumbnail);
        const prod = await productContainer.getAll();
        io.emit('server: product', prod)
    } )
})