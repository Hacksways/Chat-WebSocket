import React, {useEffect, useRef, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {io} from "socket.io-client";
import {socket} from "./socket";


function App() {

    useEffect(() => {
        socket.on('init-message-published', (messages: any) => {
            setMessages(messages)
        })

        socket.on('new-message-sent', (message: any) => {
            setMessages((messages) => [...messages, message])
        })

        return () => {
            socket.off('init-message-published');
            socket.off('new-message-sent');
            socket.off('connect');
        };

    }, []);

    socket.on('connect', () => {
        console.log('Connected to server');
    });
    const [messages, setMessages] = useState<any[]>([])

    const [message, setMessage] = useState('')
    const [name, setName] = useState('')
    const [isAutoScrollActive, setIsAutoScrollActive] = useState<boolean>(false)
    const [lastScrollTop, setLastScrollTop] = useState(0)

    useEffect(() => {
        if (isAutoScrollActive) {
            messagesAnchorRef.current?.scrollIntoView({behavior: "smooth"})

        }
    }, [messages]);

    const messagesAnchorRef = useRef<HTMLDivElement>(null)

    return (

        <div className="App">
            <div>
                <div style={{
                    border: '1px solid black',
                    padding: '10px',
                    height: '300px',
                    width: '300px',
                    overflowY: 'scroll'
                }}
                onScroll={(e)=>{
                    let element = e.currentTarget
                    const maxScrollPosition = element.scrollHeight - element.clientHeight
                    if (element.scrollTop > lastScrollTop && Math.abs(maxScrollPosition - element.scrollTop) < 10){
                        setIsAutoScrollActive(true)
                    } else{
                        setIsAutoScrollActive(false)
                    }
                    setLastScrollTop(element.scrollTop)
                }}
                >
                    {messages.map(m => {
                        return <div key={m.id}>
                            <b>{m.user.name}:</b> {m.message}
                            <hr/>
                        </div>
                    })}
                    <div ref={messagesAnchorRef}></div>
                </div>
                <div>
                    <input type="text" value={name} onChange={(e) => {
                        setName(e.currentTarget.value)
                    }}/>
                    <button onClick={() => {
                        socket.emit('client-name-sent', name)
                    }}>Send Name
                    </button>
                </div>
                <div>
                    <textarea value={message} onChange={(e) => setMessage(e.currentTarget.value)}></textarea>
                    <button onClick={() => {
                        socket.emit('client-message-sent', message)
                        setMessage('')
                    }}>Send
                    </button>
                </div>

            </div>
        </div>

    );
}

export default App;
