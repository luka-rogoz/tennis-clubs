import {SetStateAction, useEffect, useRef, useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";
import './Manager.css'
import {Button, Form} from "react-bootstrap";

interface Meeting {
    meetingId: number;
    meetingTimestamp: string;
    clubName: string;
    agenda: string;
    notes: string;
    attendees: Set<string>;
}

interface Person {
    personId: number;
    oib: string;
    name: string;
    surname: string;
}

function MeetingManager() {
    const { clubId } = useParams<{ clubId: string }>();
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [person, setPerson] = useState<Person[]>([]);
    const [meetingTimestamp, setMeetingTimestamp] = useState("");
    const [agenda, setAgenda] = useState("");
    const [notes, setNotes] = useState("");
    const [oibs, setOibs] = useState(['']);
    const [formError, setFormError] = useState("");
    const errorRef = useRef<HTMLDivElement | null>(null);

    const [filterAgenda, setFilterAgenda] = useState("");
    const [filterNotes, setFilterNotes] = useState("");

    const [sortCriteria, setSortCriteria] = useState<keyof Meeting>("meetingTimestamp");
    const [sortOrder, setSortOrder] = useState<string>("asc");

    const addOibField = () => {
        setOibs([...oibs, '']);
    };

    useEffect(() => {
        axios.get(`/clubs/${clubId}/meetings`)
            .then(response => setMeetings(response.data))
            .catch(error => console.error("Error fetching meetings: ", error));
        axios.get(`/clubs/person`)
            .then(response => setPerson(response.data))
            .catch(error => console.error("Error fetching person: ", error));
    }, [meetings, clubId, person])

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setFormError("");

        const requiredFields =[
            meetingTimestamp,
            agenda,
            oibs,
        ];

        if (requiredFields.some((field) => field === null || field === "")) {
            setFormError("Potrebno je ispuniti datum i vrijeme sastanka, dnevni red i sudionike!");

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
            formData.append("meetingTimestamp", meetingTimestamp);
            formData.append("agenda", agenda);
            formData.append("notes", notes);
            if (clubId != undefined) formData.append("clubId", clubId);
            oibs.forEach((oib, index) => {
                formData.append(`oibs`, oib);
            });

            const options = {
                method: "POST",
                body: formData,
            }

            const res = await fetch(`/clubs/${clubId}/meetings`, options);
            if (res.status === 200) {
                alert("Sastanak uspješno dodan!");
                resetFormFields();
                window.scroll({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                alert("Sastanak nije uspješno dodan!" + res.status);
            }
        } catch (err) {
            console.error(err);
            alert("Pogreška pri dodavanju sastanka!");
        }
    };

    const resetFormFields = () => {
        setMeetingTimestamp("");
        setAgenda("");
        setNotes("");
        setOibs(['']);
    }

    const handleMeetingTimestampChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setMeetingTimestamp(e.target.value);
    const handleNotesChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setNotes(e.target.value);
    const handleAgendaChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setAgenda(e.target.value);
    const handleOibChange = (index: number, event: { target: { value: string; }; }) => {
        const newOibs = oibs.slice();
        newOibs[index] = event.target.value;
        setOibs(newOibs);
    };

    const handleFilterAgendaChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setFilterAgenda(e.target.value);
    const handleFilterNotesChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setFilterNotes(e.target.value);

    const handleSortChange = (criteria: keyof Meeting) => {
        setSortCriteria(criteria);
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    const sortMeetings = (meetings: Meeting[], criteria: keyof Meeting, order: string) => {
        return meetings.sort((a, b) => {
            if (a[criteria] < b[criteria]) {
                return order === "asc" ? -1 : 1;
            }
            if (a[criteria] > b[criteria]) {
                return order === "asc" ? 1 : -1;
            }
            return 0;
        });
    };

    const filteredMeetings = meetings.filter(meeting => {
        return (
            (filterAgenda === "" || meeting.agenda.toLowerCase().includes(filterAgenda.toLowerCase())) &&
            (filterNotes === "" || meeting.notes.toLowerCase().includes(filterNotes.toLowerCase()))
        );
    });

    const sortedMeetings = sortMeetings(filteredMeetings, sortCriteria, sortOrder);

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

    document.title = "Sastanci";
    return (
        <div>
            <div className="container">
                <h1>Klupski sastanci</h1>
                <p>Ovdje možete pregledavati sve sastanke za odabrani klub koji se nalaze u bazi, unijeti nove sastanke
                    te
                    ažurirati podatke za postojeće.</p>
                <hr/>
                <h2>Filtriraj sastanke:</h2>
                <Form>
                    <Form.Group controlId="filterAgenda">
                        <Form.Label className="label">Filtriraj po dnevnom redu</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Unesite dnevni red"
                            onChange={handleFilterAgendaChange}
                            value={filterAgenda}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="filterNotes">
                        <Form.Label className="label">Filtriraj po bilješkama</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Unesite bilješke"
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
                        onChange={(e) => handleSortChange(e.target.value as keyof Meeting)}
                        className="control"
                    >
                        <option value="meetingTimestamp">Datum i vrijeme sastanka</option>
                        <option value="agenda">Dnevnom redu</option>
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
                <h2>Popis sastanaka:</h2>
                {sortedMeetings.length === 0 ? (
                    <p style={{fontStyle: 'italic'}}>Trenutno nema sastanaka za odabrani klub u bazi.</p>
                ) : (
                    <table>
                        <tbody>
                        {sortedMeetings.map(meeting => (
                            <tr key={meeting.meetingId} style={{cursor: 'pointer'}}
                                onClick={() => window.location.href = `/clubs/${clubId}/meetings/${meeting.meetingId}`}>
                                <td>{formatDateTime(meeting.meetingTimestamp)}</td>
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
                <h2>Dodajte novi sastanak:</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="meetingTimestamp">
                        <Form.Label className="label">Datum i vrijeme sastanka</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            onChange={handleMeetingTimestampChange}
                            value={meetingTimestamp}
                        />
                    </Form.Group>
                    <Form.Group controlId="name">
                        <Form.Label className="label">Dnevni red</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Upišite dnevni red sastanka"
                            onChange={handleAgendaChange}
                            value={agenda}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="notes">
                        <Form.Label className="label">Bilješke</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Upišite bilješke sa sastanka"
                            onChange={handleNotesChange}
                            value={notes}
                            className="control"
                        />
                    </Form.Group>
                    {oibs.map((oib, index) => (
                        <Form.Group key={index} controlId={`participant-${index}`}>
                            <Form.Label className="label">Sudionik {index + 1}</Form.Label>
                            <Form.Control
                                as="select"
                                value={oibs[index] ?? ''}
                                id={`person-select-${index}`}
                                onChange={(event) => handleOibChange(index, event)}
                                className="control"
                            >
                                <option value="" disabled>Izaberi osobu</option>
                                {person.map(p => (
                                    <option key={p.personId} value={p.oib}>
                                        {p.name} {p.surname}, {p.oib}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    ))}
                    <button type="button" onClick={addOibField}>Dodaj sudionika</button>
                    <Button variant="success" className="button-space" type="submit">
                        Dodaj sastanak
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

export default MeetingManager;