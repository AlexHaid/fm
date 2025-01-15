type Team = {
    name: string;
    wins: number;
    draws: number;
    losses: number;
    points: number;
}

type Match = Team[];

type Match2 = {
    home: Team,
    away: Team,
    result: number[]
}

type Tour = {
    tour: number;
    matches: Match2[];
}

type LeagueStatus = 'waiting' | 'ongoing' | 'completed';

