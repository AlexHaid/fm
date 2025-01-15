'use client'

import React from 'react';
import {observer} from "mobx-react-lite";
import {leagueStore} from "@/app/store/leagueStore";

function playMatch(match: Match2) {
    const homeScore = Math.floor(Math.random() * 5);
    const awayScore = Math.floor(Math.random() * 5);

    // const homeTeamResult = homeScore > awayScore ? 'win' : homeScore < awayScore ? 'lose' : 'draw'
    // const awayTeamResult = homeScore > awayScore ? 'lose' : homeScore < awayScore ? 'win' : 'draw'

    return ({
        ...match,
        result: [homeScore, awayScore]
    })
}

export const Inner = observer(() => {
    function playTour() {

        const tour = leagueStore.calendar[leagueStore.currentTour - 1];
        let tourResult: Match2[] = [];

        tour.matches.forEach(match => {
            const matchResult = playMatch(match);
            tourResult.push(matchResult);
        })

        leagueStore.finishTour(tourResult);
    }

    return (
        <>
            <button disabled={leagueStore.status !== 'ongoing'} onClick={playTour}>play tour</button>
            <button disabled={leagueStore.status !== 'waiting'} onClick={() => leagueStore.startLeague()}>start league</button>

            <table className="tg">
                <tbody>
                <tr>
                    <td className="tg-0lax">name</td>
                    <td className="tg-0lax">W</td>
                    <td className="tg-0lax">D</td>
                    <td className="tg-0lax">L</td>
                    <td className="tg-0lax">Points</td>
                </tr>
                {leagueStore.getTeamsStats().map((team: Team) => (
                    <tr key={Math.random()}>
                        <td className="tg-0lax">{team.name}</td>
                        <td className="tg-0lax">{team.wins}</td>
                        <td className="tg-0lax">{team.draws}</td>
                        <td className="tg-0lax">{team.losses}</td>
                        <td className="tg-0lax">{team.points}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <>
                {leagueStore.calendar.map(tour => {
                    return (
                        <div key={Math.random()}>
                            <div>tour {tour.tour} {leagueStore.currentTour === tour.tour && 'current'}</div>
                            {tour.matches.map(match =>
                                <div key={Math.random()}>
                                    <div>{match.home.name} - {match.away.name}</div>
                                    <div>{match.result[0]} : {match.result[1]}</div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </>
        </>
    )
});
