import {SetStateAction, useEffect, useRef, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import './ClubManager.css'
import {Button, Form} from "react-bootstrap";

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

function TournamentManager() {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [clubs, setClubs] = useState<Club[]>([]);
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [ageLimit, setAgeLimit] = useState("");
    const [sexLimit, setSexLimit] = useState("");
    const [clubName, setClubName] = useState("");
    const [formError, setFormError] = useState("");
    const errorRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        axios.get('/tournaments')
            .then(response => setTournaments(response.data))
            .catch(error => console.error("Error fetching tournaments: ", error));
        axios.get('/clubs')
            .then(response => setClubs(response.data))
            .catch(error => console.error("Error fetching clubs: ", error));
    }, [tournaments, clubs])

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        const requiredFields =[
            name,
            type,
            clubName
        ];

        if (requiredFields.some((field) => field === null || field === "")) {
            setFormError("Potrebno je unijeti ime i tip turnira te ime kluba organizatora!");

            if (errorRef.current) {
                errorRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }

            return;
        }

        const ageRegex = /^\d*$/;
        if (!ageRegex.test(ageLimit)) {
            setFormError("Format dobnog ograničenja je neispravan!");

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
            formData.append("name", name);
            formData.append("type", type);
            formData.append("ageLimit", ageLimit);
            formData.append("sexLimit", sexLimit);
            formData.append("clubName", clubName);

            const options = {
                method: "POST",
                body: formData,
            }

            const res = await fetch("/tournaments", options);
            if (res.status === 200) {
                alert("Turnir uspješno dodan!");
                resetFormFields();
                window.scroll({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                alert("Turnir nije uspješno dodan!" + res.status);
            }
        } catch (err) {
            console.error(err);
            alert("Pogreška pri dodavanju turnira!");
        }
    };

    const resetFormFields = () => {
        setName("");
        setType("");
        setAgeLimit("");
        setSexLimit("");
        setClubName("");
    }

    const handleNameChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setName(e.target.value);
    const handleAgeLimitChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setAgeLimit(e.target.value);
    const handleClubNameChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setClubName(e.target.value);

    document.title = "Turniri";
    return (
        <div>
            <div className="container">
                <h1>Turniri</h1>
                <p>Ovdje možete pregledavati sve turnire koji se nalaze u bazi, unijeti nove turnire te
                    ažurirati podatke za postojeće.</p>
                <h2>Popis turnira:</h2>
                {tournaments.length === 0 ? (
                    <p style={{fontStyle: 'italic'}}>Trenutno nema turnira u bazi.</p>
                ) : (
                    <table>
                        <tbody>
                        {tournaments.map(tournament => (
                            <tr key={tournament.tournamentId}>
                                <Link to={`/tournaments/${tournament.tournamentId}`}>
                                    <td>{tournament.name}</td>
                                    <td>{tournament.clubName}</td>
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
                <h2>Dodajte novi turnir:</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="name">
                        <Form.Label className="label">Ime</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Upišite jedinstveno ime turnira"
                            onChange={handleNameChange}
                            value={name}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="clubName">
                        <Form.Label className="label">Ime kluba</Form.Label>
                        <select id="club-select" value={clubName ?? ''} onChange={handleClubNameChange}>
                            <option value="" disabled>Izaberi klub</option>
                            {clubs.map(club => (
                                <option key={club.clubId} value={club.name}>
                                    {club.name}
                                </option>
                            ))}
                        </select>
                    </Form.Group>
                    <Form.Group controlId="type">
                        <Form.Label className="label">Tip</Form.Label>
                        <div className="form-check form-check-inline" style={{margin: 5}}>
                            <input
                                type="radio"
                                id="singles"
                                name="type"
                                value="singles"
                                onChange={() => setType("SINGLES")}
                            />
                            <label>Singl</label>
                        </div>
                        <div className="form-check form-check-inline" style={{margin: 5}}>
                            <input
                                type="radio"
                                id="doubles"
                                name="type"
                                value="doubles"
                                onChange={() => setType("DOUBLES")}
                            />
                            <label>Parovi</label>
                        </div>
                    </Form.Group>
                    <Form.Group controlId="ageLimit">
                        <Form.Label className="label">Dobno ograničenje</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Upišite dobno ograničenje, ako postoji"
                            onChange={handleAgeLimitChange}
                            value={ageLimit}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="sexLimit">
                        <Form.Label className="label">Spolno ograničenje</Form.Label>
                        <div className="form-check form-check-inline" style={{margin: 5}}>
                            <input
                                type="radio"
                                id="male"
                                name="sexLimit"
                                value="male"
                                onChange={() => setSexLimit("MALE")}
                            />
                            <label>Muškarci</label>
                        </div>
                        <div className="form-check form-check-inline" style={{margin: 5}}>
                            <input
                                type="radio"
                                id="female"
                                name="sexLimit"
                                value="female"
                                onChange={() => setSexLimit("FEMALE")}
                            />
                            <label>Žene</label>
                        </div>
                    </Form.Group>
                    <Button variant="success" type="submit">
                        Dodaj turnir
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

export default TournamentManager;