import React from 'react'
import {Dispatch} from 'redux'
import StickyWall from "../components/StickyWall";
import RetroBoardService from "../service/RetroBoard/RetroBoardService";
import {Col, Container, Row} from "react-bootstrap";
import {RouteComponentProps} from "react-router";
import RetroBoard from "../models/RetroBoard";
import RetroWalls from "../models/RetroWalls";
import {connect} from 'react-redux'
import RetroBoardState from "../redux/reducers/RetroBoardState";
import {RetroBoardActionTypes} from "../redux/types/RetroBoardActionTypes";
import RetroBoardActions from "../redux/actions/RetroBoardActions";
import Notes from "../models/Notes";
import RetroNavbar from "../components/RetroNavbar";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";

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
    createRetroWalls: (retroBoardId: string) => Promise<RetroBoardActionTypes>
    sortByVotes: (notes:Notes) => Promise<RetroBoardActionTypes>
}

type Props = PropsFromParent & StateFromReduxStore & DispatchProps

interface State {
    sortSelectValue: string
}


class RetroBoardPage extends React.Component<Props, State> {

    state: State = {
        sortSelectValue: "select"
    }

    constructor(props: Props) {
        super(props)
        this.refresh = this.refresh.bind(this)
        this.handleSort = this.handleSort.bind(this)
    }

    componentDidMount(): void {
        const {retroBoardId} = this.props.match.params as PropsFromParent
        localStorage.setItem(RetroBoardService.RETRO_BOARD_ID, retroBoardId!)
        
        if (retroBoardId) {
            this.props.createRetroWalls(retroBoardId)
        }

    }

    refresh(retroWalls: RetroWalls) {
        
    }
    
    handleSort(e:React.ChangeEvent<HTMLSelectElement>): void {
        let sortBy = e.target.value
        if (sortBy === "votes") {
            this.props.sortByVotes(this.props.notes)
            this.setState({sortSelectValue: "votes"})
        }
    }


    render() {
        let {retroBoardId} = this.props.match.params as PropsFromParent
        let walls = this.props.retroWalls.walls.map((wall, index) => {
            wall.retroBoardService = this.props.retroBoardService
            wall.retroBoardId = retroBoardId!
            return <Col md={4} key={index}>
                <StickyWall retroWall={wall}
                            notes={this.props.notes.notes}
                />
            </Col>
        })
        return (
            <div>
                <RetroNavbar />
                <Container>
                    <Row>
                        <Form>
                            <Form.Group>
                                <Form.Label>Sort cards: </Form.Label>
                                <FormControl as={"select"} onChange={this.handleSort} value={this.state.sortSelectValue}>
                                    <option defaultValue={"select"}>select...</option>
                                    <option defaultValue={"votes"} value={"votes"}>Sort by Up-votes</option>
                                </FormControl>
                            </Form.Group>
                        </Form>
                    </Row>
                    <Row>
                        {walls}
                    </Row>
                </Container>
            </div>
        )
    }

}

function mapStateToProps(state: RetroBoardState): RetroBoardState {
    

    return {
        retroBoard: state.retroBoard,
        retroWalls: state.retroWalls,
        notes: state.notes
    }
}

function mapDispatchToProps(dispatch: Dispatch<RetroBoardActionTypes>) {
    let service = RetroBoardService.getInstance()
    const retroBoardActions = new RetroBoardActions();


    return {
        createRetroWalls: async (retroBoardId: string) => dispatch(retroBoardActions.createRetroWalls(await service.createRetroWalls(retroBoardId))),
        sortByVotes: async (notes:Notes) => dispatch(retroBoardActions.sortByVotes(await service.sortByVotes(notes)))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RetroBoardPage)