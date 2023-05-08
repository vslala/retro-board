import React, {useEffect, useState} from 'react'
import {Redirect, RouteComponentProps, withRouter} from "react-router-dom";
import Firebase from "../../../service/Firebase";
import Container from "react-bootstrap/Container";
import PageFooter from "../PageFooter";
import PageHeader from "../PageHeader";
import {Spinner} from "react-bootstrap";

interface Props extends RouteComponentProps {
}

interface State {
    isUserAuthenticated: boolean
    isLoading: boolean
}

const LayoutAuthenticated: React.FunctionComponent<Props> = (props) => {

    const [state, setState] = useState<State>({
        isUserAuthenticated: false,
        isLoading: true
    });

    useEffect(() => {
        Firebase.getInstance().isUserAuthenticated().then(response => {
            setState({isUserAuthenticated: response, isLoading: false});
        });
    }, []);


    if (state.isLoading) return <Spinner animation={"border"}/>;
    else if (state.isUserAuthenticated)
        return <Container fluid={true} className={"d-flex w-100 h-100 p-3 mx-auto flex-column"}>
            <PageHeader/>
            {props.children}
            <PageFooter/>
        </Container>
    else
        return <Redirect to={{pathname: "/login", state: {referrer: props.location.pathname}}}/>

}

export default withRouter(LayoutAuthenticated)
