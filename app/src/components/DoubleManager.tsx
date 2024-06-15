import {SetStateAction, useEffect, useRef, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import './ClubManager.css'
import {Button, Form} from "react-bootstrap";

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

function DoubleManager() {
    const [doubles, setDoubles] = useState<Pair[]>([]);
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
        axios.get('/doubles')
            .then(response => setDoubles(response.data))
            .catch(error => console.error("Error fetching doubles: ", error));
    }, [doubles])

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        const requiredFields =[
            player1oib,
            player1name,
            player1surname,
            player2oib,
            player2name,
            player2surname
        ];

        if (requiredFields.some((field) => field === null || field === "")) {
            setFormError("Potrebno je unijeti oib, ime i prezime za oba igrača u paru!");

            if (errorRef.current) {
                errorRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }

            return;
        }

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
                method: "POST",
                body: formData,
            }

            const res = await fetch("/doubles", options);
            if (res.status === 200) {
                alert("Par uspješno dodan!");
                resetFormFields();
                window.scroll({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                alert("Par nije uspješno dodan!" + res.status);
            }
        } catch (err) {
            console.error(err);
            alert("Pogreška pri dodavanju para!");
        }
    };

    const resetFormFields = () => {
        setPlayer1oib("");
        setPlayer1name("");
        setPlayer1surname("");
        setPlayer2oib("");
        setPlayer2name("");
        setPlayer2surname("");
        setRank("");
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

    document.title = "Parovi";
    return (
        <div>
            <div className="container">
                <h1>Parovi</h1>
                <p>Ovdje možete pregledavati sve parove koji se nalaze u bazi, unijeti nove parove te
                    ažurirati podatke za postojeće.</p>
                <h2>Popis parova:</h2>
                {doubles.length === 0 ? (
                    <p style={{fontStyle: 'italic'}}>Trenutno nema parova u bazi.</p>
                ) : (
                    <table>
                        <tbody>
                        {doubles.map(pair => (
                            <tr key={pair.pairId}>
                                <Link to={`/doubles/${pair.pairId}`}>
                                    <td>{pair.player1surname}-{pair.player2surname}</td>
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
                <h2>Dodajte novi par:</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="player1oib">
                        <Form.Label className="label">Oib tenisača 1</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Upišite oib prvog tenisača u paru"
                            onChange={handlePlayer1oibChange}
                            value={player1oib}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="player1name">
                        <Form.Label className="label">Ime tenisača 1</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Upišite ime prvog tenisača u paru"
                            onChange={handlePlayer1nameChange}
                            value={player1name}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="player1surname">
                        <Form.Label className="label">Prezime tenisača 1</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Upišite prezime prvog tenisača u paru"
                            onChange={handlePlayer1surnameChange}
                            value={player1surname}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="player2oib">
                        <Form.Label className="label">Oib tenisača 2</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Upišite oib drugog tenisača u paru"
                            onChange={handlePlayer2oibChange}
                            value={player2oib}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="player2name">
                        <Form.Label className="label">Ime tenisača 2</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Upišite ime drugog tenisača u paru"
                            onChange={handlePlayer2nameChange}
                            value={player2name}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="player2surname">
                        <Form.Label className="label">Prezime tenisača 2</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Upišite prezime drugog tenisača u paru"
                            onChange={handlePlayer2surnameChange}
                            value={player2surname}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="rank">
                        <Form.Label className="label">Rank</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Upišite rank para"
                            onChange={handleRankChange}
                            value={rank}
                            className="control"
                        />
                    </Form.Group>
                    <Button variant="success" type="submit">
                        Dodaj par
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

export default DoubleManager;