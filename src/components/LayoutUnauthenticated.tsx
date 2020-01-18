import React from 'react'
import {Redirect, RouteComponentProps, withRouter} from "react-router-dom";
import LoginPage from "../containers/LoginPage";
import Firebase from "../service/Firebase";

interface Props extends RouteComponentProps {
}

class LayoutUnauthenticated extends React.Component<Props> {

    render(): JSX.Element {
        
        const {pathname, search} = this.props.location
        
        // if user is logged in and requests for login page
        // then redirect it to home (/)
        // otherwise, forward the request to original address
        if (Firebase.getInstance().getLoggedInUser()) {
            if (pathname.includes("login"))
                return <Redirect to={"/"} />
            return <Redirect to={`${pathname}${search}`}/>
        }

        return <LoginPage />
    }
}

export default withRouter(LayoutUnauthenticated)