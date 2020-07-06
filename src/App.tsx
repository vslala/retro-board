import React from 'react';
import {HashRouter as Router} from 'react-router-dom'
import './App.css';
import LayoutAuthenticated from "./components/smart/layouts/LayoutAuthenticated";
import LayoutUnauthenticated from "./components/smart/layouts/LayoutUnauthenticated";
import {Provider} from "react-redux";
import store from "./redux/store/Store";
import Firebase from "./service/Firebase";
import {Route, RouteComponentProps} from "react-router";
import HomePage from "./containers/HomePage";
import RetroBoardPage from "./containers/RetroBoardPage";
import LoginPage from "./containers/LoginPage";
import Logout from "./components/smart/Logout";
import RetroBoardServiceFactory from "./service/RetroBoard/RetroBoardServiceFactory";
import TeamsPage from "./containers/TeamsPage";
import TeamsServiceV1 from "./service/Teams/TeamsServiceV1";
import TemplateService from "./service/Templates/TemplateService";

interface Props {
}

interface State {
    isLogInFlowExecuted: boolean
}

class App extends React.Component<Props, State> {

    state: State = {
        isLogInFlowExecuted: false
    }

    render() {
        return <Provider store={store}>
            <Router>
                <Route exact path={"/login"} component={(props: RouteComponentProps) =>
                    <LayoutUnauthenticated success={() => this.setState({isLogInFlowExecuted: true})}>
                        <LoginPage
                            success={() => this.setState({isLogInFlowExecuted: true})}/>
                    </LayoutUnauthenticated>}/>

                <Route exact path={"/"} component={(props: RouteComponentProps) =>
                    <LayoutAuthenticated>
                        <HomePage {...props}
                                  retroBoardService={RetroBoardServiceFactory.getInstance()}
                                  templateService={TemplateService.getInstance()}/>
                    </LayoutAuthenticated>}/>

                <Route exact path={"/teams"} component={(props: RouteComponentProps) =>
                    <LayoutAuthenticated>
                        <TeamsPage {...props}
                                  teamsService={TeamsServiceV1.getInstance()}/>
                    </LayoutAuthenticated>}/>

                <Route exact path={"/retro-board/:uid/:retroBoardId"} component={(props: RouteComponentProps) =>
                    <LayoutAuthenticated>
                        <RetroBoardPage {...props}
                                        retroBoardService={RetroBoardServiceFactory.getInstance()}
                                        teamsService={TeamsServiceV1.getInstance()}/>
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
