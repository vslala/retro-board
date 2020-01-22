import React from 'react'
import {Route, RouteComponentProps} from "react-router";
import HomePage from "../containers/HomePage";
import RetroBoardService from "../service/RetroBoard/RetroBoardService";
import RetroBoardPage from "../containers/RetroBoardPage";
import {Redirect} from "react-router-dom";
import Firebase from "../service/Firebase";
import Container from "react-bootstrap/Container";
import PageFooter from "./PageFooter";
import PageHeader from "./PageHeader";

interface Props {
}

const AUTH_ROUTES = <>
    <Route exact path={"/"} component={(props: RouteComponentProps) => <HomePage {...props}
                                                                                 retroBoardService={RetroBoardService.getInstance()}/>}/>
    <Route exact path={"/retro-board/:retroBoardId"}
           component={(props: RouteComponentProps) => <RetroBoardPage {...props}
                                                                      retroBoardService={RetroBoardService.getInstance()}/>}/>
</>

class LayoutAuthenticated extends React.Component<Props> {

    render(): JSX.Element {
        if (Firebase.getInstance().getLoggedInUser())
            return <Container fluid={true} className={"d-flex w-100 h-100 p-3 mx-auto flex-column"}>
                <PageHeader/>
                {AUTH_ROUTES}
                <PageFooter />
            </Container>

        return <Redirect to={"/login"}/>
    }
}

export default LayoutAuthenticated