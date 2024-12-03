import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // Без завершающего слэша
        methods: ['GET', 'POST'],
        credentials: true, // Если нужно передавать куки
    },
});

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

const messages =[
    {message: 'Hello Nina', id:'12fe12',
        user:{id:'fg124r', name:'Dasha'}},
    {message: 'Hello Dasha', id:'rth2134',
        user:{id:'terh24', name:'Nina'}}
]

const users = new Map()

io.on('connection', (socket) => {

    users.set(socket, {id:new Date().getTime().toString(), name:'anonym'})

    io.on('disconnect', ()=>{
        users.delete(socket)
    })


    socket.on('client-name-sent', (name:any)=>{
        if (typeof name !== 'string' || name.length < 1){
            return
        }
      const user = users.get(socket)
        user.name = name
    })

    socket.on('client-typed', ()=>{
        socket.emit('client-typing', users.get(socket))

    })


    socket.on('client-message-sent', (message:any)=>{
        if (typeof message !== 'string' || message.length < 1) return

        const user = users.get(socket)

       let messageItem = {
           message: message, id: new Date().getTime().toString(),
           user:{id:user.id, name:user.name}
       }
        messages.push(messageItem)

        socket.emit('new-message-sent', messageItem)
    })

    socket.emit('init-message-published', messages)

});

server.listen(3009, () => {
    console.log('server running at http://localhost:3009');
});
