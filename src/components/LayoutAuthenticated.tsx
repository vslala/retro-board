import React from 'react'
import {Route, RouteComponentProps} from "react-router";
import HomePage from "../containers/HomePage";
import RetroBoardService from "../service/RetroBoard/RetroBoardService";
import RetroBoardPage from "../containers/RetroBoardPage";
import {Redirect} from "react-router-dom";
import Firebase from "../service/Firebase";

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
            return AUTH_ROUTES
        
        return <Redirect to={"/login"}/>
    }
}

export default LayoutAuthenticated