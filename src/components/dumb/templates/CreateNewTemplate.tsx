import * as React from 'react';
import {useState} from 'react';
import {Button, Col, Form, FormGroup, Modal, Row} from "react-bootstrap";
import {RETRO_BOARD_STYLES} from "../../../models/RetroBoard";
import './style.css';
import BoardTemplate, {TemplateWall} from "../../../models/BoardTemplate";
import EditText from "../../dumb/EditText";
import ColorPicker from "../../dumb/ColorPicker";
import DisplayBoardTemplate from "./DisplayBoardTemplate";
import Firebase from "../../../service/Firebase";
import {BoardContextProvider} from "../../../redux/context/BoardContext";

interface Props {
    onCreateTemplate: (templateData: BoardTemplate) => void
}

const CreateNewTemplate: React.FunctionComponent<Props> = (props: Props) => {

    const [show, setShow] = useState(false);
    const showModal = () => setShow(true);
    const hideModal = () => setShow(false);

    const [boardTemplate, setBoardTemplate] = useState<BoardTemplate>({
        templateTitle: "Template Title",
        walls: [],
        templateId: "",
        userId: Firebase.getInstance().getLoggedInUser()?.uid!
    });
    // const [retroWalls, setRetroWalls] = useState<RetroWalls>(new RetroWalls([]));
    const [wallTitle, setWallTitle] = useState("");
    // const [notes, setNotes] = useState<Notes>(new Notes([]));
    const [textColor, setTextColor] = useState<any>("#ffffff");
    const [backgroundColor, setBackgroundColor] = useState<any>(RETRO_BOARD_STYLES.wentWell.stickyNote.backgroundColor);

    const updateTemplateTitle = (title: string) => {
        setBoardTemplate({...boardTemplate, templateTitle: title});
    }

    const handleWallName = (e: React.ChangeEvent<HTMLInputElement>) => setWallTitle(e.currentTarget.value);
    const addWall = () => {
        let newTemplateWall: TemplateWall = {
            wallTitle: wallTitle,
            wallStyle: {
                stickyNote: {
                    backgroundColor: backgroundColor,
                    textColor: textColor,
                    likeBtnPosition: "right"
                }
            },
            wallOrder: 1,
            notes: [
                {
                    noteText: "Lorem Epsum Dolor Sit amet",
                    noteStyle: {
                        backgroundColor: backgroundColor,
                        textColor: textColor,
                        likeBtnPosition: "right"
                    }
                }
            ]
        };

        setBoardTemplate({...boardTemplate, walls: [...boardTemplate.walls, newTemplateWall]});
        setWallTitle("");
    }

    const removeWall = (index: number) => {
        setBoardTemplate({
            ...boardTemplate,
            walls: [...boardTemplate.walls.slice(0, index), ...boardTemplate.walls.slice(index + 1)]
        })
    }

    const handleTextColor = (color: any) => setTextColor(color.hex)
    const handleBackgroundColor = (color: any) => setBackgroundColor(color.hex);
    const createTemplate = () => {

        const payload:BoardTemplate = {...boardTemplate,
            walls: boardTemplate.walls.map((wall, index) => {
                return {...wall, wallOrder: index};
            })}

        props.onCreateTemplate(payload);
        hideModal();
    }

    return <>
        <Button variant={"light"} onClick={showModal} style={{padding: "25px", border: "2px dashed"}}>
            <i className={"fa fa-plus fa-lg"}/>
        </Button>
        <Modal show={show} onHide={hideModal} dialogClassName={"custom-modal"}>
            <Modal.Header>
                <EditText onSubmit={(text) => updateTemplateTitle(text)} title={boardTemplate.templateTitle}/>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <FormGroup>
                        <Row>
                            <Form inline={true} onSubmit={(e: any) => e.preventDefault()}>
                                <Col>
                                    <Form.Control
                                        placeholder={"Wall Title"}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleWallName(e)}
                                        value={wallTitle}
                                        style={{padding: "20px", marginLeft: "5px"}}
                                    />
                                </Col>
                                <Col style={{backgroundColor: textColor}}>
                                    <ColorPicker title={"Text Color"} handleOnChangeComplete={handleTextColor}/>
                                </Col>
                                <Col style={{backgroundColor: backgroundColor}}>
                                    <ColorPicker title={"Background Color"}
                                                 handleOnChangeComplete={handleBackgroundColor}/>
                                </Col>
                                <Col>
                                    <Button onClick={addWall} disabled={wallTitle === ""}>Add Wall</Button>
                                </Col>
                            </Form>
                            <hr/>
                        </Row>
                    </FormGroup>
                </Row>

                <div style={{border: "1px solid", padding: "20px", margin: "1px solid"}}>
                    <DisplayBoardTemplate boardTemplate={boardTemplate} removeWall={removeWall} />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant={"success"} disabled={boardTemplate.walls.length === 0} onClick={createTemplate}>Create
                    Template</Button>
                <Button variant={"light"} onClick={hideModal}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    </>
}

export default CreateNewTemplate;