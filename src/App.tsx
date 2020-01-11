import React from 'react';
import {HashRouter as Router} from 'react-router-dom'
import './App.css';
import Firebase from "./service/Firebase";
import {RouteComponentProps} from 'react-router';
import LayoutAuthenticated from "./components/LayoutAuthenticated";
import LayoutUnauthenticated from "./components/LayoutUnauthenticated";
import User from "./models/User";

interface Props {
    routeComponentProps?: RouteComponentProps
}
interface State {
    firebase: Firebase
    idToken: string
    loggedInUser?: User
}

class App extends React.Component<Props, State> {

    state: State = {
        firebase: Firebase.getInstance(),
        idToken: ""
    }
    
    constructor(props:Props) {
        super(props)
        this.handleLoginSuccessful = this.handleLoginSuccessful.bind(this)
    }

    componentDidMount(): void {
        if (this.state.firebase.isUserAuthenticated()) {
            this.setState({loggedInUser: this.state.firebase.getLoggedInUser()})
            console.log("Login State: ", this.state)
        }
    }
    
    handleLoginSuccessful(user:User) {
        this.setState({loggedInUser: user})
    }

    render() {
        return <Router>
            <LayoutUnauthenticated onSuccess={this.handleLoginSuccessful} auth={this.state.loggedInUser} />
            <LayoutAuthenticated auth={this.state.loggedInUser} />
        </Router>

    }
}

export default App;
