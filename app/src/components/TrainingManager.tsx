import {SetStateAction, useEffect, useRef, useState} from "react";
import axios from "axios";
import {Link, useParams} from "react-router-dom";
import './ClubManager.css'
import {Button, Form} from "react-bootstrap";

interface Training {
    trainingId: number;
    trainingTimestamp: string;
    duration: string;
    description: string;
    notes: string;
    coach: string;
    players: Set<string>;
}

function TrainingManager() {
    const { coachId } = useParams<{ coachId: string }>();
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [trainingTimestamp, setTrainingTimestamp] = useState("");
    const [duration, setDuration] = useState("");
    const [description, setDescription] = useState("");
    const [notes, setNotes] = useState("");
    const [coach, setCoach] = useState("");
    const [oibs, setOibs] = useState(['']);
    const [formError, setFormError] = useState("");
    const errorRef = useRef<HTMLDivElement | null>(null);

    const addOibField = () => {
        setOibs([...oibs, '']);
    };

    useEffect(() => {
        axios.get(`/coaches/${coachId}/training-sessions`)
            .then(response => setTrainings(response.data))
            .catch(error => console.error("Error fetching training sessions: ", error));
    }, [trainings, coachId])

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        const requiredFields =[
            trainingTimestamp,
            description,
            oibs, coach
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

        const oibRegex = /^\d{11}$/;
        for (let oib of oibs) {
            if (!oibRegex.test(oib)) {
                setFormError("Format oib-a je neispravan!");

                if (errorRef.current) {
                    errorRef.current.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }

                return;
            }
        }

        try {
            const formData = new FormData();
            formData.append("trainingId", "");
            formData.append("trainingTimestamp", trainingTimestamp);
            formData.append("description", description);
            formData.append("notes", notes);
            formData.append("coach", coach);
            formData.append("duration", duration);
            oibs.forEach((oib, index) => {
                formData.append("players", oib);
            });

            const options = {
                method: "POST",
                body: formData,
            }

            const res = await fetch(`/coaches/${coachId}/training-sessions`, options);
            if (res.status === 200) {
                alert("Trening uspješno dodan!");
                resetFormFields();
                window.scroll({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                alert("Trening nije uspješno dodan!" + res.status);
            }
        } catch (err) {
            console.error(err);
            alert("Pogreška pri dodavanju treninga!");
        }
    };

    const resetFormFields = () => {
        setTrainingTimestamp("");
        setDescription("");
        setDuration("");
        setCoach("");
        setNotes("");
        setOibs(['']);
    }

    const handleTrainingTimestampChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setTrainingTimestamp(e.target.value);
    const handleNotesChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setNotes(e.target.value);
    const handleDescriptionChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setDescription(e.target.value);
    const handleOibChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const newOibs = oibs.slice();
        newOibs[index] = event.target.value;
        setOibs(newOibs);
    };
    const handleCoachChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setCoach(e.target.value);
    const handleDurationChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setDuration(e.target.value);

    document.title = "Treninzi";
    return (
        <div>
            <div className="container">
                <h1>Treninzi</h1>
                <p>Ovdje možete pregledavati sve treninge za odabranog trenera koji se nalaze u bazi, unijeti nove treninge te
                    ažurirati podatke za postojeće.</p>
                <h2>Popis treninga:</h2>
                {trainings.length === 0 ? (
                    <p style={{fontStyle: 'italic'}}>Trenutno nema treninga u bazi.</p>
                ) : (
                    <table>
                        <tbody>
                        {trainings.map(training => (
                            <tr key={training.trainingId}>
                                <Link to={`/coaches/${coachId}/training-sessions/${training.trainingId}`}>
                                    <td>{training.trainingTimestamp}</td>
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
                <h2>Dodajte novi trening:</h2>
                <Form onSubmit={handleSubmit}>
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
                            placeholder="Upišite opis treninga"
                            onChange={handleDescriptionChange}
                            value={description}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="notes">
                        <Form.Label className="label">Bilješke</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Upišite bilješke s treninga"
                            onChange={handleNotesChange}
                            value={notes}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="duration">
                        <Form.Label className="label">Trajanje</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Upišite trajanje treninga"
                            onChange={handleDurationChange}
                            value={duration}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="coach">
                        <Form.Label className="label">Oib trenera</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Upišite oib trenera koji vodi trening"
                            onChange={handleCoachChange}
                            value={coach}
                            className="control"
                        />
                    </Form.Group>
                    {oibs.map((oib, index) => (
                        <div key={index}>
                            <label>
                                OIB tenisača {index + 1}:
                                <input
                                    type="text"
                                    value={oib}
                                    onChange={(event) => handleOibChange(index, event)}
                                />
                            </label>
                        </div>
                    ))}
                    <button type="button" onClick={addOibField}>Dodaj prisutnog tenisača</button>
                    <Button variant="success" type="submit">
                        Dodaj trening
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

export default TrainingManager;