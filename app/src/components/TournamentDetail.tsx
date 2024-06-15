import {SetStateAction, useEffect, useRef, useState} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import {Button, Form} from "react-bootstrap";
import './Detail.css'

interface Tournament {
    tournamentId: number;
    name: string;
    clubName: string;
    type: string;
    ageLimit: string;
    sexLimit: string;
}

function TournamentDetail() {
    const { tournamentId } = useParams<{ tournamentId: string }>();
    const [tournament, setTournament] = useState<Tournament>();
    const [showChangeButton, setShowChangeButton] = useState(false);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [ageLimit, setAgeLimit] = useState("");
    const [sexLimit, setSexLimit] = useState("");
    const [clubName, setClubName] = useState("");
    const [formError, setFormError] = useState("");
    const errorRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        axios.get(`/tournaments/${tournamentId}`)
            .then(response => setTournament(response.data))
            .catch(error => console.error("Error fetching tournament: ", error));
    }, [tournamentId])

    const handleDeleteClick = async () => {
        try {
            const response = await fetch(`/tournaments/${tournamentId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                alert("Turnir uspješno obrisan!");
                navigate("/tournaments/");
            } else {
                alert("Klub nije obrisan!");
            }
        } catch (err) {
            console.error("Error deleting club: ", err);
            alert("Pogreška pri brisanju kluba!");
        }
    }

    const handleChangeClick = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

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
                method: "PUT",
                body: formData,
            }

            const res = await fetch(`/tournaments/${tournamentId}`, options);
            if (res.status === 200) {
                alert("Podaci o turniru su uspješno ažurirani!");
                window.scroll({
                    top: 0,
                    behavior: 'smooth'
                });
                navigate("/tournaments/");
            } else {
                alert("Podaci nisu ažurirani!" + res.status);
            }
        } catch (err) {
            console.error(err);
            alert("Pogreška pri ažuriranju podataka o turniru!");
        }
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

    return (
        <div>
            <div className="container">
                <h1>Podaci o turniru</h1>
                <p><strong>Ime: </strong>{tournament?.name}</p>
                <p><strong>Ime kluba: </strong>{tournament?.clubName}</p>
                {tournament?.type === "SINGLES" && <p><strong>Tip: </strong>singl</p>}
                {tournament?.type === "DOUBLES" && <p><strong>Tip: </strong>parovi</p>}
                {tournament?.sexLimit === "MALE" && <p><strong>Spolno ograničenje: </strong>muškarci</p>}
                {tournament?.sexLimit === "FEMALE" && <p><strong>Spolno ograničenje: </strong>žene</p>}
                {tournament?.ageLimit && <p><strong>Dobno ograničenje: </strong>{tournament.ageLimit}</p>}
                <p><strong>Ostalo:</strong></p>
                <br/>
                <Button href={`/tournaments/${tournamentId}/matches`} className="links">Mečevi</Button>
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
                    <label>Promijeni podatke o turniru</label>
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
                    <label>Izbriši podatke o turniru</label>
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
                        <Form.Group controlId="name">
                            <Form.Label className="label">Ime</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={tournament?.name}
                                onChange={handleNameChange}
                                value={name}
                                className="control"
                            />
                        </Form.Group>
                        <Form.Group controlId="clubName">
                            <Form.Label className="label">Ime kluba</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={tournament?.clubName}
                                onChange={handleClubNameChange}
                                value={clubName}
                                className="control"
                            />
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
                                placeholder={tournament?.ageLimit}
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
                        <button type="submit" className="links" onClick={handleChangeClick}>Potvrdi</button>
                    </Form>
                )}
            </div>
            <div className="empty"></div>
        </div>
    )
};

export default TournamentDetail;