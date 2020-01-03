import React from 'react'
import StickyWall from "../components/StickyWall";
import RetroBoardService from "../service/RetroBoard/RetroBoardService";
import {RetroBoardModel} from "../interfaces/RetroBoardModel";
import {Col, Container, Row} from "react-bootstrap";

interface Props {
}

interface RetroBoardState {
    retroBoard?: RetroBoardModel
}


class RetroBoard extends React.Component<Props, RetroBoardState> {
    state: RetroBoardState = {
        retroBoard: {retroWalls: []} // init data
    }

    componentDidMount(): void {
        new RetroBoardService().getData().then((retroBoard) => {
            this.setState({retroBoard: retroBoard})
        })
    }

    render() {
        let walls = this.state.retroBoard!.retroWalls.map((wall, index) => {
            return <Col md={4} key={index}>
                <StickyWall title={wall.title} stickyNotes={wall.notes} style={wall.style}/>
            </Col>
        })
        return (
            <Container>
                <Row>
                    {walls}
                </Row>
            </Container>
        )
    }

}

export default RetroBoard