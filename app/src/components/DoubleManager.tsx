import {SetStateAction, useEffect, useRef, useState} from "react";
import axios from "axios";
import './Manager.css'
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

function DoubleManager() {
    const [doubles, setDoubles] = useState<Pair[]>([]);
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

    const [filterRank, setFilterRank] = useState("");
    const [filterDate, setFilterDate] = useState("");

    const [sortCriteria, setSortCriteria] = useState<keyof Pair>("rank");
    const [sortOrder, setSortOrder] = useState<string>("asc");

    useEffect(() => {
        axios.get('/doubles')
            .then(response => setDoubles(response.data))
            .catch(error => console.error("Error fetching doubles: ", error));
        axios.get('/players')
            .then(response => setPlayers(response.data))
            .catch(error => console.error("Error fetching players: ", error));
    }, [doubles, players])

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setFormError("");

        const requiredFields =[
            player1oib,
            player1name,
            player1surname,
            player2oib,
            player2name,
            player2surname
        ];

        if (requiredFields.some((field) => field === null || field === "")) {
            setFormError("Potrebno je unijeti oba igrača u paru!");

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
        setDateOfTermination("");
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

    const handleFilterRankChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setFilterRank(e.target.value);
    const handleFilterDateChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setFilterDate(e.target.value);

    const handleSortChange = (criteria: keyof Pair) => {
        setSortCriteria(criteria);
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    const sortDoubles = (doubles: Pair[], criteria: keyof Pair, order: string) => {
        return doubles.sort((a, b) => {
            if (a[criteria] < b[criteria]) {
                return order === "asc" ? -1 : 1;
            }
            if (a[criteria] > b[criteria]) {
                return order === "asc" ? 1 : -1;
            }
            return 0;
        });
    };

    const filteredDoubles = doubles.filter(double => {
        return (
            (filterRank === "" || double.rank.toString().toLowerCase().includes(filterRank.toLowerCase())) &&
            (filterDate === "" || double.dateOfTermination.toString().includes(filterDate))
        );
    });

    const sortedDoubles = sortDoubles(filteredDoubles, sortCriteria, sortOrder);

    document.title = "Parovi";
    return (
        <div>
            <div className="container">
                <h1>Parovi</h1>
                <p>Ovdje možete pregledavati sve parove koji se nalaze u bazi, unijeti nove parove te
                    ažurirati podatke za postojeće.</p>
                <hr/>
                <h2>Filtriraj terene:</h2>
                <Form>
                    <Form.Group controlId="filterRank">
                        <Form.Label className="label">Filtriraj po rankingu</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Unesite rank"
                            onChange={handleFilterRankChange}
                            value={filterRank}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="filterDate">
                        <Form.Label className="label">Filtriraj po datumu prestanka djelovanja para</Form.Label>
                        <Form.Control
                            type="date"
                            onChange={handleFilterDateChange}
                            value={filterDate}
                        />
                    </Form.Group>
                </Form>
                <Form.Group controlId="sortCriteria">
                    <Form.Label className="label">Sortiraj po:</Form.Label>
                    <Form.Control
                        as="select"
                        value={sortCriteria}
                        onChange={(e) => handleSortChange(e.target.value as keyof Pair)}
                        className="control"
                    >
                        <option value="rank">Rankingu</option>
                        <option value="dateOfTermination">Datumu prestanka djelovanja para</option>
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
                <h2>Popis parova:</h2>
                {sortedDoubles.length === 0 ? (
                    <p style={{fontStyle: 'italic'}}>Trenutno nema parova u bazi.</p>
                ) : (
                    <table>
                        <tbody>
                        {sortedDoubles.map(pair => (
                            <tr key={pair.pairId} style={{cursor: 'pointer'}}
                                onClick={() => window.location.href = `/doubles/${pair.pairId}`}>
                                <td>{pair.player1surname}-{pair.player2surname}</td>
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
                <h2>Dodajte novi par:</h2>
                <Form onSubmit={handleSubmit}>
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
                            placeholder="Upišite rank para"
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
                    <Button variant="success" type="submit">
                        Dodaj par
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

export default DoubleManager;