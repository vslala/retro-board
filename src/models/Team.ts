import User from "./User";

export interface Team {
    teamId: string;
    teamName: string;
    teamMembers: Array<User>;
    createdBy: string;
}
