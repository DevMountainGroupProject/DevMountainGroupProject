import { createStore, applyMiddleware, combineReducers } from 'redux'
import promiseMiddleware from 'redux-promise-middleware'
import registerReducer from './reducers/registerReducer'
import loginReducer from './reducers/loginReducer'
import userReducer from './reducers/userReducer'
import sidebarReducer from './reducers/sidebarReducer'

const rootReducer = combineReducers({
   registerReducer,
   loginReducer,
   userReducer,
   sidebarReducer
})



export default createStore(rootReducer, applyMiddleware(promiseMiddleware))