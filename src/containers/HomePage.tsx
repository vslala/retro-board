import React from 'react';
import {HomePageModel} from "../interfaces/HomePageModel"
import {Col, Container, Row} from "react-bootstrap"
import CreateRetroBoard from "../components/retro-board/CreateRetroBoard";
import MyBoards from "../components/retro-board/MyBoards";
import Firebase from "../service/Firebase";

class HomePage extends React.Component<HomePageModel> {

    constructor(props: HomePageModel) {
        super(props)
        this.createNewRetroBoard = this.createNewRetroBoard.bind(this)
    }

    componentDidMount(): void {
        document.title = "Home";
    }

    createNewRetroBoard(e: React.MouseEvent<HTMLElement>) {
        e.preventDefault()
        const {history} = this.props

        let retroBoardId = String(Date.now())
        history.push(`/retro-board/${Firebase.getInstance().getLoggedInUser()!.uid}/${retroBoardId}`)
    }

    render() {
        return <Container>
                <Row>
                    <Col>
                        <div className={"pb-2 mt-4 mb-2 border-bottom"}>
                            <h3>Create Boards</h3>
                        </div>
                        <CreateRetroBoard retroBoardService={this.props.retroBoardService}/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className={"pb-2 mt-4 mb-2 border-bottom"}>
                            <h3>My Boards</h3>
                        </div>
                        <MyBoards retroBoardService={this.props.retroBoardService} />
                    </Col>
                </Row>
        </Container>
    }
}

export default HomePage