import * as React from "react";
import {Button, Col, Row} from "react-bootstrap";
import StickyNote from "./StickyNote";
import {SortType} from "../redux/types/RetroBoardActionTypes";
import RetroBoardServiceFactory from "../service/RetroBoard/RetroBoardServiceFactory";
import BoardTemplate from "../models/BoardTemplate";
import Note from "../models/Note";

interface DisplayProps {
    boardTemplate: BoardTemplate
    removeWall: (index: number) => void
}

const DisplayBoardTemplate: React.FunctionComponent<DisplayProps> = ({boardTemplate, removeWall}) => {

    return <>
        <Row>
            {boardTemplate.walls.map((wall, index) => (
                <Col key={index} className={"justify-content-center text-center"}>
                    <h6>{wall.wallTitle} <Button onClick={() => removeWall(index)} variant={"link"}><i
                        className={"fa fa-times"}/></Button></h6>
                    {
                        wall?.notes?.length > 0 ? wall.notes.map((note, index) => (
                            <StickyNote key={index} note={new Note("","", note.noteText, note.noteStyle)} sortBy={SortType.NONE}
                                        retroBoardService={RetroBoardServiceFactory.getInstance()}/>
                        )) : <StickyNote key={index} note={new Note("","", "Foo Bar", wall.wallStyle.stickyNote)} sortBy={SortType.NONE}
                                         retroBoardService={RetroBoardServiceFactory.getInstance()}/>
                    }

                </Col>
            ))}
        </Row>
    </>
}

export default DisplayBoardTemplate;
