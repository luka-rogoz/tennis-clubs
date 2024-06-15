import {useEffect, useState} from "react";
import axios from "axios";
import {Link, useParams} from "react-router-dom";
import './Detail.css'

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
}

function PlayerMatches() {
    const { playerId } = useParams<{ playerId: string }>();
    const [matches, setMatches] = useState<Match[]>([]);

    useEffect(() => {
        axios.get(`/players/${playerId}/singles-matches`)
            .then(response => setMatches(response.data))
            .catch(error => console.error("Error fetching matches: ", error));
    }, [playerId, matches])

    document.title = "Singl mečevi";
    return (
        <div>
            <div className="container">
                <h1>Singl mečevi</h1>
                <p>Ovdje možete pregledavati sve mečeve za odabranog tenisača koji se nalaze u bazi.</p>
                <h2>Popis singl mečeva:</h2>
                {matches.length === 0 ? (
                    <p style={{fontStyle: 'italic'}}>Trenutno nema singl mečeva za odabranog tenisača u bazi.</p>
                ) : (
                    <table>
                        <tbody>
                        {matches.map(match => (
                            <tr key={match.matchId}>
                                    <td>{match.opponent1} vs {match.opponent2}</td>
                                    <td>{match.matchTimestamp}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>)}
            </div>
            <div className="empty"></div>
        </div>
    )
};

export default PlayerMatches;