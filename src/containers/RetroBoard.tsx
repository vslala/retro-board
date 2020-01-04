import React from 'react'
import StickyWall from "../components/StickyWall";
import RetroBoardService from "../service/RetroBoard/RetroBoardService";
import {RetroBoardModel} from "../interfaces/RetroBoardModel";
import {Col, Container, Row} from "react-bootstrap";
import {RouteComponentProps} from "react-router";

interface Props extends RouteComponentProps {
    retroBoardId?: string
    retroBoardService: RetroBoardService
}

interface RetroBoardState {
    retroBoard?: RetroBoardModel
}


class RetroBoard extends React.Component<Props, RetroBoardState> {
    state: RetroBoardState = {
        retroBoard: {retroWalls: []} // init data
    }

    componentDidMount(): void {
        console.log("Retro Board ID: ", this.props.match.params)
        const {retroBoardId} = this.props.match.params as Props
        if (retroBoardId) {
            this.props.retroBoardService.getData(retroBoardId).then((retroBoard) => {
                if (retroBoard)
                    this.setState({retroBoard: retroBoard})
            })
        }
    }

    render() {
        let walls = this.state.retroBoard!.retroWalls.map((wall, index) => {
            return <Col md={4} key={index}>
                <StickyWall retroBoardService={this.props.retroBoardService} 
                    wallId={wall.wallId}
                    title={wall.title} 
                    stickyNotes={wall.notes} 
                    style={wall.style}/>
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