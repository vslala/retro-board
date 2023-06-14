import React, {FunctionComponent, useMemo, useState} from 'react'
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import CreateRetroBoardViewModel from "./CreateRetroBoardViewModel";
import RetroWalls from "../../models/RetroWalls";
import {useNavigate} from "react-router-dom";
import {RETRO_BOARD_STYLES} from "../../models/RetroBoard";
import RetroWall from "../../models/RetroWall";
import {TemplateWall} from "../../models/BoardTemplate";

interface Props {
    title: string
    wallTemplates?: Array<TemplateWall>
}

const defaultProps: Partial<Props> = {
    title: "Default Retro Board",
    wallTemplates: [
        {wallTitle: "Went Well", wallStyle: RETRO_BOARD_STYLES.wentWell, wallOrder: 1, notes: []},
        {wallTitle: "To Improve", wallStyle: RETRO_BOARD_STYLES.toImprove, wallOrder: 2, notes: []},
        {wallTitle: "Action Items", wallStyle: RETRO_BOARD_STYLES.actionItems, wallOrder: 3, notes: []}
    ]
};

const CreateRetroBoard: FunctionComponent<Props> = (props) => {
    const vm = useMemo(() => new CreateRetroBoardViewModel(), []);
    const navigate = useNavigate();
    const [show, setShow] = useState(false)
    const [formInput, setFormInput] = useState({title: "", maxLikes: 5})

    const mergedProps = { ...defaultProps, ...props }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.currentTarget.value
        setFormInput({...formInput, [name]: value})
    }
    const handleCreateRetroBoard = async () => {
        let retroBoard = await vm.createRetroBoard(formInput);
        console.log(props);
        let boardWalls = await vm.createWalls(retroBoard, mergedProps.wallTemplates!);

        handleClose();

        navigate(`/retro-board/${retroBoard.userId}/${retroBoard.id}`, {state: {walls: new RetroWalls(boardWalls.walls)}})
    }

    return <>
        <Button variant="outline-primary" onClick={handleShow}>
            {mergedProps.title}
        </Button>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{mergedProps.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Dashboard Title</Form.Label>
                        <Form.Control name={"title"} type={"text"} placeholder={"e.g. Spring 400 "}
                                      value={formInput.title} autoComplete={"false"}
                                      onChange={handleChange("title")}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Max Likes</Form.Label>
                        <Form.Control name={"maxLikes"} type={"number"} placeholder={"e.g. 5 or 6 "}
                                      onChange={handleChange("maxLikes")}
                                      autoComplete={"false"}
                                      value={String(formInput.maxLikes)}/>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleCreateRetroBoard}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    </>
}

export default CreateRetroBoard
