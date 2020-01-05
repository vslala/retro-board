import React from 'react';
import {HomePageModel} from "../interfaces/HomePageModel"
import {Col, Container, Row} from "react-bootstrap"

class HomePage extends React.Component<HomePageModel> {

    constructor(props: HomePageModel) {
        super(props)
        this.createNewRetroBoard = this.createNewRetroBoard.bind(this)
    }

    createNewRetroBoard(e: React.MouseEvent<HTMLElement>) {
        e.preventDefault()
        const {history, retroBoardService} = this.props
        
        let retroBoardId = retroBoardService.createNewRetroBoard()
        
        history.push("/retro-board/" + retroBoardId)
    }

    render() {
        const {linkText} = this.props
        return <Container>
            <Row>
                <Col></Col>
                <Col>
                    <a href={"/#/"}
                       onClick={this.createNewRetroBoard}>{linkText ? linkText : 'Create New Retro Board'}</a>
                </Col>
                <Col></Col>
            </Row>
        </Container>
    }
}

export default HomePage