import * as React from 'react';
import {FunctionComponent, useState} from 'react';
import {Badge, Button, Card, ListGroup, ListGroupItem, Modal} from "react-bootstrap";
import {ITeam} from "../../../models/Team";
import User from "../../../models/User";
import AddNewTeamMember from "./AddNewTeamMember";
import Firebase from "../../../service/Firebase";

interface Props {
    team: ITeam
    removeMember: (member: User) => void
    addTeamMember: (team: ITeam, teamMemberEmail: string) => void
    deleteTeam: (team: ITeam) => void
}

const TeamCard: FunctionComponent<Props> = (props: Props) => {

    const [currUser, setCurrUser] = useState(new User());
    const [openModal, setOpenModal] = useState(false);
    const showModal = (user: User) => {
        setCurrUser(user);
        setOpenModal(true);
    }
    const closeModal = () => setOpenModal(false);
    const removeUser = () => {
        props.removeMember(currUser);
        closeModal();
    }

    const addTeamMember = (team: ITeam, teamMemberEmail: string) => {
        props.addTeamMember(team, teamMemberEmail)
    }

    const isOwner = (uid:string) => props.team.createdBy === uid;

    const render = () => {
        return <>
            <Card>
                <Card.Header>
                    <div className={"pull-right"}>
                        <AddNewTeamMember teamName={props.team.teamName}
                                          addTeamMember={(teamMemberEmail: string) => addTeamMember(props.team, teamMemberEmail)}/>

                        {
                            // only the team creator can delete the team
                            isOwner(Firebase.getInstance().getLoggedInUser()?.uid!) ?
                                <Button onClick={() => props.deleteTeam(props.team)} variant={"link"} style={{color: "crimson"}}><i
                                    className={"fa fa-lg fa-trash"}/></Button> : <></>
                        }

                    </div>
                    <h4>{props.team.teamName}</h4>
                </Card.Header>
                <Card.Body>
                    <ListGroup>
                        {props.team.teamMembers.map((teamMember, index) => (
                            <ListGroupItem key={index}>
                                <div style={{marginLeft: "auto !important"}}>
                                    <div className={"pull-right"}>
                                        {isOwner(Firebase.getInstance().getLoggedInUser()?.uid!) ?
                                        <Button variant={"link"} onClick={() => showModal(teamMember)}> <i
                                            style={{color: "crimson"}} className={"fa fa-xs fa-remove"}/></Button> : <></> }
                                    </div>
                                    {teamMember.displayName} <br/>
                                    <span className={"text-muted"}>{teamMember.email}</span> <br />
                                    {isOwner(teamMember.uid) ? <Badge variant={"primary"}>owner</Badge> : <Badge variant={"secondary"}>member</Badge>}
                                </div>

                            </ListGroupItem>
                        ))}
                    </ListGroup>
                </Card.Body>
            </Card>

            <Modal show={openModal} onHide={closeModal}>
                <Modal.Body>
                    <h3>Are you sure you want to remove <strong>{currUser.displayName}</strong> from the Team?</h3>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={removeUser}>Yes</Button>
                    <Button onClick={closeModal}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        </>
    }

    return render();
}

export default TeamCard;