import React from 'react';
import {HashRouter as Router} from 'react-router-dom'
import './App.css';
import LayoutAuthenticated from "./components/LayoutAuthenticated";
import LayoutUnauthenticated from "./components/LayoutUnauthenticated";
import {Provider} from "react-redux";
import store from "./redux/store/Store";

class App extends React.Component {
    
    render() {
        return <Provider store={store}><Router>
            <LayoutUnauthenticated />
            <LayoutAuthenticated />
        </Router></Provider>

    }
}

export default App;
