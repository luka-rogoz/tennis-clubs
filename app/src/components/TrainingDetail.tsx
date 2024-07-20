import {SetStateAction, useEffect, useRef, useState} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import './Manager.css'
import {Form} from "react-bootstrap";

interface Training {
    trainingId: number;
    trainingTimestamp: string;
    duration: string;
    description: string;
    notes: string;
    coach: string;
    players: Set<string>;
}

interface Person {
    personId: number;
    oib: string;
    name: string;
    surname: string;
}

function TrainingDetail() {
    const { coachId, trainingId } = useParams<{ coachId: string, trainingId: string }>();
    const [training, setTraining] = useState<Training>();
    const [players, setPlayers] = useState<Person[]>([]);
    const [showChangeButton, setShowChangeButton] = useState(false);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const navigate = useNavigate();
    const [trainingTimestamp, setTrainingTimestamp] = useState("");
    const [duration, setDuration] = useState("");
    const [description, setDescription] = useState("");
    const [notes, setNotes] = useState("");
    const [oibs, setOibs] = useState(['']);
    const [formError, setFormError] = useState("");
    const errorRef = useRef<HTMLDivElement | null>(null);

    const addOibField = () => {
        setOibs([...oibs, '']);
    };

    useEffect(() => {
        axios.get(`/coaches/${coachId}/training-sessions/${trainingId}`)
            .then(response => setTraining(response.data))
            .catch(error => console.error("Error fetching training session: ", error));
        axios.get(`/coaches/${coachId}/players`)
            .then(response => setPlayers(response.data))
            .catch(error => console.error("Error fetching players: ", error));
    }, [trainingId, coachId, players])

    const handleDeleteClick = async () => {
        try {
            const response = await fetch(`/coaches/${coachId}/training-sessions/${trainingId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                alert("Trening uspješno obrisan!");
                navigate(`/coaches/${coachId}/training-sessions`);
            } else {
                alert("Trening nije obrisan!");
            }
        } catch (err) {
            console.error("Error deleting training session: ", err);
            alert("Pogreška pri brisanju treninga!");
        }
    }

    const handleChangeClick = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setFormError("");

        const requiredFields =[
            trainingTimestamp,
            description,
            oibs
        ];

        if (requiredFields.some((field) => field === null || field === "")) {
            setFormError("Potrebno je unijeti datum i vrijeme treninga, opis, trenera i prisutne igrače!");

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
            formData.append("trainingId", "");
            formData.append("trainingTimestamp", trainingTimestamp);
            formData.append("description", description);
            formData.append("notes", notes);
            if (coachId != undefined) formData.append("coachId", coachId);
            formData.append("duration", duration);
            oibs.forEach((oib, index) => {
                formData.append("players", oib);
            });

            const options = {
                method: "PUT",
                body: formData,
            }

            const res = await fetch(`/coaches/${coachId}/training-sessions/${trainingId}`, options);
            if (res.status === 200) {
                alert("Podaci o treningu uspješno ažurirani!");
                window.scroll({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                alert("Podaci nisu ažurirani!" + res.status);
            }
        } catch (err) {
            console.error(err);
            alert("Pogreška pri ažuriranju podataka o treningu!");
        }
    };

    const handleTrainingTimestampChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setTrainingTimestamp(e.target.value);
    const handleNotesChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setNotes(e.target.value);
    const handleDescriptionChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setDescription(e.target.value);
    const handleOibChange = (index: number, event: { target: { value: string; }; }) => {
        const newOibs = oibs.slice();
        newOibs[index] = event.target.value;
        setOibs(newOibs);
    };
    const handleDurationChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setDuration(e.target.value);

    function formatDateTime(dateString: string | undefined): string {
        if (dateString == undefined) return "";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Mjeseci su 0-indeksirani
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}.${month}.${year}. ${hours}:${minutes}`;
    }

    document.title = "Trening";
    return (
        <div>
            <div className="container">
                <h1>Podaci o treningu</h1>
                <p><strong>Datum i vrijeme treninga: </strong>{formatDateTime(training?.trainingTimestamp)}</p>
                <p><strong>Trajanje: </strong>{training?.duration}</p>
                <p><strong>Opis: </strong>{training?.description}</p>
                <p><strong>Trener: </strong>{training?.coach}</p>
                {training?.notes && <p><strong>Bilješke: </strong>{training.notes}</p>}
                {training?.players && (
                    <ol><p><strong>Prisutni tenisači:</strong></p>
                        {[...(training?.players ?? new Set())].map((player) => (
                            <li key={player}><p>{player}</p></li>
                        ))}
                    </ol>
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
                    <label>Promijeni podatke o treningu</label>
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
                    <label>Izbriši podatke o treningu</label>
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
                        <Form.Group controlId="trainingTimestamp">
                            <Form.Label className="label">Datum i vrijeme treninga</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                onChange={handleTrainingTimestampChange}
                                value={trainingTimestamp}
                            />
                        </Form.Group>
                        <Form.Group controlId="description">
                            <Form.Label className="label">Opis</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={training?.description}
                                onChange={handleDescriptionChange}
                                value={description}
                                className="control"
                            />
                        </Form.Group>
                        <Form.Group controlId="notes">
                            <Form.Label className="label">Bilješke</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={training?.notes}
                                onChange={handleNotesChange}
                                value={notes}
                                className="control"
                            />
                        </Form.Group>
                        <Form.Group controlId="duration">
                            <Form.Label className="label">Trajanje</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={training?.duration}
                                onChange={handleDurationChange}
                                value={duration}
                                className="control"
                            />
                        </Form.Group>
                        {oibs.map((oib, index) => (
                            <Form.Group key={index} controlId={`player-${index}`}>
                                <Form.Label className="label">Sudionik {index + 1}</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={oibs[index] ?? ''}
                                    id={`player-select-${index}`}
                                    onChange={(event) => handleOibChange(index, event)}
                                    className="control"
                                >
                                    <option value="" disabled>Izaberi igrača</option>
                                    {players.map(p => (
                                        <option key={p.personId} value={p.oib}>
                                            {p.name} {p.surname}, {p.oib}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        ))}
                        <button type="button" onClick={addOibField}>Dodaj prisutnog tenisača</button>
                        <button type="submit" className="links button-space" onClick={handleChangeClick}>Potvrdi</button>
                    </Form>
                )}
            </div>
            <div className="empty"></div>
        </div>
    )
}

export default TrainingDetail;