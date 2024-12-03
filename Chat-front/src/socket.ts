import {io, Socket} from 'socket.io-client';

export const api = {
    socket: null as null | Socket,

    createConnection() {
        this.socket = io('http://localhost:3009')
    },

    subscribe(initMessagesHandler: (messages: any) => void,
              newMessageSentHandler: (message: any) => void,
              userTypingHandler: (user: any) => void
    ) {
        this.socket?.on('init-message-published', initMessagesHandler)
        this.socket?.on('new-message-sent', newMessageSentHandler)
        this.socket?.on('client-typing', userTypingHandler)
    },

    destroyConnection() {
        this.socket?.off('init-message-published');
        this.socket?.off('new-message-sent');
        this.socket?.off('connect');
        this.socket?.disconnect()
        this.socket = null
    },

    sendName(name:any){
        this.socket?.emit('client-name-sent', name)
    },

    sendMessage(message:any){
        this.socket?.emit('client-message-sent', message)
    },

    typeMessage(){
        this.socket?.emit('client-typed')
    }
}