import React, {FunctionComponent, useState} from 'react'
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import RetroBoardService from "../service/RetroBoard/RetroBoardService";
import {useDispatch} from "react-redux";
import RetroBoardActions from "../redux/actions/RetroBoardActions";
import {Redirect} from 'react-router-dom';

interface Props {
    retroBoardService: RetroBoardService
}

const CreateRetroBoard: FunctionComponent<Props> = ({retroBoardService}) => {
    const dispatch = useDispatch()
    const [navigate, setNavigate] = useState("")
    const [show, setShow] = useState(false)
    const [formInput, setFormInput] = useState({title: "", maxLikes: 5})

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.currentTarget.value
        setFormInput({...formInput, [name]: value})
    }
    const handleCreateRetroBoard = async () => {
        const retroBoardActions = new RetroBoardActions();
        let retroBoard = await retroBoardService.createNewRetroBoard(formInput)
        dispatch(retroBoardActions.createRetroBoard(retroBoard))
        handleClose()
        setNavigate(`/retro-board/${retroBoard.id}`)
    }
    
    if (navigate !== "") {
        return <Redirect to={navigate} />
    }

    return <>
        <Button variant="primary" onClick={handleShow}>
            Create Dashboard
        </Button>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Create New Dashboard</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Dashboard Title</Form.Label>
                        <Form.Control name={"title"} type={"text"} placeholder={"e.g. Spring 400 "}
                                      value={formInput.title}
                                      onChange={handleChange("title")}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Max Likes</Form.Label>
                        <Form.Control name={"maxLikes"} type={"number"} placeholder={"e.g. 5 or 6 "}
                                      onChange={handleChange("maxLikes")} value={String(formInput.maxLikes)}/>
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