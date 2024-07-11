import {SetStateAction, useEffect, useRef, useState} from "react";
import axios from "axios";
import {Link, useNavigate, useParams} from "react-router-dom";
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

function MatchDetail() {
    const { tournamentId, matchId } = useParams<{ tournamentId: string, matchId: string }>();
    const [match, setMatch] = useState<Match>();
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
    const [categoryType, setCategoryType] = useState("");
    const [formError, setFormError] = useState("");
    const errorRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        axios.get(`/tournaments/${tournamentId}/matches/${matchId}`)
            .then(response => setMatch(response.data))
            .catch(error => console.error("Error fetching match: ", error));
    }, [matchId, tournamentId])

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

        const requiredFields =[
            matchTimestamp,
            matchResult,
            duration,
            stage,
            opponent1,
            opponent2,
            courtName,
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
            if (tournamentId != undefined) formData.append("tournamentId", tournamentId);
            formData.append("categoryType", categoryType);

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

    document.title = "Meč";
    return (
        <div>
            <div className="container">
                <h1>Podaci o meču</h1>
                <p><strong>Domaćin: </strong>{match?.opponent1}</p>
                <p><strong>Gost: </strong>{match?.opponent2}</p>
                <p><strong>Datum i vrijeme meča: </strong>{match?.matchTimestamp}</p>
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
                                placeholder={match?.opponent1}
                                onChange={handleOpponent1Change}
                                value={opponent1}
                                className="control"
                            />
                        </Form.Group>
                        <Form.Group controlId="clubName">
                            <Form.Label className="label">Oib igrača 2 / šifra para 2</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={match?.opponent2}
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
                                placeholder={match?.matchResult}
                                onChange={handleMatchResultChange}
                                value={matchResult}
                                className="control"
                            />
                        </Form.Group>
                        <Form.Group controlId="clubName">
                            <Form.Label className="label">Trajanje meča</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={match?.duration}
                                onChange={handleDurationChange}
                                value={duration}
                                className="control"
                            />
                        </Form.Group>
                        <Form.Group controlId="courtName">
                            <Form.Label className="label">Ime terena</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={match?.courtName}
                                onChange={handleCourtNameChange}
                                value={courtName}
                                className="control"
                            />
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