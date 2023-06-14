import * as React from 'react';
import {useEffect, useState} from 'react';
import CreateNewTemplate from "./CreateNewTemplate";
import BoardTemplate from "../models/BoardTemplate";
import TemplateService from "../service/Templates/TemplateService";
import {Button, Card, Col, Row} from "react-bootstrap";
import {RetroBoardService} from "../service/RetroBoard/RetroBoardService";
import DisplayBoardTemplate from "./DisplayBoardTemplate";
import CreateRetroBoard from "../components/create-retro-board/CreateRetroBoard";

interface Props {
    templateService: TemplateService
    retroBoardService: RetroBoardService
}

const TemplateManager: React.FunctionComponent<Props> = (props: Props) => {

    const [templates, setTemplates] = useState<Array<BoardTemplate>>([]);

    const handleCreateTemplate = async (boardTemplate: BoardTemplate) => {
        let persistedBoardTemplate = await props.templateService.createBoardTemplate(boardTemplate)
        setTemplates([...templates, persistedBoardTemplate]);
    };

    const deleteTemplate = async (boardTemplate: BoardTemplate) => {
        await props.templateService.deleteBoardTemplate(boardTemplate);
        setTemplates(templates.filter(template => template.templateId !== boardTemplate.templateId));
    }

    useEffect(() => {
        props.templateService.getBoardTemplates()
            .then(boardTemplates => {
                setTemplates(boardTemplates.templates);
            });
    }, [props.templateService]);

    return <>
        <Row>
            <Col md={1}>
                <CreateNewTemplate onCreateTemplate={handleCreateTemplate}/>
            </Col>

            {templates.map((template, index) => (
                <Col key={index} md={3}>
                    <Card>
                        <Card.Body>
                                <div key={index}>
                                    <Card.Title>{template.templateTitle}</Card.Title>
                                    <DisplayBoardTemplate
                                        boardTemplate={template}
                                        removeWall={(index) => console.log("Test Button Clicked!")}
                                    />
                                </div>
                        </Card.Body>
                        <Card.Footer>
                            <CreateRetroBoard
                                title={"Create Board"}
                                wallTemplates={template.walls}
                            />

                            <Button className={"pull-right"} variant={"light"} onClick={() => deleteTemplate(template)}>
                                <i className={"fa fa-trash-o fa-lg"} style={{color: "red"}}/>
                            </Button>
                        </Card.Footer>
                    </Card>
                </Col>
            ))}

        </Row>

    </>
}

export default TemplateManager;
