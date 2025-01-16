export const generateTeamResult = (name: string, result?: string): Team =>{
    const stats: Omit<Team, 'name'> = {
        wins: 0,
        losses: 0,
        draws: 0,
        points: 0,
    }

    if (!result) return ({
        ...stats,
        name
    })

    stats.wins = result === 'win' ? 1 : 0;
    stats.losses = result === 'lose' ? 1 : 0;
    stats.draws = result === 'draw' ? 1 : 0;
    stats.points = result === 'win' ? 3 : result === 'draw' ? 1 : 0;

    return ({
        ...stats,
        name
    })
}

const normalizeObj = proxyObj => JSON.parse(JSON.stringify(proxyObj));

export const generateRoundRobinMatches = (teams: Team[]): Tour[] => {
    const generateRoundRobinTour = (tourNumber: number): Tour[] => {
        const firstTourMatches: Match2[] = [];
        const secondTourMatches: Match2[] = [];
        const teamsSet = new Set();
        for (let i = 0; i < matchPool.length; i++) {
            const match = matchPool[i];
            if (!teamsSet.has(match.home.name) && !teamsSet.has(match.away.name)) {
                teamsSet.add(match.home.name);
                teamsSet.add(match.away.name);

                firstTourMatches.push(match);
                const secondMatch = {...match};
                [secondMatch.home, secondMatch.away] = [secondMatch.away, secondMatch.home];
                secondTourMatches.push(secondMatch);
                matchPool.splice(i, 1);
                i--;
            }
        }



        return ([
            {
                tour: tourNumber,
                matches: firstTourMatches
            },
            {
                tour: tourNumber + teams.length - 1,
                matches: secondTourMatches
            }
        ]);
    }

    let schedule: Tour[] = [];
    let tourCount = 1;
    const matchPool: Match2[] = [];
    const lap: Tour[] = [];

    for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
            matchPool.push({
                home: teams[i],
                away: teams[j],
                result: []
            });
        }
    }

    while (matchPool.length > 0) {
        const tour = generateRoundRobinTour(tourCount);
        schedule = schedule.concat(tour);
        tourCount++;
    }

    return schedule;
}

export const shuffle = <T>(array: T[]): T[] => {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
};
