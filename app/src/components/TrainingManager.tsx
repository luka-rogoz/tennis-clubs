import {SetStateAction, useEffect, useRef, useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";
import './Manager.css'
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

interface Person {
    personId: number;
    oib: string;
    name: string;
    surname: string;
}

function TrainingManager() {
    const { coachId } = useParams<{ coachId: string }>();
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [players, setPlayers] = useState<Person[]>([]);
    const [trainingTimestamp, setTrainingTimestamp] = useState("");
    const [duration, setDuration] = useState("");
    const [description, setDescription] = useState("");
    const [notes, setNotes] = useState("");
    const [oibs, setOibs] = useState(['']);
    const [formError, setFormError] = useState("");
    const errorRef = useRef<HTMLDivElement | null>(null);

    const [filterDescription, setFilterDescription] = useState("");
    const [filterNotes, setFilterNotes] = useState("");

    const [sortCriteria, setSortCriteria] = useState<keyof Training>("trainingTimestamp");
    const [sortOrder, setSortOrder] = useState<string>("asc");

    const addOibField = () => {
        setOibs([...oibs, '']);
    };

    useEffect(() => {
        axios.get(`/coaches/${coachId}/training-sessions`)
            .then(response => setTrainings(response.data))
            .catch(error => console.error("Error fetching training sessions: ", error));
        axios.get(`/coaches/${coachId}/players`)
            .then(response => setPlayers(response.data))
            .catch(error => console.error("Error fetching players: ", error));
    }, [trainings, coachId, players])

    const handleSubmit = async (e: { preventDefault: () => void }) => {
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
    const handleOibChange = (index: number, event: { target: { value: string; }; }) => {
        const newOibs = oibs.slice();
        newOibs[index] = event.target.value;
        setOibs(newOibs);
    };

    const handleDurationChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setDuration(e.target.value);

    const handleFilterDescriptionChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setFilterDescription(e.target.value);
    const handleFilterNotesChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setFilterNotes(e.target.value);

    const handleSortChange = (criteria: keyof Training) => {
        setSortCriteria(criteria);
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    const sortTrainings = (trainings: Training[], criteria: keyof Training, order: string) => {
        return trainings.sort((a, b) => {
            if (a[criteria] < b[criteria]) {
                return order === "asc" ? -1 : 1;
            }
            if (a[criteria] > b[criteria]) {
                return order === "asc" ? 1 : -1;
            }
            return 0;
        });
    };

    const filteredTrainings = trainings.filter(training => {
        return (
            (filterDescription === "" || training.description.toLowerCase().includes(filterDescription.toLowerCase())) &&
            (filterNotes === "" || training.notes.toLowerCase().includes(filterNotes.toLowerCase()))
        );
    });

    const sortedTrainings = sortTrainings(filteredTrainings, sortCriteria, sortOrder);

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

    document.title = "Treninzi";
    return (
        <div>
            <div className="container">
                <h1>Treninzi</h1>
                <p>Ovdje možete pregledavati sve treninge za odabranog trenera koji se nalaze u bazi, unijeti nove
                    treninge te
                    ažurirati podatke za postojeće.</p>
                <hr/>
                <h2>Filtriraj treninge:</h2>
                <Form>
                    <Form.Group controlId="filterDescription">
                        <Form.Label className="label">Filtriraj po opisu</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Unesite opis treninga"
                            onChange={handleFilterDescriptionChange}
                            value={filterDescription}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="filterNotes">
                        <Form.Label className="label">Filtriraj po bilješkama</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Unesite bilješke s treninga"
                            onChange={handleFilterNotesChange}
                            value={filterNotes}
                            className="control"
                        />
                    </Form.Group>
                </Form>
                <Form.Group controlId="sortCriteria">
                    <Form.Label className="label">Sortiraj po:</Form.Label>
                    <Form.Control
                        as="select"
                        value={sortCriteria}
                        onChange={(e) => handleSortChange(e.target.value as keyof Training)}
                        className="control"
                    >
                        <option value="trainingTimestamp">Datumu i vremenu treninga</option>
                        <option value="description">Opisu</option>
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
                <h2>Popis treninga:</h2>
                {sortedTrainings.length === 0 ? (
                    <p style={{fontStyle: 'italic'}}>Trenutno nema treninga u bazi.</p>
                ) : (
                    <table>
                        <tbody>
                        {sortedTrainings.map(training => (
                            <tr key={training.trainingId} style={{cursor: 'pointer'}}
                                onClick={() => window.location.href = `/coaches/${coachId}/training-sessions/${training.trainingId}`}>
                                <td>{formatDateTime(training.trainingTimestamp)}</td>
                                <td>{training.description}</td>
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
                    <Button variant="success" className="button-space" type="submit">
                        Dodaj trening
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

export default TrainingManager;