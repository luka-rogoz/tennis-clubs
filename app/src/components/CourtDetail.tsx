import {SetStateAction, useEffect, useRef, useState} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import {Button, Form} from "react-bootstrap";
import './Detail.css'

interface Court {
    courtId: number;
    clubName: string;
    surface: string;
    name: string;
}

function EquipmentDetail() {
    const { clubId, courtId } = useParams<{ clubId: string, courtId: string }>();
    const [court, setCourt] = useState<Court>();
    const [showChangeButton, setShowChangeButton] = useState(false);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const navigate = useNavigate();
    const [surface, setSurface] = useState("");
    const [name, setName] = useState("");
    const [formError, setFormError] = useState("");
    const errorRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        axios.get(`/clubs/${clubId}/courts/${courtId}`)
            .then(response => setCourt(response.data))
            .catch(error => console.error("Error fetching court: ", error));
    }, [clubId, courtId])

    const handleDeleteClick = async () => {
        try {
            const response = await fetch(`/clubs/${clubId}/courts/${courtId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                alert("Teren uspješno obrisan!");
                navigate(`/clubs/${clubId}/courts`);
            } else {
                alert("Teren nije obrisan!");
            }
        } catch (err) {
            console.error("Error deleting court: ", err);
            alert("Pogreška pri brisanju terena!");
        }
    }

    const handleChangeClick = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        const requiredFields =[
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
            if (clubId != undefined) formData.append("clubId", clubId);
            formData.append("surface", surface);
            formData.append("name", name);

            const options = {
                method: "PUT",
                body: formData,
            }

            const res = await fetch(`/clubs/${clubId}/courts/${courtId}`, options);
            if (res.status === 200) {
                alert("Podaci o terenu uspješno ažurirani!");
                window.scroll({
                    top: 0,
                    behavior: 'smooth'
                });
                navigate(`/clubs/${clubId}/courts`);
            } else {
                alert("Podaci nisu ažurirani!" + res.status);
            }
        } catch (err) {
            console.error(err);
            alert("Pogreška pri ažuriranju podataka o terenu!");
        }
    }

    const handleNameChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setName(e.target.value);

    document.title = "Teren";
    return (
        <div>
            <div className="container">
                <h1>Podaci o terenu</h1>
                <p><strong>Naziv: </strong>{court?.name}</p>
                <p><strong>Ime kluba: </strong>{court?.clubName}</p>
                {court?.surface && court.surface === "CLAY" && <p><strong>Podloga: </strong>Zemlja</p>}
                {court?.surface && court.surface === "GRASS" && <p><strong>Podloga: </strong>Trava</p>}
                {court?.surface && court.surface === "HARD" && <p><strong>Podloga: </strong>Tvrda</p>}
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
                    <label>Promijeni podatke o terenu</label>
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
                    <label>Izbriši podatke o terenu</label>
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
                                placeholder={court?.name}
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
                        <button type="submit" className="links" onClick={handleChangeClick}>Potvrdi</button>
                    </Form>
                )}
            </div>
            <div className="empty"></div>
        </div>
    )
};

export default EquipmentDetail;