import React from 'react'
import {Route, RouteComponentProps} from "react-router";
import HomePage from "../containers/HomePage";
import RetroBoardService from "../service/RetroBoard/RetroBoardService";
import RetroBoardPage from "../containers/RetroBoardPage";
import {Redirect} from "react-router-dom";
import User from "../models/User";

interface Props {
    auth?: User
}


class LayoutAuthenticated extends React.Component<Props> {
    
    render(): JSX.Element {
        if (!this.props.auth)
            return <Redirect to={"/login"} />
        return <div>
            <Route exact path={"/"} component={(props: RouteComponentProps) => <HomePage {...props}
                                                                                                  retroBoardService={RetroBoardService.getInstance()}/>}/>
            <Route exact path={"/retro-board/:retroBoardId"}
                   component={(props: RouteComponentProps) => <RetroBoardPage {...props}
                                                                              retroBoardService={RetroBoardService.getInstance()}/>}/>
        </div>
    }
}

export default LayoutAuthenticated