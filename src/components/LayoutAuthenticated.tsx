import React from 'react'
import {Route, RouteComponentProps} from "react-router";
import HomePage from "../containers/HomePage";
import RetroBoardService from "../service/RetroBoard/RetroBoardService";
import RetroBoardPage from "../containers/RetroBoardPage";
import {Redirect} from "react-router-dom";
import Firebase from "../service/Firebase";

interface Props {
}


class LayoutAuthenticated extends React.Component<Props> {

    render(): JSX.Element {

        return <div>
            <Route exact path={"/"} component={(props: RouteComponentProps) => <HomePage {...props}
                                                                                         retroBoardService={RetroBoardService.getInstance()}/>}/>
            <Route exact path={"/retro-board/:retroBoardId"}
                   component={(props: RouteComponentProps) => <RetroBoardPage {...props}
                                                                              retroBoardService={RetroBoardService.getInstance()}/>}/>
            
            {Firebase.getInstance().getLoggedInUser()?null:<Redirect to={"/login"} />}                                                                               
        </div>
    }
}

export default LayoutAuthenticated