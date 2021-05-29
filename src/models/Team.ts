import User from "./User";

export interface TeamListResponse {
    teams: Array<Team>
}

export interface Team {
    teamId: string;
    teamName: string;
    createdBy: string;
}

export interface TeamMemberListResponse {
    teamId: string
    teamMembers: Array<User>
}
