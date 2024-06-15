import {SetStateAction, useEffect, useRef, useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";
import './ClubManager.css'
import {Button, Form} from "react-bootstrap";

interface Court {
    courtId: number;
    clubName: string;
    surface: string;
    name: string;
}

function CourtManager() {
    const { clubId } = useParams<{ clubId: string }>();
    const [courts, setCourts] = useState<Court[]>([]);
    const [clubName, setClubName] = useState("");
    const [surface, setSurface] = useState("");
    const [name, setName] = useState("");
    const [formError, setFormError] = useState("");
    const errorRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        axios.get(`/clubs/${clubId}/courts`)
            .then(response => setCourts(response.data))
            .catch(error => console.error("Error fetching courts: ", error));
    }, [courts, clubId])

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        const requiredFields =[
            clubName,
            surface,
            name
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

        try {
            const formData = new FormData();
            formData.append("clubName", clubName);
            formData.append("surface", surface);
            formData.append("name", name);

            const options = {
                method: "POST",
                body: formData,
            }

            const res = await fetch(`/clubs/${clubId}/courts`, options);
            if (res.status === 200) {
                alert("Teren uspješno dodan!");
                resetFormFields();
                window.scroll({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                alert("Teren nije uspješno dodan!" + res.status);
            }
        } catch (err) {
            console.error(err);
            alert("Pogreška pri dodavanju terena!");
        }
    };

    const resetFormFields = () => {
        setName("");
        setSurface("");
        setClubName("");
    }

    const handleClubNameChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setClubName(e.target.value);
    const handleNameChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setName(e.target.value);

    document.title = "Tereni";
    return (
        <div>
            <div className="container">
                <h1>Klupski tereni</h1>
                <p>Ovdje možete pregledavati sve terene za odabrani klub koja se nalaze u bazi, unijeti nove terene te
                ažurirati podatke za postojeće.</p>
                <h2>Popis terena:</h2>
                {courts.length === 0 ? (
                    <p style={{fontStyle: 'italic'}}>Trenutno nema terena za odabrani klub u bazi.</p>
                ) : (
                    <table>
                        <tbody>
                        {courts.map(court => (
                            <tr key={court.courtId}>
                                <td>{court.name}</td>
                                {court.surface === "CLAY" && <td>Zemlja</td>}
                                {court.surface === "GRASS" && <td>Trava</td>}
                                {court.surface === "HARD" && <td>Tvrda</td>}
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
                <h2>Dodajte novi teren:</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="name">
                        <Form.Label className="label">Ime</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Upišite ime terena"
                            onChange={handleNameChange}
                            value={name}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="surface">
                        <Form.Label className="label">Podloga</Form.Label>
                        <div className="form-check form-check-inline" style={{margin: 5}}>
                            <input
                                type="radio"
                                id="clay"
                                name="surface"
                                value="clay"
                                onChange={() => setSurface("CLAY")}
                            />
                            <label>Zemlja</label>
                        </div>
                        <div className="form-check form-check-inline" style={{margin: 5}}>
                            <input
                                type="radio"
                                id="grass"
                                name="surface"
                                value="grass"
                                onChange={() => setSurface("GRASS")}
                            />
                            <label>Trava</label>
                        </div>
                        <div className="form-check form-check-inline" style={{margin: 5}}>
                            <input
                                type="radio"
                                id="hard"
                                name="surface"
                                value="hard"
                                onChange={() => setSurface("HARD")}
                            />
                            <label>Tvrda</label>
                        </div>
                    </Form.Group>
                    <Form.Group controlId="clubName">
                        <Form.Label className="label">Ime kluba</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Upišite ime kluba za koji se nabavlja oprema"
                            onChange={handleClubNameChange}
                            value={clubName}
                            className="control"
                        />
                    </Form.Group>
                    <Button variant="success" type="submit">
                        Dodaj teren
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

export default CourtManager;