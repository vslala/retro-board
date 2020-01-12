import React from 'react';
import {HashRouter as Router} from 'react-router-dom'
import './App.css';
import LayoutAuthenticated from "./components/LayoutAuthenticated";
import LayoutUnauthenticated from "./components/LayoutUnauthenticated";

class App extends React.Component {

    render() {
        return <Router>
            <LayoutUnauthenticated />
            <LayoutAuthenticated />
        </Router>

    }
}

export default App;
