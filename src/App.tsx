import React from 'react';
import {HashRouter as Router} from 'react-router-dom'
import './App.css';
import LayoutAuthenticated from "./components/LayoutAuthenticated";
import LayoutUnauthenticated from "./components/LayoutUnauthenticated";
import {Provider} from "react-redux";
import store from "./redux/store/Store";
import Firebase from "./service/Firebase";

interface Props {
}

interface State {
    isLoggedIn: boolean
}

class App extends React.Component<Props, State> {

    state: State = {
        isLoggedIn: false
    }

    render() {
        return <Provider store={store}><Router>
            {
                Firebase.getInstance().getLoggedInUser() ?
                    <LayoutAuthenticated/> :
                    <LayoutUnauthenticated success={() => this.setState({isLoggedIn: true})}/>
            }
        </Router></Provider>

    }
}

export default App;
