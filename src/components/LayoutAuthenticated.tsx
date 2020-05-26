import React from 'react'
import {Redirect, RouteComponentProps, withRouter} from "react-router-dom";
import Firebase from "../service/Firebase";
import Container from "react-bootstrap/Container";
import PageFooter from "./PageFooter";
import PageHeader from "./PageHeader";
import {Spinner} from "react-bootstrap";

interface Props extends RouteComponentProps {
}

interface State {
    isUserAuthenticated: boolean
    isLoading: boolean
}

class LayoutAuthenticated extends React.Component<Props, State> {

    state: State = {
        isUserAuthenticated: false,
        isLoading: true
    };

    componentDidMount(): void {
        Firebase.getInstance().isUserAuthenticated().then(response => {
            this.setState({isUserAuthenticated: response, isLoading: false});
        });
    }

    render(): JSX.Element {
        if (this.state.isLoading) return <Spinner animation={"border"} />;
        else if (this.state.isUserAuthenticated)
            return <Container fluid={true} className={"d-flex w-100 h-100 p-3 mx-auto flex-column"}>
                <PageHeader/>
                {this.props.children}
                <PageFooter/>
            </Container>
        else
            return <Redirect to={{pathname: "/login", state: {referrer: this.props.location.pathname}}}/>
    }
}

export default withRouter(LayoutAuthenticated)