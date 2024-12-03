import {api} from "./socket";

const initialState = {
    messages: []
}

export const chatReducer = (state: any = initialState, action: any) => {
    switch (action.type) {
        case 'message-received': {

            return {...state, messages: action.messages}
        }

        case 'new-message-received': {
            return {...state, messages: [...state.messages, action.message]}
        }

        default:
            return state;
    }
}

const messagesReceived = (messages: any) => ({type: 'message-received', messages})
const newMessagesReceived = (message: any) => ({type: 'new-message-received', message})


export const createConnection = () => (dispatch: any) => {
    api.createConnection()
    api.subscribe((messages: any) => {
        dispatch(messagesReceived(messages))
        },
        (message: any) => {
        dispatch(newMessagesReceived(message))
        }
    )
}

export const setClientName = (name:any) => (dispatch: any) => {
    api.sendName(name)
}

export const sendMessage = (message:any) => (dispatch: any) => {
    api.sendMessage(message)
}

export const destroyConnection = () => (dispatch: any) => {
    api.destroyConnection()
}