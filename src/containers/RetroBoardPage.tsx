import React from 'react'
import StickyWall from "../components/StickyWall";
import RetroBoardService from "../service/RetroBoard/RetroBoardService";
import {Col, Container, Row} from "react-bootstrap";
import {RouteComponentProps} from "react-router";
import RetroBoard from "../models/RetroBoard";
import Toggle from "../components/Toggle";
import RetroWalls from "../models/RetroWalls";

interface Props extends RouteComponentProps {
    retroBoardId?: string
    retroBoardService: RetroBoardService
}

interface RetroBoardState {
    retroBoard: RetroBoard
    retroWalls: RetroWalls
    sortCards: boolean
}


class RetroBoardPage extends React.Component<Props, RetroBoardState> {
    state: RetroBoardState = {
        retroBoard: new RetroBoard("", ""), // init data
        retroWalls: new RetroWalls([]),
        sortCards: false
    }

    constructor(props: Props) {
        super(props)
        this.refresh = this.refresh.bind(this)
        this.sortCards = this.sortCards.bind(this)
    }

    componentDidMount(): void {
        const {retroBoardId} = this.props.match.params as Props
        localStorage.setItem(RetroBoardService.RETRO_BOARD_ID, retroBoardId!)
        
        if (retroBoardId) {
            this.props.retroBoardService.getRetroBoardById(retroBoardId)
                .then((retroBoard) => {
                    this.setState({retroBoard: retroBoard})
                })
                // .finally(() => this.props.retroBoardService.getDataOnUpdate(retroBoardId, this.refresh))
            
            this.props.retroBoardService.getRetroWalls(retroBoardId)
                .then((retroWalls) => {
                    this.setState({retroWalls: retroWalls})
                })
        }

    }

    refresh(retroWalls: RetroWalls) {
        console.log("Data Changed: ", retroWalls)
        this.setState({retroWalls: retroWalls})
    }

    sortCards(): void {
        this.setState({sortCards: true})
    }


    render() {
        let {retroBoardId} = this.props.match.params as Props
        let walls = this.state.retroWalls.walls.map((wall, index) => {
            wall.retroBoardService = this.props.retroBoardService
            wall.retroBoardId = retroBoardId!
            return <Col md={4} key={index}>
                <StickyWall retroWall={wall}
                            sortCards={this.state.sortCards}
                            />
            </Col>
        })
        return (
            <Container>
                <Row>
                    <Col md={4}><Toggle onSort={this.sortCards}/></Col>
                </Row>
                <Row>
                    {walls}
                </Row>
            </Container>
        )
    }

}

export default RetroBoardPage