import React from 'react'
import StickyWall from "../components/StickyWall";
import RetroBoardService from "../service/RetroBoard/RetroBoardService";
import {RetroBoardModel} from "../interfaces/RetroBoardModel";
import {Col, Container, Row} from "react-bootstrap";

interface Props {
}

interface RetroBoardState {
    model?: RetroBoardModel
}


class RetroBoard extends React.Component<Props, RetroBoardState> {
    state: RetroBoardState = {
        model: {data: []} // init data
    }

    componentDidMount(): void {
        this.setState({model: new RetroBoardService().getData()})
    }

    render() {
        let walls = this.state.model!.data.map((wall, index) => {
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