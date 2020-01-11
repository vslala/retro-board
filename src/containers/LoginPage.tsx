import React from 'react'
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Firebase from "../service/Firebase";
import User from "../models/User";

interface Props {
    onSuccess: (loggedInUser:User) => void
}

interface State {
    firebase: Firebase
    idToken: string
}

class LoginPage extends React.Component<Props, State> {

    state: State = {
        firebase: Firebase.getInstance(),
        idToken: ""
    }

    constructor(props: Props) {
        super(props)
        this.tryGoogleLogin = this.tryGoogleLogin.bind(this)
    }

    tryGoogleLogin() {
        if (!this.state.firebase.isUserAuthenticated()) {
            this.state.firebase.authenticateUser().then(() => {
                this.props.onSuccess(this.state.firebase.getLoggedInUser())
            })
        }
    }

    render(): JSX.Element {
        
        return <Container>
            <Row>
                <Col></Col>
                <Col>
                    <h2>Login Here!</h2>
                    <a className="btn btn-block btn-social btn-google" onClick={this.tryGoogleLogin}>
                        <span className="fa fa-google"></span>
                        Sign in with Google
                    </a>
                </Col>
                <Col></Col>
            </Row>
        </Container>
    }
}

export default LoginPage