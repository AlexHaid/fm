import {generateTeamResult} from "@/app/helpers/helpers";

const teams = [
    {
        name: 'Arsenal',
    },
    {
        name: 'Man Utd',
    },
    {
        name: 'Chelsea',
    },
    {
        name: 'Liverpool',
    },
    {
        name: 'Everton',
    },
    {
        name: 'Tottenham',
    },
    {
        name: 'Wolves',
    },
    {
        name: 'Fulham'
    }
];

export const fetchTeams = (): Team[] => {
    const teamsPayload: Team[] = [];

    teams.forEach(team => {
        teamsPayload.push(generateTeamResult(team.name))
    })

    return teamsPayload;
};