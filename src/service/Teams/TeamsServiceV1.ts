import {Team, TeamListResponse, TeamMemberListResponse} from "../../models/Team";
import {request} from "../../env-config";
import User from "../../models/User";

class TeamsServiceV1 {

    static instance:TeamsServiceV1;

    public static getInstance():TeamsServiceV1 {
        if (!TeamsServiceV1.instance)
            TeamsServiceV1.instance = new TeamsServiceV1();
        return TeamsServiceV1.instance;
    }

    public async createNewTeam(team: Team) {
        let response = await request.post("/teams", team);
        if (response.status === 201) {
            let newTeamResponse = await request.get(response.headers.location);
            return newTeamResponse.data as Team;
        }

        throw Error("Encountered some trouble while trying to create new team!");
    }

    public async addTeamMember(teamId: string, teamMemberEmail: string): Promise<TeamMemberListResponse> {
        let response = await request.post("/teams/member", {teamId: teamId, userEmail: teamMemberEmail});
        if (response.status === 201) {
            let teamsResponse = await request.get(response.headers.location);
            if (teamsResponse.status === 200)
                return await teamsResponse.data as TeamMemberListResponse;
        }

        throw Error("Member cannot be added. Response Status: " + response.status);
    }

    public async removeTeamMember(team: Team, teamMember: User) {
        let response = await request.delete(`/teams/${team.teamId}/member/${teamMember.uid}`)
        if (204 !== response.status)
            throw Error("error deleting team member. Status: " + response.status);
    }

    public async getTeamMember(teamMemberEmail: string) {
        let response = await request.get("/users", {
            params: {email: teamMemberEmail}
        });

        if (response.status === 200) {
            return response.data as User;
        }

        throw Error("No user found! Response Status: " + response.status);
    }

    public async deleteTeam(team: Team) {
        let response = await request.delete(`/teams/${team.teamId}`);
        if (response.status !== 204) {
            throw Error("Encountered problem while deleting the team. Response Status: " + response.status);
        }
    }

    public async getMyTeams(): Promise<TeamListResponse> {
        let response = await request.get("/teams");
        if (response.status === 200) {
            return await response.data as TeamListResponse;
        }
        return {teams: []};
    }

    public async getTeamMembers(teamId: string): Promise<TeamMemberListResponse> {
        let response = await request.get(`/teams/${teamId}/members`);
        if (response.status === 200) {
            return await response.data as TeamMemberListResponse;
        }

        throw Error("Error while trying to fetch team members for team ID: " + teamId);
    }
}

export default TeamsServiceV1;