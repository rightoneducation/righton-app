import { randomUUID } from 'crypto'
import { ITeamMember } from '../../src/Models/ITeamMember'

class TeamMemberHelper {
    static teamMember(teamId: string = randomUUID()): ITeamMember {
        return {
            id: randomUUID(),
            isFacilitator: null,
            answers: [],
            deviceId: null,
            createdAt: null,
            updatedAt: null,
            teamTeamMembersId: teamId,
        }
    }
}

export default TeamMemberHelper