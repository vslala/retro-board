import User from "./User";

export interface ITeam {
    teamId: string;
    teamName: string;
    teamMembers: Array<User>;
    createdBy: string;
}
class Team implements ITeam {
    teamId: string = "";
    teamName: string = "";
    teamMembers: Array<User> = [];
    createdBy: string = "";

}

export default Team;