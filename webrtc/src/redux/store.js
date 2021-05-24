import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import { reducer as formReducer } from 'redux-form';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import LoginReducer from "./reducers/loginReducer";

const rootReducer = combineReducers({
    form: formReducer,
    LoginReducer
});

export default createStore(rootReducer,compose(applyMiddleware(logger),applyMiddleware(thunk)))