import React from 'react'
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Firebase from "../service/Firebase";
import Button from "react-bootstrap/Button";
import {RouteComponentProps, withRouter} from 'react-router-dom';

interface Props extends RouteComponentProps {
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
                this.props.history.push("/")
            })
        }
    }

    render(): JSX.Element {
        
        return <Container>
            <Row>
                <Col></Col>
                <Col>
                    <h2>Login Here!</h2>
                    <Button className="btn btn-block btn-social btn-google" onClick={this.tryGoogleLogin}>
                        <span className="fa fa-google"></span>
                        Sign in with Google
                    </Button>
                </Col>
                <Col></Col>
            </Row>
        </Container>
    }
}

export default withRouter(LoginPage)