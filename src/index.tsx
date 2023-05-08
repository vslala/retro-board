import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {Provider} from "react-redux";
import store from "./redux/store/Store";
import 'bootstrap-social/assets/css/docs.css'
import 'bootstrap-social/assets/css/font-awesome.css'
import 'bootstrap-social/assets/img/bootstrap-social.png'
import 'bootstrap-social/bootstrap-social.css'
import React from 'react';

const rootElement = document.getElementById('root');
ReactDOM.createRoot(rootElement!).render(<Provider store={store}><App /></Provider>);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
