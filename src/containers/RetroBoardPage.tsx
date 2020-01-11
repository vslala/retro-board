import React from 'react'
import {Dispatch} from 'redux'
import StickyWall from "../components/StickyWall";
import RetroBoardService from "../service/RetroBoard/RetroBoardService";
import {Col, Container, Row} from "react-bootstrap";
import {RouteComponentProps} from "react-router";
import RetroBoard from "../models/RetroBoard";
import Toggle from "../components/Toggle";
import RetroWalls from "../models/RetroWalls";
import {connect} from 'react-redux'
import RetroBoardState from "../redux/reducers/RetroBoardState";
import {RetroBoardActionTypes} from "../redux/types/RetroBoardActionTypes";
import RetroBoardActions from "../redux/actions/RetroBoardActions";
import Notes from "../models/Notes";

interface PropsFromParent extends RouteComponentProps {
    retroBoardId?: string
    retroBoardService: RetroBoardService
}

interface StateFromReduxStore {
    retroBoard: RetroBoard
    retroWalls: RetroWalls
    notes: Notes
}

interface DispatchProps {
    createRetroBoard: (retroBoardId: string) => RetroBoardActionTypes
}

type Props = PropsFromParent & StateFromReduxStore & DispatchProps

interface State {
    retroBoard: RetroBoard
    retroWalls: RetroWalls
    sortCards: boolean
}


class RetroBoardPage extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.refresh = this.refresh.bind(this)
        this.sortCards = this.sortCards.bind(this)
    }

    componentDidMount(): void {
        const {retroBoardId} = this.props.match.params as PropsFromParent
        localStorage.setItem(RetroBoardService.RETRO_BOARD_ID, retroBoardId!)

        if (retroBoardId) {
            this.props.createRetroBoard(retroBoardId)
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
        let {retroBoardId} = this.props.match.params as PropsFromParent
        let walls = this.props.retroWalls.walls.map((wall, index) => {
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

function mapStateToProps(state: RetroBoardState): RetroBoardState {
    console.log("Mapping state to props...", state)
    return {
        retroBoard: state.retroBoard,
        retroWalls: state.retroWalls,
        notes: state.notes
    }
}

function mapDispatchToProps(dispatch: Dispatch<RetroBoardActionTypes>) {
    let service = RetroBoardService.getInstance()
    return {
        createRetroBoard: (retroBoardId:string) => dispatch(new RetroBoardActions().createRetroBoard(service.createNewRetroBoard(retroBoardId)))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RetroBoardPage)