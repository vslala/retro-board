import React from 'react';
import {HomePageModel} from "../interfaces/HomePageModel"
import {Col, Container, Row} from "react-bootstrap"
import MyBoards from "../views/smart/boards/MyBoards";
import TemplateManager from "../views/smart/templates/TemplateManager";
import {RETRO_BOARD_STYLES} from "../models/RetroBoard";
import CreateRetroBoardManager from "../views/smart/boards/CreateRetroBoardManager";

class HomePage extends React.Component<HomePageModel> {

    componentDidMount(): void {
        document.title = "Home";
    }

    render() {

        return <Container>
            <Row>
                <Col>
                    <div className={"pb-2 mt-4 mb-2 border-bottom"}>
                        <h3>Pre-built Templates</h3>
                    </div>
                    <CreateRetroBoardManager title={"Create Retro Board"}
                                             templateWalls={[
                        {wallTitle: "Went Well", wallStyle: RETRO_BOARD_STYLES.wentWell, wallOrder: 1, notes: []},
                        {wallTitle: "To Improve", wallStyle: RETRO_BOARD_STYLES.toImprove, wallOrder: 2, notes: []},
                        {wallTitle: "Action Items", wallStyle: RETRO_BOARD_STYLES.actionItems, wallOrder: 3, notes: []}
                    ]}/>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div className={"pb-2 mt-4 mb-2 border-bottom"}>
                        <h3>My Templates</h3>
                    </div>
                    <TemplateManager retroBoardService={this.props.retroBoardService}
                                     templateService={this.props.templateService}/>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div className={"pb-2 mt-4 mb-2 border-bottom"}>
                        <h3>My Boards</h3>
                    </div>
                    <MyBoards retroBoardService={this.props.retroBoardService}/>
                </Col>
            </Row>
        </Container>
    }
}

export default HomePage
