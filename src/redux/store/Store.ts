import {createLogger} from "redux-logger";
import {applyMiddleware, createStore} from "redux";
import {initialState, retroBoardReducer} from "../reducers/RetroBoardReducers";
import {composeWithDevTools} from "redux-devtools-extension";
import ReduxPromise from 'redux-promise'

const logger = createLogger();

const store = createStore(retroBoardReducer, initialState, composeWithDevTools(
    applyMiddleware(ReduxPromise, logger),
));

export default store;