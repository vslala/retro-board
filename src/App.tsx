import React from 'react';
import {HashRouter as Router} from 'react-router-dom'
import './App.css';
import LayoutAuthenticated from "./components/LayoutAuthenticated";
import LayoutUnauthenticated from "./components/LayoutUnauthenticated";
import {Provider} from "react-redux";
import store from "./redux/store/Store";
import Firebase from "./service/Firebase";
import {Route, RouteComponentProps} from "react-router";
import HomePage from "./containers/HomePage";
import RetroBoardPage from "./containers/RetroBoardPage";
import LoginPage from "./containers/LoginPage";
import Logout from "./components/Logout";
import RetroBoardServiceFactory from "./service/RetroBoard/RetroBoardServiceFactory";

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
        return <Provider store={store}>
            <Router>
                <Route exact path={"/login"} component={(props: RouteComponentProps) =>
                    <LayoutUnauthenticated success={() => this.setState({isLoggedIn: true})}>
                        <LoginPage
                            success={() => this.setState({isLoggedIn: true})}/>
                    </LayoutUnauthenticated>}/>

                <Route exact path={"/"} component={(props: RouteComponentProps) =>
                    <LayoutAuthenticated>
                        <HomePage {...props}
                                  retroBoardService={RetroBoardServiceFactory.getInstance()}/>
                    </LayoutAuthenticated>}/>

                <Route exact path={"/retro-board/:uid/:retroBoardId"} component={(props: RouteComponentProps) =>
                    <LayoutAuthenticated>
                        <RetroBoardPage {...props}
                                        retroBoardService={RetroBoardServiceFactory.getInstance()}/>
                    </LayoutAuthenticated>}/>

                    <Route exact path={"/logout"} component={(props: RouteComponentProps) =>
                    <LayoutAuthenticated>
                        <Logout service={Firebase.getInstance()} />
                    </LayoutAuthenticated>}/>
            </Router>
        </Provider>

    }
}

export default App;
