import {SetStateAction, useEffect, useRef, useState} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import './Manager.css'
import {Form} from "react-bootstrap";

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

function MeetingDetail() {
    const { clubId, meetingId } = useParams<{ clubId: string, meetingId: string }>();
    const [meeting, setMeeting] = useState<Meeting>();
    const [person, setPerson] = useState<Person[]>([]);
    const [showChangeButton, setShowChangeButton] = useState(false);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const navigate = useNavigate();
    const [meetingTimestamp, setMeetingTimestamp] = useState("");
    const [agenda, setAgenda] = useState("");
    const [notes, setNotes] = useState("");
    const [oibs, setOibs] = useState(['']);
    const [formError, setFormError] = useState("");
    const errorRef = useRef<HTMLDivElement | null>(null);

    const addOibField = () => {
        setOibs([...oibs, '']);
    };

    useEffect(() => {
        axios.get(`/clubs/${clubId}/meetings/${meetingId}`)
            .then(response => setMeeting(response.data))
            .catch(error => console.error("Error fetching meeting: ", error));
        axios.get(`/clubs/person`)
            .then(response => setPerson(response.data))
            .catch(error => console.error("Error fetching person: ", error));
    }, [meetingId, clubId, person])

    const handleDeleteClick = async () => {
        try {
            const response = await fetch(`/clubs/${clubId}/meetings/${meetingId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                alert("Sastanak uspješno obrisan!");
                navigate(`/clubs/${clubId}/meetings`);
            } else {
                alert("Sastanak nije obrisan!");
            }
        } catch (err) {
            console.error("Error deleting meeting: ", err);
            alert("Pogreška pri brisanju sastanka!");
        }
    }

    const handleChangeClick = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setFormError("");

        const requiredFields =[
            meetingTimestamp,
            agenda,
            oibs,
        ];

        if (requiredFields.some((field) => field === null || field === "")) {
            setFormError("Potrebno je ispuniti datum i vrijeme sastanka, dnevni red, sudionike i klub!");

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
            formData.append("meetingTimestamp", meetingTimestamp);
            formData.append("agenda", agenda);
            formData.append("notes", notes);
            if (clubId != undefined) formData.append("clubId", clubId);
            oibs.forEach((oib, index) => {
                formData.append(`oibs`, oib);
            });

            const options = {
                method: "PUT",
                body: formData,
            }

            const res = await fetch(`/clubs/${clubId}/meetings/${meetingId}`, options);
            if (res.status === 200) {
                alert("Podaci o sastanku uspješno ažurirani!");
                window.scroll({
                    top: 0,
                    behavior: 'smooth'
                });
                navigate(`/clubs/${clubId}/transactions`);
            } else {
                alert("Podaci nisu ažurirani!" + res.status);
            }
        } catch (err) {
            console.error(err);
            alert("Pogreška pri ažuriranju podataka o sastanku!");
        }
    };

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

    document.title = "Sastanak";
    return (
        <div>
            <div className="container">
                <h1>Podaci o sastanku</h1>
                <p><strong>Datum i vrijeme sastanka: </strong>{formatDateTime(meeting?.meetingTimestamp)}</p>
                <p><strong>Ime kluba: </strong>{meeting?.clubName}</p>
                {meeting?.attendees.size && (
                    <ol><p><strong>Prisutni:</strong></p>
                        {[...(meeting?.attendees ?? new Set())].map((attendee) => (
                            <li key={attendee}><p>{attendee}</p></li>
                        ))}
                    </ol>
                )}
                <p><strong>Dnevni red: </strong>{meeting?.agenda}</p>
                {meeting?.notes && <p><strong>Bilješke: </strong>{meeting.notes}</p>}
                {formError && (
                    <div ref={errorRef} style={{color: 'red'}}>
                        {formError}
                    </div>
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
                    <label>Promijeni podatke o sastanku</label>
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
                    <label>Izbriši podatke o sastanku</label>
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
                                placeholder={meeting?.agenda}
                                onChange={handleAgendaChange}
                                value={agenda}
                                className="control"
                            />
                        </Form.Group>
                        <Form.Group controlId="notes">
                            <Form.Label className="label">Bilješke</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={meeting?.notes}
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
                        <button type="submit" className="links button-space" onClick={handleChangeClick}>Potvrdi</button>
                    </Form>
                )}
            </div>
            <div className="empty"></div>
        </div>
    )
}

export default MeetingDetail;