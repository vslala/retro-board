import React from 'react';
import {Link} from 'react-router-dom'
import {HomePageModel} from "../interfaces/HomePageModel"
import {Col, Container, Row} from "react-bootstrap"

class HomePage extends React.Component<HomePageModel> {
    
    render() {
        const {linkText, linkUrl} = this.props
        return <Container>
            <Row>
                <Col></Col>
                <Col>
                    <Link
                        to={linkUrl ? linkUrl : "/retro-board"}>{linkText ? linkText : 'Create New Retro Board'}</Link>
                </Col>
                <Col></Col>
            </Row>
        </Container>
    }
}

export default HomePage