import React, {FunctionComponent, useState} from 'react'
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

interface Props {
    title:string
    onCreateRetroBoard: (retroBoard:{title:string,maxLikes:number}) => void
}

const CreateRetroBoard: FunctionComponent<Props> = ({onCreateRetroBoard, title}) => {
    const [show, setShow] = useState(false)
    const [formInput, setFormInput] = useState({title: "", maxLikes: 5})

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.currentTarget.value
        setFormInput({...formInput, [name]: value})
    }
    const handleCreateRetroBoard = async () => {
        onCreateRetroBoard(formInput);
        handleClose();
    }
    
    return <>
        <Button variant="outline-primary" onClick={handleShow}>
            {title}
        </Button>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
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