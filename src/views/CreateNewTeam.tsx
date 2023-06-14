import * as React from 'react'
import {FunctionComponent, useState} from 'react'
import {Button, FormControl, Modal} from "react-bootstrap";
import Team, {ITeam} from "../models/Team";
import Firebase from "../service/Firebase";

interface Props {
    createTeam: (team: ITeam) => void
}
const CreateNewTeam: FunctionComponent<Props> = (props: Props) => {

    const [showModal, setShowModal] = useState(false);
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);
    const [teamName, setTeamName] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTeamName(e.currentTarget.value);
    }

    const handleCreate = () => {
        let team = new Team();
        team.teamName = teamName;
        team.teamMembers = [];
        team.createdBy = Firebase.getInstance().getLoggedInUser()?.uid!;
        props.createTeam(team);
        closeModal();
    }

    return <>
        <Button variant={"primary"} onClick={openModal}>Create New Team</Button>

        <Modal show={showModal} onHide={closeModal}>
            <Modal.Header><h3>Create New Team</h3></Modal.Header>
            <Modal.Body>
                <FormControl autoFocus={true} autoComplete={"disabled"} onChange={handleChange} placeholder={"Enter your team name..."} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant={"primary"} onClick={handleCreate}>Create</Button>
                <Button variant={"light"} onClick={closeModal}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    </>
}

export default CreateNewTeam;
