import {SetStateAction, useEffect, useRef, useState} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import {Button, Form} from "react-bootstrap";
import './Detail.css'

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

function DoubleDetail() {
    const { pairId } = useParams<{ pairId: string }>();
    const [pair, setPair] = useState<Pair>();
    const [showChangeButton, setShowChangeButton] = useState(false);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const navigate = useNavigate();
    const [players, setPlayers] = useState<Player[]>([]);
    const [player1oib, setPlayer1oib] = useState("");
    const [player1name, setPlayer1name] = useState("");
    const [player1surname, setPlayer1surname] = useState("");
    const [player2oib, setPlayer2oib] = useState("");
    const [player2name, setPlayer2name] = useState("");
    const [player2surname, setPlayer2surname] = useState("");
    const [rank, setRank] = useState("");
    const [dateOfTermination, setDateOfTermination] = useState("");
    const [formError, setFormError] = useState("");
    const errorRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        axios.get(`/doubles/${pairId}`)
            .then(response => setPair(response.data))
            .catch(error => console.error("Error fetching pair: ", error));
        axios.get('/players')
            .then(response => setPlayers(response.data))
            .catch(error => console.error("Error fetching players: ", error));
    }, [pairId, players])

    const handleDeleteClick = async () => {
        try {
            const response = await fetch(`/doubles/${pairId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                alert("Par uspješno obrisan!");
                navigate("/doubles/");
            } else {
                alert("Par nije obrisan!");
            }
        } catch (err) {
            console.error("Error deleting pair: ", err);
            alert("Pogreška pri brisanju para!");
        }
    }

    const handleChangeClick = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setFormError("");

        const oibRegex = /^\d{11}$/;
        if (!oibRegex.test(player1oib) || !oibRegex.test(player2oib)) {
            setFormError("Format oib-a je neispravan!");

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
            formData.append("player1oib", player1oib);
            formData.append("player1name", player1name);
            formData.append("player1surname", player1surname);
            formData.append("player2oib", player2oib);
            formData.append("player2name", player2name);
            formData.append("player2surname", player2surname);
            formData.append("rank", rank);
            formData.append("dateOfTermination", dateOfTermination);

            const options = {
                method: "PUT",
                body: formData,
            }

            const res = await fetch(`/doubles/${pairId}`, options);
            if (res.status === 200) {
                alert("Podaci o paru su uspješno ažurirani!");
                window.scroll({
                    top: 0,
                    behavior: 'smooth'
                });
                navigate("/doubles");
            } else {
                alert("Podaci nisu ažurirani!" + res.status);
            }
        } catch (err) {
            console.error(err);
            alert("Pogreška pri ažuriranju podataka o paru!");
        }
    }

    const handlePlayer1Change = (event: { target: { value: string; }; }) => {
        const selectedPlayer = players.find(player => player.oib === event.target.value);
        if (selectedPlayer) {
            setPlayer1oib(selectedPlayer.oib);
            setPlayer1name(selectedPlayer.name);
            setPlayer1surname(selectedPlayer.surname);
        }
    };
    const handlePlayer2Change = (event: { target: { value: string; }; }) => {
        const selectedPlayer = players.find(player => player.oib === event.target.value);
        if (selectedPlayer) {
            setPlayer2oib(selectedPlayer.oib);
            setPlayer2name(selectedPlayer.name);
            setPlayer2surname(selectedPlayer.surname);
        }
    };
    const handleRankChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setRank(e.target.value);
    const handleDateOfTermination = (e: {
        target: { value: SetStateAction<string> };
    }) => setDateOfTermination(e.target.value);

    document.title = pair?.player1surname + "-" + pair?.player2surname;
    return (
        <div>
            <div className="container">
                <h1>Podaci o paru</h1>
                <p><strong>Tenisač 1: </strong>{pair?.player1name} {pair?.player1surname}, {pair?.player1oib}</p>
                <p><strong>Tenisač 2: </strong>{pair?.player2name} {pair?.player2surname}, {pair?.player2oib}</p>
                {pair?.rank && <p><strong>Rank: </strong>{pair.rank}</p>}
                {pair?.dateOfTermination && <p><strong>Datum prestanka djelovanja para: </strong>{pair.dateOfTermination}</p>}
                <p><strong>Ostalo:</strong></p>
                <br/>
                <Button href={`/doubles/${pairId}/doubles-matches`} className="links">Mečevi u paru</Button>
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
                    <label>Promijeni podatke o paru</label>
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
                    <label>Izbriši podatke o paru</label>
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
                        <Form.Group controlId="player1">
                            <Form.Label className="label">Igrač 1</Form.Label>
                            <Form.Control
                                as="select"
                                value={player1oib ?? ''}
                                id="player1-select"
                                onChange={handlePlayer1Change}
                                className="control"
                            >
                                <option value="" disabled>Izaberi prvog igrača u paru</option>
                                {players.map(player => (
                                    <option key={player.playerId} value={player.oib}>
                                        {player.name} {player.surname}, {player.oib}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="player2">
                            <Form.Label className="label">Igrač 2</Form.Label>
                            <Form.Control
                                as="select"
                                value={player2oib ?? ''}
                                id="player2-select"
                                onChange={handlePlayer2Change}
                                className="control"
                            >
                                <option value="" disabled>Izaberi drugog igrača u paru</option>
                                {players.map(player => (
                                    <option key={player.playerId} value={player.oib}>
                                        {player.name} {player.surname}, {player.oib}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="rank">
                            <Form.Label className="label">Rank</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={pair?.rank.toString()}
                                onChange={handleRankChange}
                                value={rank}
                                className="control"
                            />
                        </Form.Group>
                        <Form.Group controlId="dateOfTermination">
                            <Form.Label className="label">Datum prestanka djelovanja para</Form.Label>
                            <Form.Control
                                type="date"
                                onChange={handleDateOfTermination}
                                value={dateOfTermination}
                            />
                        </Form.Group>
                        <button type="submit" className="links" onClick={handleChangeClick}>Potvrdi</button>
                    </Form>
                )}
            </div>
            <div className="empty"></div>
        </div>
    )
};

export default DoubleDetail;