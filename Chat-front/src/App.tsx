import React, {useEffect, useRef, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "./store";
import {createConnection, destroyConnection, sendMessage, setClientName, typeMessage} from "./chatReducer";


function App() {
    console.log('App')
    const messages = useSelector((state: AppStateType) => state.chat.messages)
    const typingUsers = useSelector((state: AppStateType) => state.chat.typingUsers)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(createConnection())
        return () => {
            dispatch(destroyConnection())
        };
    }, []);

    // const [messages, setMessages] = useState<any[]>([])

    const [message, setMessage] = useState<string>('')
    const [name, setName] = useState<string>('anonym')
    const [isAutoScrollActive, setIsAutoScrollActive] = useState<boolean>(true)
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
                     onScroll={(e) => {
                         let element = e.currentTarget
                         const maxScrollPosition = element.scrollHeight - element.clientHeight

                         if (element.scrollTop > lastScrollTop && Math.abs(maxScrollPosition - element.scrollTop) < 10) {
                             setIsAutoScrollActive(true)
                         } else {
                             setIsAutoScrollActive(false)
                         }

                         setLastScrollTop(element.scrollTop)
                     }}
                >
                    {messages.map((m: any) => {
                        return <div key={m.id}>
                            <b>{m.user.name}:</b> {m.message}
                            <hr/>
                        </div>
                    })}

                    {typingUsers.map((u: any) => {
                        return <div key={u.id}>
                            <b>{u.name}:</b> ...
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
                        dispatch(setClientName(name))
                    }}>Send Name
                    </button>
                </div>
                <div>
                    <textarea value={message}
                              onKeyPress={()=>{
                                  dispatch(typeMessage())
                              }}
                              onChange={(e) => setMessage(e.currentTarget.value)}></textarea>
                    <button onClick={() => {
                        dispatch(sendMessage(message))
                        setMessage('')
                    }}>Send
                    </button>
                </div>

            </div>
        </div>

    );
}

export default App;
