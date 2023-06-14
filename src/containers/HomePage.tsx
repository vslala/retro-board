import {useEffect} from 'react';
import {HomePageModel} from "../interfaces/HomePageModel"
import {Col, Container, Row} from "react-bootstrap"
import MyBoards from "../views/MyBoards";
import TemplateManager from "../views/TemplateManager";
import CreateRetroBoard from "../components/create-retro-board/CreateRetroBoard";

const HomePage: React.FunctionComponent<HomePageModel> = (props) => {

    useEffect(() => {
        document.title = "Home";
    }, [])

    return <Container>
        <Row>
            <Col>
                <div className={"pb-2 mt-4 mb-2 border-bottom"}>
                    <h3>Pre-built Templates</h3>
                </div>
                <CreateRetroBoard title={"Create New Retro Board"}/>
            </Col>
        </Row>
        <Row>
            <Col>
                <div className={"pb-2 mt-4 mb-2 border-bottom"}>
                    <h3>My Templates</h3>
                </div>
                <TemplateManager retroBoardService={props.retroBoardService}
                                 templateService={props.templateService}/>
            </Col>
        </Row>
        <Row>
            <Col>
                <div className={"pb-2 mt-4 mb-2 border-bottom"}>
                    <h3>My Boards</h3>
                </div>
                <MyBoards retroBoardService={props.retroBoardService}/>
            </Col>
        </Row>
    </Container>
}

export default HomePage
