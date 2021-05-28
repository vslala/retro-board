import * as React from 'react'
import {useState} from 'react'
import {Alert, Button, Form, FormGroup, Modal, ProgressBar} from "react-bootstrap";
import {Team} from "../../models/Team";

interface Props {
    teams: Array<Team>
    shareWith: (selectedTeams: Array<Team>) => Promise<boolean>
}

const ShareBoard: React.FunctionComponent<Props> = (props: Props) => {
    const teams = props.teams ? props.teams : [];

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleOpen = () => setShow(true);
    const [pageLoader, setPageLoader] = useState(false);
    const [selectedTeams, setSelectedTeams] = useState<Array<Team>>([]);
    const [response, setResponse] = useState<React.ReactNode>(undefined);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedItems = e.currentTarget.selectedOptions;
        const selectedTeams: Array<Team> = [];
        for (let index = 0; index < selectedItems.length; index++) {
            selectedTeams.push(
                props.teams.find((team) => team.teamId === selectedItems[index].value)!
            );
        }

        setSelectedTeams(selectedTeams);
    }

    const handleSubmit = async () => {
        setPageLoader(true);
        let response = await props.shareWith(selectedTeams);
        if (response === true) {
            setResponse(
                <Alert variant={"success"}>
                    <i className={"fa fa-check"} style={{color: "green"}}/>
                    Page is now shared with the selected teams.
                </Alert>
            )
        } else {
            setResponse(<Alert variant={"danger"}>Cannot share the page. Contact admin.</Alert>)
        }
        setPageLoader(false);
    }

    return <>
        <Button style={{border: "1px solid black"}} variant={"light"} onClick={handleOpen}>
            <i className={"fa fa-share-alt"}/>
        </Button>

        <Modal show={show} onHide={handleClose}>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Form.Label><h3>Share with:</h3></Form.Label>
                        <Form.Control as={"select"} multiple
                                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange(e)}>
                            <option disabled={true}>Select teams to share</option>
                            {teams.map((team, index) => (
                                <option key={index} value={team.teamId}>{team.teamName}</option>
                            ))}
                        </Form.Control>
                    </FormGroup>
                    <FormGroup>
                        <Button type={"submit"} variant={"success"}>Share</Button>
                        <Button onClick={handleClose} variant={"light"}>Cancel</Button>
                    </FormGroup>
                </Form>
            </Modal.Body>
            {pageLoader ? <Modal.Footer>
                {pageLoader ? <><ProgressBar animated={true}/>{response}</> : <>{response}</>}
            </Modal.Footer> : <>{response}</>}

        </Modal>
    </>
}

export default ShareBoard