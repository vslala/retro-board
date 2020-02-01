import React, {useState} from 'react'
import {Dispatch} from 'redux'
import StickyWall from "../components/StickyWall";
import RetroBoardService from "../service/RetroBoard/RetroBoardService";
import {Col, Row} from "react-bootstrap";
import {RouteComponentProps} from "react-router";
import RetroBoard from "../models/RetroBoard";
import RetroWalls from "../models/RetroWalls";
import {connect, useDispatch} from 'react-redux'
import RetroBoardState from "../redux/reducers/RetroBoardState";
import {RetroBoardActionTypes, SortType} from "../redux/types/RetroBoardActionTypes";
import RetroBoardActions from "../redux/actions/RetroBoardActions";
import Notes from "../models/Notes";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import {CSVLink} from "react-csv";
import {Data, LabelKeyObject} from "react-csv/components/CommonPropTypes";

interface PropsFromParent extends RouteComponentProps {
    uid?: string
    retroBoardId?: string
    retroBoardService: RetroBoardService
}

interface StateFromReduxStore {
    retroBoard: RetroBoard
    retroWalls: RetroWalls
    notes: Notes
}

interface DispatchProps {
    createRetroBoard: (uid: string, retroBoardId: string) => Promise<RetroBoardActionTypes>
    createRetroWalls: (retroBoardId: string) => Promise<RetroBoardActionTypes>
}

type Props = PropsFromParent & StateFromReduxStore & DispatchProps

interface State {
    sortSelectValue: SortType
}

const SortSelect: React.FunctionComponent = () => {
    const retroBoardActions = new RetroBoardActions()
    const dispatch = useDispatch()
    const [sortSelectValue, setSortSelectValue] = useState(SortType.NONE)
    
    const handleSort = function(e: React.ChangeEvent<HTMLSelectElement>): void {
        let sortBy = e.target.value
        if (sortBy === String(SortType.SORT_BY_VOTES)) {
            dispatch(retroBoardActions.sortByVotes())
            setSortSelectValue(SortType.SORT_BY_VOTES)
        }
    }
    
    return <Form>
        <Form.Group>
            <Form.Label>Sort cards: </Form.Label>
            <FormControl as={"select"} onChange={handleSort}
                         value={String(sortSelectValue)}>
                <option defaultValue={String(SortType.NONE)}>select...</option>
                <option defaultValue={String(SortType.SORT_BY_VOTES)}
                        value={SortType.SORT_BY_VOTES}>Sort by Up-votes
                </option>
            </FormControl>
        </Form.Group>
    </Form>
}

class RetroBoardPage extends React.Component<Props, State> {

    state: State = {
        sortSelectValue: SortType.NONE
    }

    constructor(props: Props) {
        super(props)
        this.convertJsonToCsv = this.convertJsonToCsv.bind(this)
    }

    componentDidMount(): void {
        const {retroBoardId, uid} = this.props.match.params as PropsFromParent
        localStorage.setItem(RetroBoardService.RETRO_BOARD_ID, retroBoardId!)

        if (retroBoardId && uid) {
            this.props.createRetroBoard(uid, retroBoardId)
            this.props.createRetroWalls(retroBoardId)
        }

    }

    

    convertJsonToCsv(): { data: Data, headers: LabelKeyObject[] } {
        let headers: LabelKeyObject[] = [
            {label: "Wall Name", key: "wallName"},
            {label: "Note", key: "noteText"},
            {label: "Up-votes", key: "upvotes"}
        ]

        let data: Data = []
        const {notes, retroWalls} = this.props

        retroWalls.walls.forEach((wall) => {
            notes.notes.forEach((note) => {
                if (note.wallId === wall.wallId) {
                    data.push(
                        {wallName: wall.title, noteText: note.noteText, upvotes: note.likedBy?.length || 0}
                    )
                }
            })
        })

        return {data: data, headers: headers}
    }


    render() {
        let {retroBoardId} = this.props.match.params as PropsFromParent
        let walls = this.props.retroWalls.walls.map((wall, index) => {
            wall.retroBoardService = this.props.retroBoardService
            wall.retroBoardId = retroBoardId!
            return <Col md={4} key={index}>
                <StickyWall retroWall={wall}
                            notes={this.props.notes.notes}
                            sortBy={this.state.sortSelectValue}
                />
            </Col>
        })
        return (
            <div style={{padding: "50px"}}>
                <Row>
                    <Col>
                        <SortSelect />
                    </Col>
                    <Col></Col>
                    <Col className={"align-self-center"}>
                        <Button className={"pull-right"} variant={"info"}>
                            <CSVLink {...this.convertJsonToCsv()} target={"_blank"}
                                     filename={this.props.retroBoard.name}><i className="fa fa-print"
                                                                              style={{color: "white"}}></i></CSVLink>
                        </Button>
                    </Col>
                </Row>
                <Row>
                    {walls}
                </Row>
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
        createRetroBoard: async (uid: string, retroBoardId: string) => dispatch(retroBoardActions.createRetroBoard(await service.getRetroBoardById(uid, retroBoardId)))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RetroBoardPage)