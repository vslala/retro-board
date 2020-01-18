import React, {FunctionComponent, useEffect, useState} from 'react'
import RetroBoardService from "../service/RetroBoard/RetroBoardService";
import RetroBoard from "../models/RetroBoard";
import Card from "react-bootstrap/Card";
import {Row} from 'react-bootstrap';
import Col from "react-bootstrap/Col";
import {Link} from "react-router-dom";

interface Props {
    retroBoardService: RetroBoardService
}

const MyBoards: FunctionComponent<Props> = ({retroBoardService}) => {

    const [boards, setBoards] = useState<RetroBoard[]>([])


    useEffect(() => {
        async function _getMyBoards() {
            let myBoards = await retroBoardService.getMyBoards()
            setBoards(myBoards)
        }
        // eslint
        _getMyBoards();
    }, [retroBoardService])

    return <>
        <Row>
            {boards.map((board, index) =>

                <Col lg={"4"} key={index}>
                    <Card>
                        <Card.Body>
                            <h4>{board.name}</h4>
                        </Card.Body>
                        <Card.Footer>
                            <Link to={`/retro-board/${board.id}`}>URL</Link>
                        </Card.Footer>
                    </Card>
                </Col>
            )}
        </Row>

    </>
}

export default MyBoards