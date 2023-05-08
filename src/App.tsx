import React, {useState} from 'react';
import {HashRouter as Router, Route, RouteProps, Routes} from 'react-router-dom'
import './App.css';
import LayoutAuthenticated from "./views/smart/layouts/LayoutAuthenticated";
import LayoutUnauthenticated from "./views/smart/layouts/LayoutUnauthenticated";
import {Provider} from "react-redux";
import store from "./redux/store/Store";
import Firebase from "./service/Firebase";
import HomePage from "./containers/HomePage";
import RetroBoardPage from "./containers/RetroBoardPage";
import LoginPage from "./containers/LandingPage";
import Logout from "./views/smart/Logout";
import RetroBoardServiceFactory from "./service/RetroBoard/RetroBoardServiceFactory";
import TeamsPage from "./containers/TeamsPage";
import TeamsServiceV1 from "./service/Teams/TeamsServiceV1";
import TemplateService from "./service/Templates/TemplateService";
import './App.css';

interface Props {
}

interface State {
    isLogInFlowExecuted: boolean
}

const App: React.FunctionComponent<Props> = () => {

    const [state, setState] = useState<State>({isLogInFlowExecuted: false});

    return <Provider store={store}>
        <Router>
            <Routes>
                <Route path={"/login"} element={
                    <LayoutUnauthenticated success={() => setState({isLogInFlowExecuted: true})}>
                        <LoginPage
                            success={() => setState({isLogInFlowExecuted: true})}/>
                    </LayoutUnauthenticated>}
                />

                <Route path={"/"} element={
                    <LayoutAuthenticated>
                        <HomePage
                            retroBoardService={RetroBoardServiceFactory.getInstance()}
                            templateService={TemplateService.getInstance()}
                        />
                    </LayoutAuthenticated>}
                />

                <Route path={"/teams"} element={
                    <LayoutAuthenticated>
                        <TeamsPage
                            teamsService={TeamsServiceV1.getInstance()}/>
                    </LayoutAuthenticated>}
                />

                <Route path={"/retro-board/:uid/:retroBoardId"} element={
                    <LayoutAuthenticated>
                        <RetroBoardPage />
                    </LayoutAuthenticated>}
                />

                <Route path={"/logout"} element={
                    <LayoutAuthenticated>
                        <Logout service={Firebase.getInstance()}/>
                    </LayoutAuthenticated>}
                />
            </Routes>

        </Router>
    </Provider>
}

export default App;
