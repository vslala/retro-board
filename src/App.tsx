import React from 'react';
import {HashRouter as Router, Route} from 'react-router-dom'
import './App.css';
import HomePage from "./containers/HomePage";
import RetroBoard from "./containers/RetroBoard";
import Firebase from "./service/Firebase";

interface Props {
}

interface State {
    firebase: Firebase
    idToken: string
}

class App extends React.Component<Props, State> {

    state: State = {
        firebase: Firebase.getInstance(),
        idToken: ""
    }

    constructor(props: any) {
        super(props)
    }

    componentDidMount(): void {
        if (!this.state.firebase.isUserAuthenticated()) {
            this.state.firebase.authenticateUser().then(() => {
                this.setState({idToken: this.state.firebase.getIdToken()})
            })
        }
    }

    render() {
        if (this.state.firebase.isUserAuthenticated()) {
            return (
                <Router>
                    <Route exact path={"/"} component={HomePage}/>
                    <Route exact path={"/retro-board"} component={RetroBoard}/>
                </Router>
            )
        }

        return <h2>Access Restricted. <a href={"/"}>Login Here!</a></h2>

    }
}

export default App;
