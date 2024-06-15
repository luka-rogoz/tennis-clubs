import {SetStateAction, useEffect, useRef, useState} from "react";
import axios from "axios";
import {Link, useParams} from "react-router-dom";
import './ClubManager.css'
import {Button, Form} from "react-bootstrap";

interface Meeting {
    meetingId: number;
    meetingTimestamp: string;
    clubName: string;
    agenda: string;
    notes: string;
    attendees: Set<string>;
}

function TransactionManager() {
    const { clubId } = useParams<{ clubId: string }>();
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [meetingTimestamp, setMeetingTimestamp] = useState("");
    const [clubName, setClubName] = useState("");
    const [agenda, setAgenda] = useState("");
    const [notes, setNotes] = useState("");
    const [oibs, setOibs] = useState(['']);
    const [formError, setFormError] = useState("");
    const errorRef = useRef<HTMLDivElement | null>(null);

    const addOibField = () => {
        setOibs([...oibs, '']);
    };

    useEffect(() => {
        axios.get(`/clubs/${clubId}/meetings`)
            .then(response => setMeetings(response.data))
            .catch(error => console.error("Error fetching meetings: ", error));
    }, [meetings, clubId])

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        const requiredFields =[
            meetingTimestamp,
            clubName,
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
            formData.append("clubName", clubName);
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
        setClubName("");
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
    const handleOibChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const newOibs = oibs.slice();
        newOibs[index] = event.target.value;
        setOibs(newOibs);
    };
    const handleClubNameChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setClubName(e.target.value);

    document.title = "Sastanci";
    return (
        <div>
            <div className="container">
                <h1>Klupski sastanci</h1>
                <p>Ovdje možete pregledavati sve sastanke za odabrani klub koji se nalaze u bazi, unijeti nove sastanke te
                ažurirati podatke za postojeće.</p>
                <h2>Popis sastanaka:</h2>
                {meetings.length === 0 ? (
                    <p style={{fontStyle: 'italic'}}>Trenutno nema sastanaka za odabrani klub u bazi.</p>
                ) : (
                    <table>
                        <tbody>
                        {meetings.map(meeting => (
                            <tr key={meeting.meetingId}>
                                <Link to={`/clubs/${clubId}/meetings/${meeting.meetingId}`}>
                                    <td>{meeting.meetingTimestamp}</td>
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
                    <Form.Group controlId="clubName">
                        <Form.Label className="label">Ime kluba</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Upišite ime kluba u kojem se održava sastanak"
                            onChange={handleClubNameChange}
                            value={clubName}
                            className="control"
                        />
                    </Form.Group>
                    {oibs.map((oib, index) => (
                        <div key={index}>
                            <label>
                                OIB sudionika {index + 1}:
                                <input
                                    type="text"
                                    value={oib}
                                    onChange={(event) => handleOibChange(index, event)}
                                />
                            </label>
                        </div>
                    ))}
                    <button type="button" onClick={addOibField}>Dodaj sudionika</button>
                    <Button variant="success" type="submit">
                        Dodaj sastanak
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

export default TransactionManager;