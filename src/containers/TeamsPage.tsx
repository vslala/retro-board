import * as React from 'react';
import {useEffect, useState} from 'react';
import {withRouter} from 'react-router-dom';
import {Col, Row} from "react-bootstrap";
import TeamCard from "../components/dumb/teams/TeamCard";
import User from "../models/User";
import Team, {ITeam} from "../models/Team";
import CreateNewTeam from "../components/dumb/teams/CreateNewTeam";
import TeamsServiceFactory from "../service/Teams/TeamsServiceFactory";

const TeamsPage:React.FunctionComponent = () => {
    const teamsService = TeamsServiceFactory.getInstance();
    const [teams, setTeams] = useState<Array<Team>>([]);

    const createTeam = async (team: ITeam) => {
        console.log("Creating new team...", teams)
        let newTeam = await teamsService.createNewTeam(team);
        setTeams([...teams, newTeam]);
    }

    const removeMember = async (team: ITeam, member: User) => {
        console.log("Removing member");
        try {
            await teamsService.removeTeamMember(team, member);
            let newTeams = teams.map(team => ({
                ...team,
                teamMembers: team.teamMembers.filter(teamMember => teamMember.uid !== member.uid)
            }));
            setTeams(newTeams);
        } catch(e) {
            console.log("Error: " + e.msg, e);
        }

    }

    const addTeamMember = async (team:Team, teamMemberEmail: string) => {
        console.log("Adding team member...");
        try {
            let teamMember = await teamsService.getTeamMember(teamMemberEmail);
            let teamMembersResponse: {teamMembers: Array<User>} = await teamsService.addTeamMember(team, teamMember);
            let newTeams = teams.map(itr => {
                if (itr.teamId === team.teamId) {
                    team.teamMembers = teamMembersResponse.teamMembers;
                    return team;
                } else return itr;
            })
            setTeams(newTeams);
        } catch (e) {
            console.log("Team member with the given email is not found!!!");
            // TODO: show a pop-up and ask to send an invite
        }
    }

    const deleteTeam = async (team: ITeam) => {
        try {
            await teamsService.deleteTeam(team);
            const newTeams = teams.filter(t => t.teamId !== team.teamId);
            setTeams(newTeams);
        } catch (e) {
            alert("Cannot delete team!");
        }
    }

    useEffect(() => {
        document.title = "Teams";
        // TODO: show loaded until the teams are loaded
        const getMyTeams = async () => {
            let myTeams = await teamsService.getMyTeams()
            setTeams(myTeams);
        }
        getMyTeams();
    }, [teamsService])

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
                <CreateNewTeam createTeam={(team: ITeam) => createTeam(team)}  />
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
                    <Col md={4} key={index}>
                        <TeamCard team={team} removeMember={(member: User) => {
                            removeMember(team, member)
                        }} addTeamMember={(team, teamMemberEmail) => addTeamMember(team, teamMemberEmail)}
                                  deleteTeam={(team) => deleteTeam(team)}
                        />
                    </Col>
                ))
            }
        </Row>

    </>;
}

export default withRouter(TeamsPage);