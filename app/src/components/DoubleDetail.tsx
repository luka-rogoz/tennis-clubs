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
}

function DoubleDetail() {
    const { pairId } = useParams<{ pairId: string }>();
    const [pair, setPair] = useState<Pair>();
    const [showChangeButton, setShowChangeButton] = useState(false);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const navigate = useNavigate();
    const [player1oib, setPlayer1oib] = useState("");
    const [player1name, setPlayer1name] = useState("");
    const [player1surname, setPlayer1surname] = useState("");
    const [player2oib, setPlayer2oib] = useState("");
    const [player2name, setPlayer2name] = useState("");
    const [player2surname, setPlayer2surname] = useState("");
    const [rank, setRank] = useState("");
    const [formError, setFormError] = useState("");
    const errorRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        axios.get(`/doubles/${pairId}`)
            .then(response => setPair(response.data))
            .catch(error => console.error("Error fetching pair: ", error));
    }, [pairId])

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

    const handlePlayer1oibChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setPlayer1oib(e.target.value);
    const handlePlayer1nameChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setPlayer1name(e.target.value);
    const handlePlayer1surnameChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setPlayer1surname(e.target.value);
    const handlePlayer2oibChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setPlayer2oib(e.target.value);
    const handlePlayer2nameChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setPlayer2name(e.target.value);
    const handlePlayer2surnameChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setPlayer2surname(e.target.value);
    const handleRankChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setRank(e.target.value);

    document.title = pair?.player1surname + "-" + pair?.player2surname;
    return (
        <div>
            <div className="container">
                <h1>Podaci o paru</h1>
                <p><strong>Tenisač 1: </strong>{pair?.player1name} {pair?.player1surname}, {pair?.player1oib}</p>
                <p><strong>Tenisač 2: </strong>{pair?.player2name} {pair?.player2surname}, {pair?.player2oib}</p>
                {pair?.rank && <p><strong>Rank: </strong>{pair.rank}</p>}
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
                        <Form.Group controlId="player1oib">
                            <Form.Label className="label">Oib tenisača 1</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={pair?.player1oib}
                                onChange={handlePlayer1oibChange}
                                value={player1oib}
                                className="control"
                            />
                        </Form.Group>
                        <Form.Group controlId="player1name">
                            <Form.Label className="label">Ime tenisača 1</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={pair?.player1name}
                                onChange={handlePlayer1nameChange}
                                value={player1name}
                                className="control"
                            />
                        </Form.Group>
                        <Form.Group controlId="player1surname">
                            <Form.Label className="label">Prezime tenisača 1</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={pair?.player1surname}
                                onChange={handlePlayer1surnameChange}
                                value={player1surname}
                                className="control"
                            />
                        </Form.Group>
                        <Form.Group controlId="player2oib">
                            <Form.Label className="label">Oib tenisača 2</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={pair?.player2oib}
                                onChange={handlePlayer2oibChange}
                                value={player2oib}
                                className="control"
                            />
                        </Form.Group>
                        <Form.Group controlId="player2name">
                            <Form.Label className="label">Ime tenisača 2</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={pair?.player2name}
                                onChange={handlePlayer2nameChange}
                                value={player2name}
                                className="control"
                            />
                        </Form.Group>
                        <Form.Group controlId="player2surname">
                            <Form.Label className="label">Prezime tenisača 2</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={pair?.player2surname}
                                onChange={handlePlayer2surnameChange}
                                value={player2surname}
                                className="control"
                            />
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
                        <button type="submit" className="links" onClick={handleChangeClick}>Potvrdi</button>
                    </Form>
                )}
            </div>
            <div className="empty"></div>
        </div>
    )
};

export default DoubleDetail;