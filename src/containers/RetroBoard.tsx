import React from 'react'
import StickyWall from "../components/StickyWall";
import RetroBoardService from "../service/RetroBoard/RetroBoardService";
import {RetroBoardModel} from "../interfaces/RetroBoardModel";
import {Col, Container, Row} from "react-bootstrap";
import {RouteComponentProps} from "react-router";
import * as TheRetroBoard from "../models/RetroBoard";

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

    constructor(props: Props) {
        super(props)
        this.refresh = this.refresh.bind(this)
    }

    componentDidMount(): void {
        const {retroBoardId} = this.props.match.params as Props
        localStorage.setItem(RetroBoardService.RETRO_BOARD_ID, retroBoardId!)
        if (retroBoardId) {
            this.props.retroBoardService.getData(retroBoardId)
                .then((retroBoard) => {
                    if (retroBoard)
                        this.setState({retroBoard: retroBoard})
                })
                .finally(() => this.props.retroBoardService.getDataOnUpdate(retroBoardId!, this.refresh))
        }
        
    }

    refresh(theRetroBoard: TheRetroBoard.default) {
        console.log("Data Changed: ", theRetroBoard)
        const {retroBoardId} = this.props.match.params as Props
        this.setState({retroBoard: new TheRetroBoard.default(retroBoardId!, [])})
        this.setState({retroBoard: new TheRetroBoard.default(retroBoardId!, theRetroBoard.retroWalls)})
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