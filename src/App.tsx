import React from 'react';
import {HashRouter as Router} from 'react-router-dom'
import './App.css';
import LayoutAuthenticated from "./components/LayoutAuthenticated";
import LayoutUnauthenticated from "./components/LayoutUnauthenticated";
import {Provider} from "react-redux";
import store from "./redux/store/Store";

interface Props {}
interface State {
    isLoggedIn: boolean
}
class App extends React.Component<Props, State> {

    state: State = {
        isLoggedIn: false
    }
    
    render() {
        return <Provider store={store}><Router>
            <LayoutUnauthenticated success={() => this.setState({isLoggedIn: true})} />
            <LayoutAuthenticated />
        </Router></Provider>

    }
}

export default App;
