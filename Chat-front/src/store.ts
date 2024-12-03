import {combineReducers, legacy_createStore, applyMiddleware} from 'redux'
import {chatReducer} from "./chatReducer";
import {thunk} from 'redux-thunk'

const rootReducer = combineReducers({chat: chatReducer})

export type AppStateType = ReturnType<typeof rootReducer>

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk))