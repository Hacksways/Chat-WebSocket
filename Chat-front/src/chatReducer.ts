import {api} from "./socket";

const initialState = {
    messages: [],
    typingUsers: []
}

export const chatReducer = (state: any = initialState, action: any) => {
    switch (action.type) {
        case 'message-received': {

            return {...state, messages: action.messages}
        }

        case 'new-message-received': {
            return {
                ...state, messages: [...state.messages, action.message],
                typingUsers: state.typingUsers.filter((u: any) => u.id !== action.message.user.id)
            }
        }

        case 'typing-user-added': {
            return {
                ...state,
                typingUsers: [...state.typingUsers.filter((u: any) => u.id !== action.user.id), action.user]
            }
        }

        default:
            return state;
    }
}

const messagesReceived = (messages: any) => ({type: 'message-received', messages})
const newMessagesReceived = (message: any) => ({type: 'new-message-received', message})
const typingUserAdded = (user: any) => ({type: 'typing-user-added', user})


export const createConnection = () => (dispatch: any) => {
    api.createConnection()
    api.subscribe((messages: any) => {
            dispatch(messagesReceived(messages))
        },
        (message: any) => {
            dispatch(newMessagesReceived(message))
        },
        (user: any) => {
            dispatch(typingUserAdded(user))
        }
    )
}

export const setClientName = (name: any) => () => {
    api.sendName(name)
}

export const sendMessage = (message: any) => () => {
    api.sendMessage(message)
}

export const typeMessage = () => () => {
    api.typeMessage()
}

export const destroyConnection = () => () => {
    api.destroyConnection()
}