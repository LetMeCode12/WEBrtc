import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import { reducer as formReducer } from 'redux-form';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import LoginReducer from "./reducers/loginReducer";
import UserReducer from "./reducers/userReducer";

const rootReducer = combineReducers({
    form: formReducer,
    LoginReducer,
    UserReducer
});

export default createStore(rootReducer,compose(applyMiddleware(logger),applyMiddleware(thunk)))