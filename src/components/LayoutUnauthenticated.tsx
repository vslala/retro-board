import React from 'react'
import {Redirect} from "react-router-dom";
import LoginPage from "../containers/LoginPage";
import User from "../models/User";

interface Props {
    onSuccess: (user:User) => void
    auth?: User
}
class LayoutUnauthenticated extends React.Component<Props> {

    render(): JSX.Element {
        if (this.props.auth)
            return <Redirect to={"/"} />
        return <LoginPage onSuccess={this.props.onSuccess} />
    }
}

export default LayoutUnauthenticated