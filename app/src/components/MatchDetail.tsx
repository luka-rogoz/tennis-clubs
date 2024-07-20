import {SetStateAction, useEffect, useRef, useState} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import './Manager.css'
import {Form} from "react-bootstrap";

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

interface Player {
    playerId: number;
    oib: string;
    name: string;
    surname: string;
    dateOfBirth: string;
    sex: string;
    zipCode: number;
    placeName: string;
    height: number;
    weight: number;
    prefferedHand: string;
    rank: number;
    injury: string;
    clubName: string;
    from: string;
}

interface Pair {
    pairId: number;
    player1oib: string;
    player1name: string;
    player1surname: string;
    player2oib: string;
    player2name: string;
    player2surname: string;
    rank: number;
    dateOfTermination: string;
}

interface Court {
    courtId: number;
    clubName: string;
    surface: string;
    name: string;
}

interface Tournament {
    tournamentId: number;
    name: string;
    clubName: string;
    type: string;
    ageLimit: string;
    sexLimit: string;
}

interface Club {
    clubId: number;
    name: string;
    foundationYear: number;
    email: string;
    phoneNumber: string;
    webAddress: string;
    budget: number;
    zipCode: number;
    placeName: string;
}

function MatchDetail() {
    const { tournamentId, matchId } = useParams<{ tournamentId: string, matchId: string }>();
    const [match, setMatch] = useState<Match>();
    const [players, setPlayers] = useState<Player[]>([]);
    const [pairs, setPairs] = useState<Pair[]>([]);
    const [courts, setCourts] = useState<Court[]>([]);
    const [tournament, setTournament] = useState<Tournament>();
    const [clubs, setClubs] = useState<Club[]>([]);
    const [clubId, setClubId] = useState<number | undefined>(undefined);
    const [showChangeButton, setShowChangeButton] = useState(false);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const navigate = useNavigate();
    const [matchTimestamp, setMatchTimestamp] = useState("");
    const [matchResult, setMatchResult] = useState("");
    const [duration, setDuration] = useState("");
    const [stage, setStage] = useState("");
    const [opponent1, setOpponent1] = useState("");
    const [opponent2, setOpponent2] = useState("");
    const [courtName, setCourtName] = useState("");
    const [formError, setFormError] = useState("");
    const errorRef = useRef<HTMLDivElement | null>(null);

    const getAge = (birthDate: string) => {
        const today = new Date();
        const bd = new Date(birthDate);
        let age = today.getFullYear() - bd.getFullYear();
        const monthDifference = today.getMonth() - bd.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < bd.getDate())) {
            age--;
        }
        return age;
    };

    const getPlayerByOib = (oib: string) => {
        return players.find(player => player.oib === oib);
    };

    const filterPlayers = (p: Player[], age: string | undefined, sex: string | undefined) => {
        let ageLimitNumber = 0;
        if (age != null) {
            ageLimitNumber = parseInt(age, 10);
        }
        return p.filter(pl => getAge(pl.dateOfBirth) <= ageLimitNumber && pl.sex == sex);
    };

    const filterPairs = (p: Pair[], age: string | undefined, sex: string | undefined) => {
        let ageLimitNumber = 0;
        if (age != null) {
            ageLimitNumber = parseInt(age, 10);
        }
        return p.filter(double => {
            if (double.dateOfTermination) return false;
            const player1 = getPlayerByOib(double.player1oib);
            const player2 = getPlayerByOib(double.player2oib);
            if (!player1 || !player2) return false;

            const player1Age = getAge(player1.dateOfBirth);
            const player2Age = getAge(player2.dateOfBirth);

            const player1Matches = player1Age <= ageLimitNumber && (player1.sex == sex) ;
            const player2Matches = player2Age <= ageLimitNumber && (player2.sex == sex);

            return player1Matches && player2Matches;
        });
    };

    useEffect(() => {
        axios.get(`tournaments/${tournamentId}`)
            .then(response => setTournament(response.data))
            .catch(error => console.error("Error fetching tournament: ", error));
        axios.get(`/clubs`)
            .then(response => setClubs(response.data))
            .catch(error => console.error("Error fetching clubs: ", error));
        setClubId(clubs.find(club => club.name == tournament?.clubName)?.clubId);
        axios.get(`clubs/${clubId}/courts`)
            .then(response => setCourts(response.data))
            .catch(error => console.error("Error fetching courts: ", error));
        axios.get(`/tournaments/${tournamentId}/matches/${matchId}`)
            .then(response => setMatch(response.data))
            .catch(error => console.error("Error fetching matches: ", error));
        axios.get('/players')
            .then(response => setPlayers(response.data))
            .catch(error => console.error("Error fetching players: ", error));
        axios.get('/doubles')
            .then(response => setPairs(response.data))
            .catch(error => console.error("Error fetching doubles: ", error));
    }, [matchId, tournamentId, players, pairs])

    const filteredPlayers = filterPlayers(players, tournament?.ageLimit, tournament?.sexLimit);
    const filteredPairs = filterPairs(pairs, tournament?.ageLimit, tournament?.sexLimit);

    const handleDeleteClick = async () => {
        try {
            const response = await fetch(`/tournaments/${tournamentId}/matches/${matchId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                alert("Meč uspješno obrisan!");
                navigate(`/tournaments/${tournamentId}/matches`);
            } else {
                alert("Meč nije obrisan!");
            }
        } catch (err) {
            console.error("Error deleting match: ", err);
            alert("Pogreška pri brisanju meča!");
        }
    }

    const handleChangeClick = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setFormError("");

        const requiredFields =[
            matchTimestamp,
            matchResult,
            duration,
            stage,
            opponent1,
            opponent2,
            courtName
        ];

        if (requiredFields.some((field) => field === null || field === "")) {
            setFormError("Potrebno je ispuniti sva polja!");

            if (errorRef.current) {
                errorRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }

            return;
        }

        const resultRegex = /^(3-0|3-1|3-2|0-3|1-3|2-3|2-0|2-1|1-2|1-0|0-2|0-1)$/;
        if (!resultRegex.test(matchResult)) {
            setFormError("Format rezultata meča je neispravan!");

            if (errorRef.current) {
                errorRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }

            return;
        }

        try {
            const formData = new FormData();
            formData.append("matchTimestamp", matchTimestamp);
            formData.append("matchResult", matchResult);
            formData.append("duration", duration);
            formData.append("stage", stage);
            formData.append("opponent1", opponent1);
            formData.append("opponent2", opponent2);
            formData.append("courtName", courtName);
            if (tournamentId != undefined) formData.append("tournamentId", tournamentId);

            const options = {
                method: "PUT",
                body: formData,
            }

            const res = await fetch(`/tournaments/${tournamentId}/matches/${matchId}`, options);
            if (res.status === 200) {
                alert("Podaci o meču uspješno ažurirani!");
                window.scroll({
                    top: 0,
                    behavior: 'smooth'
                });
                navigate(`/tournaments/${tournamentId}/matches`);
            } else {
                alert("Meč nije uspješno dodan!" + res.status);
            }
        } catch (err) {
            console.error(err);
            alert("Pogreška pri dodavanju meča!");
        }
    };

    const handleDurationChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setDuration(e.target.value);
    const handleCourtNameChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setCourtName(e.target.value);
    const handleMatchResultChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setMatchResult(e.target.value);
    const handleOpponent1Change = (e: {
        target: { value: SetStateAction<string> };
    }) => setOpponent1(e.target.value);
    const handleOpponent2Change = (e: {
        target: { value: SetStateAction<string> };
    }) => setOpponent2(e.target.value);
    const handleMatchTimestampChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setMatchTimestamp(e.target.value);

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

    document.title = "Meč";
    return (
        <div>
            <div className="container">
                <h1>Podaci o meču</h1>
                <p><strong>Domaćin: </strong>{match?.opponent1}</p>
                <p><strong>Gost: </strong>{match?.opponent2}</p>
                <p><strong>Datum i vrijeme meča: </strong>{formatDateTime(match?.matchTimestamp)}</p>
                <p><strong>Rezultat (domaćin-gost): </strong>{match?.matchResult}</p>
                <p><strong>Turnir: </strong>{match?.tournamentName}</p>
                <p><strong>Razina: </strong>{match?.stage}</p>
                {match?.categoryType && match.categoryType == "SINGLES" && <p><strong>Kategorija: </strong>Singl</p>}
                {match?.categoryType && match.categoryType == "DOUBLES" && <p><strong>Kategorija: </strong>Parovi</p>}
                {match?.duration && <p><strong>Trajanje: </strong>{match.duration}</p>}
                {match?.courtName && <p><strong>Teren: </strong>{match.courtName}</p>}
                {formError && (
                    <div ref={errorRef} style={{color: 'red'}}>
                        {formError}
                    </div>
                )}
                <div className="empty"></div>
                <div className="empty"></div>
                <hr/>
                <h2>Uredi podatke:</h2>
                <div className="form-check form-check-inline" style={{margin: 5}}>
                    <input
                        type="radio"
                        id="change"
                        name="choice"
                        value="change"
                        onChange={() => {
                            setShowChangeButton(true)
                            setShowDeleteButton(false)
                        }}
                    />
                    <label>Promijeni podatke o meču</label>
                    <input
                        type="radio"
                        id="delete"
                        name="choice"
                        value="delete"
                        onChange={() => {
                            setShowDeleteButton(true)
                            setShowChangeButton(false)
                        }}
                    />
                    <label>Izbriši podatke o meču</label>
                </div>
                {showDeleteButton && (
                    <button className="links" onClick={handleDeleteClick}>Potvrdi</button>
                )}
                {showChangeButton && formError && (
                    <div ref={errorRef} style={{color: 'red'}}>
                        {formError}
                    </div>
                )}
                {showChangeButton && (
                    <Form onSubmit={handleChangeClick}>
                        <Form.Group controlId="stage">
                            <Form.Label className="label">Razina</Form.Label>
                            <div className="form-check form-check-inline" style={{margin: 5}}>
                                <input
                                    type="radio"
                                    id="group"
                                    name="stage"
                                    value="group"
                                    onChange={() => setStage("GROUP")}
                                />
                                <label>Grupa</label>
                            </div>
                            <div className="form-check form-check-inline" style={{margin: 5}}>
                                <input
                                    type="radio"
                                    id="round_of_32"
                                    name="stage"
                                    value="round_of_32"
                                    onChange={() => setStage("ROUND_OF_32")}
                                />
                                <label>Šesnaestina finala</label>
                            </div>
                            <div className="form-check form-check-inline" style={{margin: 5}}>
                                <input
                                    type="radio"
                                    id="round_of_16"
                                    name="stage"
                                    value="round_of_16"
                                    onChange={() => setStage("ROUND_OF_16")}
                                />
                                <label>Osmina finala</label>
                            </div>
                            <div className="form-check form-check-inline" style={{margin: 5}}>
                                <input
                                    type="radio"
                                    id="quarter_final"
                                    name="stage"
                                    value="quarter_final"
                                    onChange={() => setStage("QUARTER_FINAL")}
                                />
                                <label>Četvrtfinale</label>
                            </div>
                            <div className="form-check form-check-inline" style={{margin: 5}}>
                                <input
                                    type="radio"
                                    id="semi_final"
                                    name="stage"
                                    value="semi_final"
                                    onChange={() => setStage("SEMI_FINAL")}
                                />
                                <label>Polufinale</label>
                            </div>
                            <div className="form-check form-check-inline" style={{margin: 5}}>
                                <input
                                    type="radio"
                                    id="final"
                                    name="stage"
                                    value="final"
                                    onChange={() => setStage("FINAL")}
                                />
                                <label>Finale</label>
                            </div>
                            <div className="form-check form-check-inline" style={{margin: 5}}>
                                <input
                                    type="radio"
                                    id="other"
                                    name="stage"
                                    value="other"
                                    onChange={() => setStage("OTHER")}
                                />
                                <label>Drugo</label>
                            </div>
                        </Form.Group>
                        {tournament?.type === "SINGLES" && (
                            <Form.Group controlId="player1">
                                <Form.Label className="label">Protivnik domaćin</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={opponent1 ?? ''}
                                    id="player1-select"
                                    onChange={handleOpponent1Change}
                                    className="control"
                                >
                                    <option value="" disabled>Izaberi protivnika domaćina</option>
                                    {filteredPlayers.map(player => (
                                        <option key={player.playerId} value={player.oib}>
                                            {player.name} {player.surname}, {player.oib}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        )}
                        {tournament?.type === "SINGLES" && (
                            <Form.Group controlId="player2">
                                <Form.Label className="label">Protivnik gost</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={opponent2 ?? ''}
                                    id="player2-select"
                                    onChange={handleOpponent2Change}
                                    className="control"
                                >
                                    <option value="" disabled>Izaberi protivnika gosta</option>
                                    {filteredPlayers.map(player => (
                                        <option key={player.playerId} value={player.oib}>
                                            {player.name} {player.surname}, {player.oib}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        )}
                        {tournament?.type === "DOUBLES" && (
                            <Form.Group controlId="pair1">
                                <Form.Label className="label">Protivnik domaćin</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={opponent1 ?? ''}
                                    id="pair1-select"
                                    onChange={handleOpponent1Change}
                                    className="control"
                                >
                                    <option value="" disabled>Izaberi protivnika domaćina</option>
                                    {filteredPairs.map(pair => (
                                        <option key={pair.pairId} value={pair.pairId}>
                                            {pair.player1surname} {pair.player2surname}, {pair.pairId}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        )}
                        {tournament?.type === "DOUBLES" && (
                            <Form.Group controlId="pair2">
                                <Form.Label className="label">Protivnik gost</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={opponent2 ?? ''}
                                    id="pair2-select"
                                    onChange={handleOpponent2Change}
                                    className="control"
                                >
                                    <option value="" disabled>Izaberi protivnika gosta</option>
                                    {filteredPairs.map(pair => (
                                        <option key={pair.pairId} value={pair.pairId}>
                                            {pair.player1surname} {pair.player2surname}, {pair.pairId}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        )}
                        <Form.Group controlId="matchTimestamp">
                            <Form.Label className="label">Datum i vrijeme meča</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                onChange={handleMatchTimestampChange}
                                value={matchTimestamp}
                            />
                        </Form.Group>
                        <Form.Group controlId="matchResult">
                            <Form.Label className="label">Rezultat meča</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Upišite rezultat meča u setovima u formatu X-Y (npr. 3-1)"
                                onChange={handleMatchResultChange}
                                value={matchResult}
                                className="control"
                            />
                        </Form.Group>
                        <Form.Group controlId="duration">
                            <Form.Label className="label">Trajanje meča</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Upišite trajanje meča"
                                onChange={handleDurationChange}
                                value={duration}
                                className="control"
                            />
                        </Form.Group>
                        <Form.Group controlId="courtName">
                            <Form.Label className="label">Ime terena</Form.Label>
                            <Form.Control
                                as="select"
                                value={courtName ?? ''}
                                id="court-select"
                                onChange={handleCourtNameChange}
                                className="control"
                            >
                                <option value="" disabled>Izaberi teren na kojem se igra meč</option>
                                {courts.map(court => (
                                    <option key={court.courtId} value={court.name}>
                                        {court.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <button type="submit" className="links" onClick={handleChangeClick}>Potvrdi</button>
                    </Form>
                )}
            </div>
            <div className="empty"></div>
        </div>
    )
}

export default MatchDetail;