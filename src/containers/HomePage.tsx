import React from 'react';
import {HomePageModel} from "../interfaces/HomePageModel"
import {Col, Container, Row} from "react-bootstrap"
import CreateRetroBoard from "../components/CreateRetroBoard";
import RetroNavbar from "../components/RetroNavbar";

class HomePage extends React.Component<HomePageModel> {

    constructor(props: HomePageModel) {
        super(props)
        this.createNewRetroBoard = this.createNewRetroBoard.bind(this)
    }

    createNewRetroBoard(e: React.MouseEvent<HTMLElement>) {
        e.preventDefault()
        const {history} = this.props

        let retroBoardId = String(Date.now())
        history.push("/retro-board/" + retroBoardId)
    }

    render() {
        return <>
            <RetroNavbar />
            <Container>
                <Row>
                    <Col></Col>
                    <Col>
                        <CreateRetroBoard retroBoardService={this.props.retroBoardService}/>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>
        </>
    }
}

export default HomePage