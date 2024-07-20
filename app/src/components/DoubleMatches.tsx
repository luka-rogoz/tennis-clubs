import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import './Detail.css';

interface Match {
    matchId: number;
    matchTimestamp: string;
    matchResult: string;
    duration: string;
    stage: string;
    opponent1: string;
    opponent2: string;
    courtName: string;
    tournamentName: string;
    categoryType: string;
    ageLimit: string;
    sexLimit: string;
    winner: number;
}

interface Tournament {
    tournamentId: number;
    name: string;
    clubName: string;
    type: string;
    ageLimit: string;
    sexLimit: string;
}

function DoubleMatches() {
    const { pairId } = useParams<{ pairId: string }>();
    const [matches, setMatches] = useState<Match[]>([]);
    const [tournaments, setTournaments] = useState<Tournament[]>([]);

    useEffect(() => {
        axios.get(`/doubles/${pairId}/doubles-matches`)
            .then(response => setMatches(response.data))
            .catch(error => console.error("Error fetching matches: ", error));
        axios.get('/tournaments')
            .then(response => setTournaments(response.data))
            .catch(error => console.error("Error fetching tournaments: ", error));
    }, [pairId]);

    const getTournamentIdByName = (name: string): number | undefined => {
        const tournament = tournaments.find(t => t.name === name);
        return tournament ? tournament.tournamentId : undefined;
    };

    function formatDateTime(dateString: string | undefined): string {
        if (dateString == undefined) return "";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Mjeseci su 0-indeksirani
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}.${month}.${year}. ${hours}:${minutes}`;
    }

    document.title = "Mečevi para";
    return (
        <div>
            <div className="container">
                <h1>Mečevi para</h1>
                <p>Ovdje možete pregledavati sve mečeve za odabrani par koji se nalaze u bazi.</p>
                <h2>Popis mečeva para:</h2>
                {matches.length === 0 ? (
                    <p style={{ fontStyle: 'italic' }}>Trenutno nema mečeva za odabrani par u bazi.</p>
                ) : (
                    <table>
                        <tbody>
                        {matches.map(match => {
                            const tournamentId = getTournamentIdByName(match.tournamentName);
                            return (
                                <tr
                                    key={match.matchId}
                                    onClick={() => window.location.href = `/tournaments/${tournamentId}/matches/${match.matchId}`}
                                    style={{
                                        backgroundColor: match.winner === 1 ? 'green' : 'red',
                                        color: 'white',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <td>{match.opponent1} vs {match.opponent2}</td>
                                    <td>{formatDateTime(match.matchTimestamp)}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                )}
            </div>
            <div className="empty"></div>
        </div>
    );
}

export default DoubleMatches;
