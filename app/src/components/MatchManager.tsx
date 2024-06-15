import {SetStateAction, useEffect, useRef, useState} from "react";
import axios from "axios";
import {Link, useParams} from "react-router-dom";
import './ClubManager.css'
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
}

function MatchManager() {
    const { tournamentId } = useParams<{ tournamentId: string }>();
    const [matches, setMatches] = useState<Match[]>([]);
    const [matchTimestamp, setMatchTimestamp] = useState("");
    const [matchResult, setMatchResult] = useState("");
    const [duration, setDuration] = useState("");
    const [stage, setStage] = useState("");
    const [opponent1, setOpponent1] = useState("");
    const [opponent2, setOpponent2] = useState("");
    const [courtName, setCourtName] = useState("");
    const [tournamentName, setTournamentName] = useState("");
    const [categoryType, setCategoryType] = useState("");
    const [formError, setFormError] = useState("");
    const errorRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        axios.get(`/tournaments/${tournamentId}/matches`)
            .then(response => setMatches(response.data))
            .catch(error => console.error("Error fetching matches: ", error));
    }, [matches, tournamentId])

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        const requiredFields =[
            matchTimestamp,
            matchResult,
            duration,
            stage,
            opponent1,
            opponent2,
            courtName,
            tournamentName,
            categoryType
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
            formData.append("tournamentName", tournamentName);
            formData.append("categoryType", categoryType);

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
        setCategoryType("");
        setCourtName("");
        setMatchResult("");
        setOpponent1("");
        setOpponent2("");
        setTournamentName("");
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
    const handleTournamentNameChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setTournamentName(e.target.value);
    const handleMatchTimestampChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setMatchTimestamp(e.target.value);

    document.title = "Mečevi";
    return (
        <div>
            <div className="container">
                <h1>Mečevi</h1>
                <p>Ovdje možete pregledavati sve mečeve za odabrani turnir koji se nalaze u bazi, unijeti nove mečeve te
                    ažurirati podatke za postojeće.</p>
                <h2>Popis mečeva:</h2>
                {matches.length === 0 ? (
                    <p style={{fontStyle: 'italic'}}>Trenutno nema mečeva za odabrani turnir u bazi.</p>
                ) : (
                    <table>
                        <tbody>
                        {matches.map(match => (
                            <tr key={match.matchId}>
                                <Link to={`/tournaments/${tournamentId}/matches/${match.matchId}`}>
                                    <td>{match.opponent1} vs {match.opponent2}</td>
                                    <td>{match.matchTimestamp}</td>
                                </Link>
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
                <h2>Dodajte novi meč:</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="name">
                        <Form.Label className="label">Ime turnira</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Upišite jedinstveno ime turnira"
                            onChange={handleTournamentNameChange}
                            value={tournamentName}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="categoryType">
                        <Form.Label className="label">Tip kategorije</Form.Label>
                        <div className="form-check form-check-inline" style={{margin: 5}}>
                            <input
                                type="radio"
                                id="singles"
                                name="categoryType"
                                value="singles"
                                onChange={() => setCategoryType("SINGLES")}
                            />
                            <label>Singl</label>
                        </div>
                        <div className="form-check form-check-inline" style={{margin: 5}}>
                            <input
                                type="radio"
                                id="doubles"
                                name="categoryType"
                                value="doubles"
                                onChange={() => setCategoryType("DOUBLES")}
                            />
                            <label>Parovi</label>
                        </div>
                    </Form.Group>
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
                    <Form.Group controlId="clubName">
                        <Form.Label className="label">Oib igrača 1 / šifra para 1</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Upišite oib igrača ili šifru para koji je nominalni domaćin meča"
                            onChange={handleOpponent1Change}
                            value={opponent1}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="clubName">
                        <Form.Label className="label">Oib igrača 2 / šifra para 2</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Upišite oib igrača ili šifru para koji je nominalni gost meča"
                            onChange={handleOpponent2Change}
                            value={opponent2}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="matchTimestamp">
                        <Form.Label className="label">Datum i vrijeme meča</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            onChange={handleMatchTimestampChange}
                            value={matchTimestamp}
                        />
                    </Form.Group>
                    <Form.Group controlId="clubName">
                        <Form.Label className="label">Rezultat meča</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Upišite rezultat meča u setovima (npr. 3-1)"
                            onChange={handleMatchResultChange}
                            value={matchResult}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="clubName">
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
                            type="text"
                            placeholder="Upišite ime terena na kojemu je meč odigran"
                            onChange={handleCourtNameChange}
                            value={courtName}
                            className="control"
                        />
                    </Form.Group>
                    <Button variant="success" type="submit">
                        Dodaj meč
                    </Button>
                    <Button variant="secondary" className="ms-2" onClick={resetFormFields}>
                        Odustani
                    </Button>
                </Form>
            </div>
            <div className="empty"></div>
        </div>
    )
}

export default MatchManager;