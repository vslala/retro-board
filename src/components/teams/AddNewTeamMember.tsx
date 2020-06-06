import * as React from 'react';
import {FunctionComponent, useState} from 'react';
import {Badge, Button, FormControl, Modal} from "react-bootstrap";
import Firebase from "../../service/Firebase";

interface Props {
    teamName: string
    addTeamMember: (teamMemberEmail: string) => void
}
const AddNewTeamMember: FunctionComponent<Props> = (props: Props) => {

    const [showModal, setShowModal] = useState(false);
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);
    const [teamMemberEmail, setTeamMemberEmail] = useState("");
    const [error, setError] = useState({error: true, msg: ""});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError({error: false, msg: ""});
        setTeamMemberEmail(e.currentTarget.value);
    }
    const addTeamMember = () => {
        if (teamMemberEmail === Firebase.getInstance().getLoggedInUser()?.email) {
            setError({error: true, msg: "LOL! You cannot add your own email!!!"});
        } else {
            props.addTeamMember(teamMemberEmail);
            closeModal();
            setError({error: false, msg: ""});
        }
    }

    return <>
        <Button variant={"link"} onClick={openModal}><i className={"fa fa-user-plus fa-lg"} /></Button>

        <Modal show={showModal} onHide={closeModal}>
            <Modal.Header>
                <h4>Add New Team Member</h4>
                <Badge variant={"primary"}>{props.teamName}</Badge>
            </Modal.Header>
            <Modal.Body>
                <FormControl autoComplete={"disabled"} onChange={handleChange}
                    placeholder={"Enter team member's email address"} type={"email"} />
                {error.error ? <span className={"text-danger"}>{error.msg}</span> : <></>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant={"primary"} onClick={addTeamMember}>Add Member</Button>
                <Button variant={"light"} onClick={closeModal}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    </>
}

export default AddNewTeamMember;