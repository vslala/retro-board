import * as React from 'react';
import {useEffect, useState} from 'react';
import {withRouter} from 'react-router-dom';
import {Alert, Button, Card, Col, ListGroup, ListGroupItem, Modal, Row} from "react-bootstrap";
import {Team, TeamListResponse, TeamMemberListResponse} from "../models/Team";
import CreateNewTeam from "../components/dumb/teams/CreateNewTeam";
import TeamsServiceFactory from "../service/Teams/TeamsServiceFactory";
import User from "../models/User";
import AddNewTeamMember from "../components/dumb/teams/AddNewTeamMember";

interface TeamMemberModalData {
    teamId: string
    teamName: string
    teamMembers: Array<User>
}
const TeamsPage:React.FunctionComponent = () => {
    const teamsService = TeamsServiceFactory.getInstance();
    const [teams, setTeams] = useState<Array<Team>>([]);
    const [showTeamMemberModal, setShowTeamMemberModal] = useState<boolean>(false);
    const [teamMemberModalData, setTeamMemberModalData] = useState<TeamMemberModalData>({teamId: "", teamName: "", teamMembers: []});

    const createTeam = async (team: Team) => {
        console.log("Creating new team...", teams)
        let newTeam = await teamsService.createNewTeam(team);
        setTeams([...teams, newTeam]);
    }

    const deleteTeam = async (team: Team) => {
        try {
            await teamsService.deleteTeam(team);
            const newTeams = teams.filter(t => t.teamId !== team.teamId);
            setTeams(newTeams);
        } catch (e) {
            alert("Cannot delete team!");
        }
    }

    const showModal = async (team: Team) => {
        let teamMemberListResponse: TeamMemberListResponse = await teamsService.getTeamMembers(team.teamId);
        setTeamMemberModalData({
            teamId: team.teamId,
            teamName: team.teamName,
            teamMembers: teamMemberListResponse.teamMembers
        });
        setShowTeamMemberModal(true);
    }

    useEffect(() => {
        document.title = "Teams";
        // TODO: show loaded until the teams are loaded
        const getMyTeams = async () => {
            let teamListResponse: TeamListResponse = await teamsService.getMyTeams()
            setTeams(teamListResponse.teams);
        }
        getMyTeams();
    }, [teamsService])

    const addTeamMember = async (userEmail: string) => {
        let teamMemberListResponse: TeamMemberListResponse = await teamsService.addTeamMember(teamMemberModalData.teamId, userEmail);
        setTeamMemberModalData({...teamMemberModalData, teamMembers: teamMemberListResponse.teamMembers});
    }

    return <>
        <Row>
            <Col md={4} sm={6}>
                <div className={"pb-2 mt-4 mb-2 border-bottom"}>
                    <h3>Create New Team</h3>
                </div>
            </Col>
        </Row>
        <Row>
            <Col xs={6} md={4}>
                <CreateNewTeam createTeam={(team: Team) => createTeam(team)}  />
            </Col>
        </Row>
        <hr/>
        <Row>
            <Col md={4} sm={6}>
                <div className={"pb-2 mt-4 mb-2 border-bottom"}>
                    <h3>Existing Teams</h3>
                </div>
            </Col>
        </Row>
        <Row>
            {
                teams.map((team, index) => (
                    <Col md={3} key={index} >
                        <Card key={index}>
                            <Card.Body className={"mx-auto"}>
                                <h4>{team.teamName}</h4>
                            </Card.Body>
                            <Card.Body className={"mx-auto"}>
                                <Button variant={"outline-secondary"} onClick={() => showModal(team)}>View Members</Button>
                                <Button variant={"outline-danger"} onClick={() => deleteTeam(team)}>Delete Team</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))
            }
        </Row>

        <Modal show={showTeamMemberModal} onHide={() => setShowTeamMemberModal(false)}>
            <Modal.Header>
                <Modal.Title>{teamMemberModalData.teamName}</Modal.Title>
                <span><AddNewTeamMember teamName={teamMemberModalData.teamName} addTeamMember={addTeamMember} /></span>
            </Modal.Header>
            <Modal.Body>
                {
                    teamMemberModalData.teamMembers.length === 0 ?
                        <Alert variant={"info"}>
                            No member has been added
                        </Alert> :
                        <ListGroup>
                            {
                                teamMemberModalData.teamMembers.map((teamMember, index) => (
                                    <ListGroupItem key={index}>
                                        {teamMember.displayName}
                                    </ListGroupItem>
                                ))
                            }
                        </ListGroup>
                }

            </Modal.Body>
        </Modal>
    </>;
}

export default withRouter(TeamsPage);