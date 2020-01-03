import React from 'react';
import {Link} from 'react-router-dom'
import {HomePageModel} from "../interfaces/HomePageModel"
import {Col, Container, Row} from "react-bootstrap"

class HomePage extends React.Component<HomePageModel> {

    constructor(props: HomePageModel) {
        super(props)
        this.createNewRetroBoard = this.createNewRetroBoard.bind(this)
    }

    createNewRetroBoard() {
        
    }

    render() {
        const {linkText, linkUrl} = this.props
        return <Container>
            <Row>
                <Col></Col>
                <Col>
                    <Link onClick={this.createNewRetroBoard}
                        to={linkUrl ? linkUrl : "/retro-board"}>{linkText ? linkText : 'Create New Retro Board'}</Link>
                </Col>
                <Col></Col>
            </Row>
        </Container>
    }
}

export default HomePage