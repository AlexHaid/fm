import {makeAutoObservable} from "mobx";
import {generateRoundRobinMatches} from "@/app/helpers/helpers";
import {fetchTeams} from "@/app/api/teams";

function sortArrayByField(arr: any, field: string, order: 'asc' | 'desc') {
    return arr.slice().sort((a: { [x: string]: number; }, b: { [x: string]: number; }) => {
        if (a[field] < b[field]) {
            return order === 'asc' ? -1 : 1;
        }
        if (a[field] > b[field]) {
            return order === 'asc' ? 1 : -1;
        }
        return 0;
    });
}

class LeagueStore {
    constructor() {
        makeAutoObservable(this)
    }

    public status: LeagueStatus = 'waiting';

    public currentTour = 0;

    public calendar: Tour[] = [];

    private teams: Team[] = [];

    getTeams() {
        return sortArrayByField(this.teams, 'name', 'asc');
    }

    getTeamsStats() {
        return sortArrayByField(this.teams, 'points', 'desc');
    }

    finishTour(tourResult: Match2[]) {
        const updatedTeamsStats = [];

        const teams = this.getTeams();

        const tour = this.calendar[this.currentTour - 1];

        tourResult.forEach((match, index) => {
            const { home, away, result } = match;

            const [homeScore, awayScore] = result;
            const matchStatus = homeScore > awayScore ? 'H' : homeScore < awayScore ? 'A' : 'D'

            const homeTeam = teams.find((team: Team) => team.name === home.name);
            const awayTeam = teams.find((team: Team) => team.name === away.name);
            if (matchStatus === 'H') {
                homeTeam.wins = homeTeam.wins + 1;
                homeTeam.points = homeTeam.points + 3;
                awayTeam.losses = awayTeam.losses + 1;
            }
            if (matchStatus === 'A') {
                homeTeam.losses = homeTeam.losses + 1;
                awayTeam.wins = awayTeam.wins + 1;
                awayTeam.points = awayTeam.points + 3;
            }
            if (matchStatus === 'D') {
                homeTeam.draws = homeTeam.draws + 1;
                awayTeam.draws = awayTeam.draws + 1;
                homeTeam.points = homeTeam.points + 1;
                awayTeam.points = awayTeam.points + 1;
            }

            updatedTeamsStats.push(homeTeam, awayTeam);
            tour.matches[index] = match;
        });

        this.calendar[this.currentTour - 1] = tour;

        this.currentTour++;
    }

    generateSchedule() {
        this.calendar = sortArrayByField(generateRoundRobinMatches(this.teams), 'tour', 'asc');
    }

    loadTeams(): Team[] {
        return this.teams = fetchTeams();
    }

    startLeague() {
        if (this.teams.length === 0) this.loadTeams();
        this.generateSchedule();
        this.currentTour = 1;
        this.status = 'ongoing'
    }

    endLeague() {
        this.status = 'waiting'
        this.calendar = [];
        this.teams = [];
    }
}

export const leagueStore = new LeagueStore();
