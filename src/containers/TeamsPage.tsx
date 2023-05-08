import * as React from 'react';
import {Col, Row} from "react-bootstrap";
import TeamCard from "../views/dumb/teams/TeamCard";
import User from "../models/User";
import Team, {ITeam} from "../models/Team";
import CreateNewTeam from "../views/dumb/teams/CreateNewTeam";
import TeamsServiceV1 from "../service/Teams/TeamsServiceV1";

interface Props {
    teamsService: TeamsServiceV1;
}
interface State {
    teams: Array<Team>
}

class TeamsPage extends React.Component<Props, State> {

    state: State = {teams: []};

    componentDidMount(): void {
        document.title = "Teams";
        // TODO: show loaded until the teams are loaded
        this.getMyTeams();
    }

    private async getMyTeams() {
        let myTeams = await this.props.teamsService.getMyTeams()
        this.setState({teams: myTeams});
    }

    render() {

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
                    <CreateNewTeam createTeam={(team: ITeam) => this.createTeam(team)}  />
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
                    this.state.teams.map((team, index) => (
                        <Col md={4} key={index}>
                            <TeamCard team={team} removeMember={(member: User) => {
                                this.removeMember(team, member)
                            }} addTeamMember={(team, teamMemberEmail) => this.addTeamMember(team, teamMemberEmail)}
                            deleteTeam={(team) => this.deleteTeam(team)}
                            />
                        </Col>
                    ))
                }
            </Row>

        </>;
    }

    private async createTeam(team: ITeam) {
        console.log("Creating new team...", this.state)
        let newTeam = await this.props.teamsService.createNewTeam(team);
        const newTeams = [...this.state.teams, newTeam];
        this.setState({teams: newTeams});
    }

    private async removeMember(team: ITeam, member: User) {
        console.log("Removing member");
        try {
            await this.props.teamsService.removeTeamMember(team, member);
            let newTeams = this.state.teams.map(team => ({
                ...team,
                teamMembers: team.teamMembers.filter(teamMember => teamMember.uid !== member.uid)
            }));
            this.setState({teams: newTeams});
        } catch(e: any) {
            console.log("Error: " + e.msg, e);
        }

    }

    private async addTeamMember(team:Team, teamMemberEmail: string) {
        console.log("Adding team member...");
        try {
            let teamMember = await this.props.teamsService.getTeamMember(teamMemberEmail);
            let teamMembersResponse: {teamMembers: Array<User>} = await this.props.teamsService.addTeamMember(team, teamMember);
            let newTeams = this.state.teams.map(itr => {
                if (itr.teamId === team.teamId) {
                    team.teamMembers = teamMembersResponse.teamMembers;
                    return team;
                } else return itr;
            })
            this.setState({teams: newTeams});
        } catch (e) {
            console.log("Team member with the given email is not found!!!");
            // TODO: show a pop-up and ask to send an invite
        }
    }

    private async deleteTeam(team: ITeam) {
        try {
            await this.props.teamsService.deleteTeam(team);
            const newState = this.state.teams.filter(t => t.teamId !== team.teamId);
            this.setState({teams: newState});
        } catch (e) {
            alert("Cannot delete team!");
        }
    }
}

export default TeamsPage;
