import React from 'react'
import {Redirect} from "react-router-dom";
import Firebase from "../service/Firebase";
import Container from "react-bootstrap/Container";
import PageFooter from "./PageFooter";
import PageHeader from "./PageHeader";

interface Props {
}

class LayoutAuthenticated extends React.Component<Props> {

    render(): JSX.Element {
        if (Firebase.getInstance().getLoggedInUser())
            return <Container fluid={true} className={"d-flex w-100 h-100 p-3 mx-auto flex-column"}>
                <PageHeader/>
                {this.props.children}
                <PageFooter />
            </Container>

        return <Redirect to={"/login"}/>
    }
}

export default LayoutAuthenticated