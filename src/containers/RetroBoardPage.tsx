import React, {useState} from 'react'
import {Dispatch} from 'redux'
import StickyWall from "../components/StickyWall";
import {Button, Col, Form, FormControl, InputGroup, Row} from "react-bootstrap";
import {RouteComponentProps} from "react-router";
import RetroBoard from "../models/RetroBoard";
import RetroWalls from "../models/RetroWalls";
import {connect, TypedUseSelectorHook, useDispatch, useSelector as useReduxSelector} from 'react-redux'
import RetroBoardState from "../redux/reducers/RetroBoardState";
import {RetroBoardActionTypes, SortType} from "../redux/types/RetroBoardActionTypes";
import RetroBoardActions from "../redux/actions/RetroBoardActions";
import Notes from "../models/Notes";
import {CSVLink} from "react-csv";
import {Data, LabelKeyObject} from "react-csv/components/CommonPropTypes";
import {RetroBoardService} from "../service/RetroBoard/RetroBoardService";
import RetroBoardServiceFactory from "../service/RetroBoard/RetroBoardServiceFactory";
import Firebase from "../service/Firebase";

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
    createRetroBoard: (retroBoard: RetroBoard) => Promise<RetroBoardActionTypes>
    createRetroWalls: (retroWalls: RetroWalls) => Promise<RetroBoardActionTypes>
}

type Props = PropsFromParent & StateFromReduxStore & DispatchProps

interface State {
    sortSelectValue: SortType
}

const SortSelect: React.FunctionComponent = () => {
    const retroBoardActions = new RetroBoardActions()
    const dispatch = useDispatch()
    const [sortSelectValue, setSortSelectValue] = useState(SortType.NONE)

    const handleSort = function (e: React.ChangeEvent<HTMLSelectElement>): void {
        let sortBy = e.target.value
        if (sortBy === String(SortType.SORT_BY_VOTES)) {
            dispatch(retroBoardActions.sortByVotes())
            setSortSelectValue(SortType.SORT_BY_VOTES)
        }
    }

    return <Form>
        <Form.Group>
            <Form.Label>Sort cards: </Form.Label>
            <FormControl as={"select"} onChange={handleSort} data-testid={"sort_select"}
                         value={String(sortSelectValue)}>
                <option defaultValue={String(SortType.NONE)}>select...</option>
                <option defaultValue={String(SortType.SORT_BY_VOTES)}
                        value={SortType.SORT_BY_VOTES}>Sort by Up-votes
                </option>
            </FormControl>
        </Form.Group>
    </Form>
}

const BlurToggle: React.FunctionComponent<Props> = (props: Props) => {
    const useSelector: TypedUseSelectorHook<RetroBoardState> = useReduxSelector
    const retroBoardState = useSelector(state => state)
    const retroBoardActions = new RetroBoardActions()
    const dispatch = useDispatch()

    // if the board is not created by the logged in user
    // then do not show the blur feature
    if (props.retroBoard.userId !== Firebase.getInstance().getLoggedInUser()!.uid) {
        return <></>
    }

    const handleChange = async (val: "on" | "off") => {
        console.log("Value: ", val)
        
        let retroBoard: RetroBoard = {...retroBoardState.retroBoard}
        retroBoard.blur = val
        dispatch(retroBoardActions.createRetroBoard(await props.retroBoardService.updateRetroBoard(retroBoard)))
    }

    let isChecked = props.retroBoard.blur === "on" ? true : false;

    return <InputGroup className={"pull-right"}>
        <Form.Check
            checked={isChecked}
            type={"switch"}
            id={"switch_on"}
            label={"Blur On"}
            onChange={() => handleChange(isChecked ? "off" : "on")}
        />
    </InputGroup>
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
        localStorage.setItem("retroBoardId", retroBoardId!)

        if (retroBoardId && uid) {
            this.props.retroBoardService.getRetroBoardById(uid, retroBoardId)
                .then(retroBoard => {
                    document.title = retroBoard.name;
                    this.props.createRetroBoard(retroBoard);
                    this.props.retroBoardService.createRetroWalls(retroBoardId)
                        .then(retroWalls => this.props.createRetroWalls(retroWalls));
                });

            this.props.retroBoardService.getRetroBoardDataOnUpdate(uid, retroBoardId, (retroBoard => {
                console.log("RetroBoard: ", retroBoard);
                this.props.createRetroBoard(retroBoard)
            }))
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
                        <SortSelect/>
                    </Col>
                    <Col className={"align-self-center"}>
                        <BlurToggle {...this.props} />
                    </Col>
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
    const retroBoardActions = new RetroBoardActions();


    return {
        createRetroWalls: async (retroWalls: RetroWalls) => dispatch(retroBoardActions.createRetroWalls(retroWalls)),
        createRetroBoard: async (retroBoard: RetroBoard) => dispatch(retroBoardActions.createRetroBoard(retroBoard))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RetroBoardPage)