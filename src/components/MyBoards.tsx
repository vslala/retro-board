import React, {FunctionComponent, useEffect, useState} from 'react'
import RetroBoardService from "../service/RetroBoard/RetroBoardService";
import RetroBoard from "../models/RetroBoard";
import Card from "react-bootstrap/Card";
import {Row} from 'react-bootstrap';
import Col from "react-bootstrap/Col";
import {Link} from "react-router-dom";
import Firebase from "../service/Firebase";
import Button from "react-bootstrap/Button";

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
        
        _getMyBoards().catch((e) => console.log("User not logged In!", e));
    }, [retroBoardService])

    const handleDelete = (board: RetroBoard) => {
        retroBoardService.deleteBoard(board).then(boardId => {
            setBoards(boards.filter(board => board.id !== boardId))
        }).catch(e => console.log("Error deleting board! ", e))
    }

    return <>
        <Row>
            {boards.map((board, index) =>

                <Col lg={"4"} key={index}>
                    <Card>
                        <Card.Body>
                            <h4>{board.name}</h4>
                        </Card.Body>
                        <Card.Footer>
                            <Link to={`/retro-board/${Firebase.getInstance().getLoggedInUser()!.uid}/${board.id}`}>URL</Link>
                            <Button variant={"link"} className={"pull-right"} onClick={() => handleDelete(board)}>
                                <i className={"fa fa-trash-o fa-lg"} style={{color: "red"}} />
                            </Button>
                        </Card.Footer>
                    </Card>
                </Col>
            )}
        </Row>

    </>
}

export default MyBoards