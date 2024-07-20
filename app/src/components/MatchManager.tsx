import {SetStateAction, useEffect, useRef, useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";
import './Manager.css'
import {Button, Form} from "react-bootstrap";

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

function MatchManager() {
    const { tournamentId } = useParams<{ tournamentId: string }>();
    const [matches, setMatches] = useState<Match[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [pairs, setPairs] = useState<Pair[]>([]);
    const [courts, setCourts] = useState<Court[]>([]);
    const [tournament, setTournament] = useState<Tournament>();
    const [clubs, setClubs] = useState<Club[]>([]);
    const [clubId, setClubId] = useState<number | undefined>(undefined);
    const [matchTimestamp, setMatchTimestamp] = useState("");
    const [matchResult, setMatchResult] = useState("");
    const [duration, setDuration] = useState("");
    const [stage, setStage] = useState("");
    const [opponent1, setOpponent1] = useState("");
    const [opponent2, setOpponent2] = useState("");
    const [courtName, setCourtName] = useState("");
    const [formError, setFormError] = useState("");
    const errorRef = useRef<HTMLDivElement | null>(null);

    const [filterStage, setFilterStage] = useState<string[]>([]);
    const [filterCourt, setFilterCourt] = useState("");
    const [filterCategory, setFilterCategory] = useState<string[]>([]);
    const [filterAgeLimit, setFilterAgeLimit] = useState("");
    const [filterSexLimit, setFilterSexLimit] = useState<string[]>([]);

    const [sortCriteria, setSortCriteria] = useState<keyof Match>("matchTimestamp");
    const [sortOrder, setSortOrder] = useState<string>("asc");

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
        // Fetch tournament and clubs
        const fetchData = async () => {
            try {
                const [tournamentResponse, clubsResponse] = await Promise.all([
                    axios.get(`/tournaments/${tournamentId}`),
                    axios.get<Club[]>('/clubs')
                ]);

                setTournament(tournamentResponse.data);
                setClubs(clubsResponse.data);

                const club = clubsResponse.data.find(club => club.name === tournamentResponse.data.clubName);
                if (club) {
                    setClubId(club.clubId);
                }
            } catch (error) {
                console.error("Error fetching tournament or clubs: ", error);
            }
        };

        fetchData();
    }, [tournamentId, clubs]);

    useEffect(() => {
        if (clubId) {
            axios.get(`/clubs/${clubId}/courts`)
                .then(response => setCourts(response.data))
                .catch(error => console.error("Error fetching courts: ", error));
        }
    }, [clubId, courts]);

    useEffect(() => {
        axios.get(`/tournaments/${tournamentId}/matches`)
            .then(response => setMatches(response.data))
            .catch(error => console.error("Error fetching matches: ", error));
    }, [tournamentId, matches]);

    useEffect(() => {
        axios.get('/players')
            .then(response => setPlayers(response.data))
            .catch(error => console.error("Error fetching players: ", error));
    }, [players]);

    useEffect(() => {
        axios.get('/doubles')
            .then(response => setPairs(response.data))
            .catch(error => console.error("Error fetching doubles: ", error));
    }, [pairs]);

    const filteredPlayers = filterPlayers(players, tournament?.ageLimit, tournament?.sexLimit);
    const filteredPairs = filterPairs(pairs, tournament?.ageLimit, tournament?.sexLimit);

    const handleSubmit = async (e: { preventDefault: () => void }) => {
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
                method: "POST",
                body: formData,
            }

            const res = await fetch(`/tournaments/${tournamentId}/matches`, options);
            if (res.status === 200) {
                alert("Meč uspješno dodan!");
                resetFormFields();
                window.scroll({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                alert("Meč nije uspješno dodan!" + res.status);
            }
        } catch (err) {
            console.error(err);
            alert("Pogreška pri dodavanju meča!");
        }
    };

    const resetFormFields = () => {
        setMatchTimestamp("");
        setDuration("");
        setStage("");
        setCourtName("");
        setMatchResult("");
        setOpponent1("");
        setOpponent2("");
    }

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

    const handleFilterCourtChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setFilterCourt(e.target.value);
    const handleFilterAgeLimitChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setFilterAgeLimit(e.target.value);
    const handleFilterSexLimitChange = (value: string) => {
        setFilterSexLimit(prev =>
            prev.includes(value)
                ? prev.filter(sex => sex !== value)
                : [...prev, value]
        );
    };
    const handleFilterCategoryChange = (value: string) => {
        setFilterSexLimit(prev =>
            prev.includes(value)
                ? prev.filter(category => category !== value)
                : [...prev, value]
        );
    };
    const handleFilterStageChange = (value: string) => {
        setFilterStage(prev =>
            prev.includes(value)
                ? prev.filter(stage => stage !== value)
                : [...prev, value]
        );
    };

    const handleSortChange = (criteria: keyof Match) => {
        setSortCriteria(criteria);
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    const sortMatches = (matches: Match[], criteria: keyof Match, order: string) => {
        return matches.sort((a, b) => {
            if (a[criteria] < b[criteria]) {
                return order === "asc" ? -1 : 1;
            }
            if (a[criteria] > b[criteria]) {
                return order === "asc" ? 1 : -1;
            }
            return 0;
        });
    };

    const filteredMatches = matches.filter(match => {
        return (
            (filterCourt === "" || match.courtName.toLowerCase().includes(filterCourt.toLowerCase())) &&
            (filterAgeLimit === "" || match.ageLimit.toLowerCase().includes(filterAgeLimit.toLowerCase())) &&
            (filterSexLimit.length === 0 || filterSexLimit.includes(match.sexLimit)) &&
            (filterCategory.length === 0 || filterCategory.includes(match.categoryType)) &&
            (filterStage.length === 0 || filterStage.includes(match.stage))
        );
    });

    const sortedMatches = sortMatches(filteredMatches, sortCriteria, sortOrder);

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

    document.title = "Mečevi";
    return (
        <div>
            <div className="container">
                <h1>Mečevi</h1>
                <p>Ovdje možete pregledavati sve mečeve za odabrani turnir koji se nalaze u bazi, unijeti nove mečeve te
                    ažurirati podatke za postojeće.</p>
                <hr/>
                <h2>Filtriraj mečeve:</h2>
                <Form>
                    <Form.Group controlId="filterCourtName">
                        <Form.Label className="label">Filtriraj po imenu terena</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Unesite ime terena"
                            onChange={handleFilterCourtChange}
                            value={filterCourt}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="filterCategory">
                        <Form.Label className="label">Filtriraj po kategoriji</Form.Label>
                        <div className="form-check form-check-inline" style={{margin: 5}}>
                            <input
                                type="checkbox"
                                id="singlesFilter"
                                name="filterCategory"
                                value="SINGLES"
                                checked={filterCategory.includes("SINGLES")}
                                onChange={() => handleFilterCategoryChange("SINGLES")}
                            />
                            <label>Singl</label>
                        </div>
                        <div className="form-check form-check-inline" style={{margin: 5}}>
                            <input
                                type="checkbox"
                                id="doublesFilter"
                                name="filterCategory"
                                value="DOUBLES"
                                checked={filterCategory.includes("DOUBLES")}
                                onChange={() => handleFilterCategoryChange("DOUBLES")}
                            />
                            <label>Parovi</label>
                        </div>
                    </Form.Group>
                    <Form.Group controlId="filterAgeLimit">
                        <Form.Label className="label">Filtriraj po dobnom ograničenju</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Unesite dobno ograničenje"
                            onChange={handleFilterAgeLimitChange}
                            value={filterAgeLimit}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="filterSexLimit">
                        <Form.Label className="label">Filtriraj po spolnom ograničenju</Form.Label>
                        <div className="form-check form-check-inline" style={{margin: 5}}>
                            <input
                                type="checkbox"
                                id="maleFilter"
                                name="filterSexLimit"
                                value="MALE"
                                checked={filterSexLimit.includes("MALE")}
                                onChange={() => handleFilterSexLimitChange("MALE")}
                            />
                            <label>Muškarci</label>
                        </div>
                        <div className="form-check form-check-inline" style={{margin: 5}}>
                            <input
                                type="checkbox"
                                id="femaleFilter"
                                name="filterSexLimit"
                                value="FEMALE"
                                checked={filterSexLimit.includes("FEMALE")}
                                onChange={() => handleFilterSexLimitChange("FEMALE")}
                            />
                            <label>Žene</label>
                        </div>
                    </Form.Group>
                    <Form.Group controlId="filterStage">
                        <Form.Label className="label">Filtriraj po razini natjecanja</Form.Label>
                        <div className="form-check form-check-inline" style={{margin: 5}}>
                            <input
                                type="checkbox"
                                id="groupFilter"
                                name="filterStage"
                                value="GROUP"
                                checked={filterStage.includes("GROUP")}
                                onChange={() => handleFilterStageChange("GROUP")}
                            />
                            <label>Grupa</label>
                        </div>
                        <div className="form-check form-check-inline" style={{margin: 5}}>
                            <input
                                type="checkbox"
                                id="last32Filter"
                                name="filterStage"
                                value="ROUND_OF_32"
                                checked={filterStage.includes("ROUND_OF_32")}
                                onChange={() => handleFilterStageChange("ROUND_OF_32")}
                            />
                            <label>Šesnaestina finala</label>
                        </div>
                        <div className="form-check form-check-inline" style={{margin: 5}}>
                            <input
                                type="checkbox"
                                id="last16Filter"
                                name="filterStage"
                                value="ROUND_OF_16"
                                checked={filterStage.includes("ROUND_OF_16")}
                                onChange={() => handleFilterStageChange("ROUND_OF_16")}
                            />
                            <label>Osmina finala</label>
                        </div>
                        <div className="form-check form-check-inline" style={{margin: 5}}>
                            <input
                                type="checkbox"
                                id="quarterFilter"
                                name="filterStage"
                                value="QUARTER_FINAL"
                                checked={filterStage.includes("QUARTER_FINAL")}
                                onChange={() => handleFilterStageChange("QUARTER_FINAL")}
                            />
                            <label>Četvrtina finala</label>
                        </div>
                        <div className="form-check form-check-inline" style={{margin: 5}}>
                            <input
                                type="checkbox"
                                id="semiFilter"
                                name="filterStage"
                                value="SEMI_FINAL"
                                checked={filterStage.includes("SEMI_FINAL")}
                                onChange={() => handleFilterStageChange("SEMI_FINAL")}
                            />
                            <label>Polufinale</label>
                        </div>
                        <div className="form-check form-check-inline" style={{margin: 5}}>
                            <input
                                type="checkbox"
                                id="finalFilter"
                                name="filterStage"
                                value="FINAL"
                                checked={filterStage.includes("FINAL")}
                                onChange={() => handleFilterStageChange("FINAL")}
                            />
                            <label>Finale</label>
                        </div>
                        <div className="form-check form-check-inline" style={{margin: 5}}>
                            <input
                                type="checkbox"
                                id="otherFilter"
                                name="filterStage"
                                value="OTHER"
                                checked={filterStage.includes("OTHER")}
                                onChange={() => handleFilterStageChange("OTHER")}
                            />
                            <label>Drugo</label>
                        </div>
                    </Form.Group>
                </Form>
                <Form.Group controlId="sortCriteria">
                    <Form.Label className="label">Sortiraj po:</Form.Label>
                    <Form.Control
                        as="select"
                        value={sortCriteria}
                        onChange={(e) => handleSortChange(e.target.value as keyof Match)}
                        className="control"
                    >
                        <option value="matchTimestamp">Datumu i vremenu meča</option>
                        <option value="courtName">Imenu terena</option>
                        <option value="categoryType">Kategoriji</option>
                        <option value="duration">Trajanju</option>
                        <option value="matchResult">Rezultatu</option>
                    </Form.Control>
                    <Button
                        variant="primary"
                        className="ms-2"
                        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    >
                        Poredaj {sortOrder === "asc" ? "silazno" : "uzlazno"}
                    </Button>
                </Form.Group>
                <div className="empty"></div>
                <hr/>
                <h2>Popis mečeva:</h2>
                {sortedMatches.length === 0 ? (
                    <p style={{fontStyle: 'italic'}}>Trenutno nema mečeva za odabrani turnir u bazi.</p>
                ) : (
                    <table>
                        <tbody>
                        {sortedMatches.map(match => (
                            <tr key={match.matchId} style={{cursor: 'pointer'}}
                                onClick={() => window.location.href = `/tournaments/${tournamentId}/matches/${match.matchId}`}>
                                <td>{match.opponent1} vs {match.opponent2}</td>
                                <td>{formatDateTime(match.matchTimestamp)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
                {formError && (
                    <div ref={errorRef} style={{color: 'red'}}>
                        {formError}
                    </div>
                )}
                <div className="empty"></div>
                <hr/>
                <h2>Dodajte novi meč:</h2>
                <Form onSubmit={handleSubmit}>
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
                    <Button variant="success" type="submit">
                        Dodaj meč
                    </Button>
                    <Button variant="secondary" className="button-space" onClick={resetFormFields}>
                        Odustani
                    </Button>
                </Form>
            </div>
            <div className="empty"></div>
        </div>
    )
}

export default MatchManager;