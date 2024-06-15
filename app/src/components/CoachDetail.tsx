import {SetStateAction, useEffect, useRef, useState} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import {Button, Form} from "react-bootstrap";
import './Detail.css'

interface Coach {
    coachId: number;
    oib: string;
    name: string;
    surname: string;
    dateOfBirth: string;
    sex: string;
    zipCode: number;
    placeName: string;
    yearsOfExperience: number;
    clubName: string;
    specialization: string;
    previousClubs: Set<string>;
}

function CoachDetail() {
    const { coachId } = useParams<{ coachId: string }>();
    const [coach, setCoach] = useState<Coach>();
    const [showChangeButton, setShowChangeButton] = useState(false);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const navigate = useNavigate();
    const [oib, setOib] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [sex, setSex] = useState("");
    const [yearsOfExperience, setYearsOfExperience] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [placeName, setPlaceName] = useState("");
    const [clubName, setClubName] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [from, setFrom] = useState("");
    const [formError, setFormError] = useState("");
    const errorRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        axios.get(`/coaches/${coachId}`)
            .then(response => setCoach(response.data))
            .catch(error => console.error("Error fetching coach: ", error));
    }, [coachId])

    const handleDeleteClick = async () => {
        try {
            const response = await fetch(`/coaches/${coachId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                alert("Trener uspješno obrisan!");
                navigate("/coaches/");
            } else {
                alert("Trener nije obrisan!");
            }
        } catch (err) {
            console.error("Error deleting coach: ", err);
            alert("Pogreška pri brisanju trenera!");
        }
    }

    const handleChangeClick = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        const oibRegex = /^\d{11}$/;
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

        const numberRegex = /^\d+$/;
        if (!numberRegex.test(zipCode)) {
            setFormError("Format poštanskog broja je neispravan!");

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
            formData.append("oib", oib);
            formData.append("name", name);
            formData.append("surname", surname);
            formData.append("dateOfBirth", dateOfBirth);
            formData.append("sex", sex);
            formData.append("specialization", specialization);
            formData.append("yearsOfExperience", yearsOfExperience);
            formData.append("zipCode", zipCode);
            formData.append("placeName", placeName);
            formData.append("clubName", clubName);
            formData.append("from", from);

            const options = {
                method: "PUT",
                body: formData,
            }

            const res = await fetch(`/coaches/${coachId}`, options);
            if (res.status === 200) {
                alert("Podaci o treneru uspješno ažurirani!");
                window.scroll({
                    top: 0,
                    behavior: 'smooth'
                });
                navigate("/coaches");
            } else {
                alert("Podaci nisu ažurirani!" + res.status);
            }
        } catch (err) {
            console.error(err);
            alert("Pogreška pri ažuriranju podataka o treneru!");
        }
    }

    const handleOibChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setOib(e.target.value);
    const handleNameChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setName(e.target.value);
    const handleSurnameChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setSurname(e.target.value);
    const handleYearsOfExperienceChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setYearsOfExperience(e.target.value);
    const handleDateOfBirthChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setDateOfBirth(e.target.value);
    const handleClubNameChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setClubName(e.target.value);
    const handleSpecializationChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setSpecialization(e.target.value);
    const handlePlaceNameChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setPlaceName(e.target.value);
    const handleZipCodeChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setZipCode(e.target.value);
    const handleFromChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setFrom(e.target.value);

    document.title = coach?.name + " " + coach?.surname;
    return (
        <div>
            <div className="container">
                <h1>Podaci o treneru</h1>
                <p><strong>Ime i prezime: </strong>{coach?.name} {coach?.surname}</p>
                <p><strong>Mjesto: </strong>{coach?.zipCode} {coach?.placeName}</p>
                {coach?.clubName && <p><strong>Ime kluba: </strong>{coach.clubName}</p>}
                {coach?.oib && <p><strong>Oib: </strong>{coach.oib}</p>}
                {coach?.dateOfBirth && <p><strong>Datum rođenja (YYYY-MM-DD): </strong>{coach.dateOfBirth}</p>}
                {coach?.sex && coach.sex === "MALE" && <p><strong>Spol: </strong>Muško</p>}
                {coach?.sex && coach.sex === "FEMALE" && <p><strong>Spol: </strong>Žensko</p>}
                {coach?.specialization && <p><strong>Specijalizacija: </strong>{coach.specialization}</p>}
                <p><strong>Godine iskustva: </strong>{coach?.yearsOfExperience}</p>
                {coach?.previousClubs && (
                    <ol><p><strong>Prijašnji klubovi:</strong></p>
                        {[...(coach?.previousClubs ?? new Set())].map((item) => (
                            <li key={item}><p>{item}</p></li>
                        ))}
                    </ol>
                )}
                <p><strong>Ostalo:</strong></p>
                <br/>
                <Button href={`/coaches/${coachId}/training-sessions`} className="links">Treninzi</Button>
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
                    <label>Promijeni podatke o treneru</label>
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
                    <label>Izbriši podatke o treneru</label>
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
                                placeholder={coach?.name}
                                onChange={handleNameChange}
                                value={name}
                                className="control"
                            />
                        </Form.Group>
                        <Form.Group controlId="surname">
                            <Form.Label className="label">Prezime</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={coach?.surname}
                                onChange={handleSurnameChange}
                                value={surname}
                                className="control"
                            />
                        </Form.Group>
                        <Form.Group controlId="oib">
                            <Form.Label className="label">Oib</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={coach?.oib}
                                onChange={handleOibChange}
                                value={oib}
                                className="control"
                            />
                        </Form.Group>
                        <Form.Group controlId="dateOfBirth">
                            <Form.Label className="label">Datum rođenja</Form.Label>
                            <Form.Control
                                type="date"
                                onChange={handleDateOfBirthChange}
                                value={dateOfBirth}
                            />
                        </Form.Group>
                        <Form.Group controlId="sex">
                            <Form.Label className="label">Spol</Form.Label>
                            <div className="form-check form-check-inline" style={{margin: 5}}>
                                <input
                                    type="radio"
                                    id="male"
                                    name="sex"
                                    value="male"
                                    onChange={() => setSex("MALE")}
                                />
                                <label>Muško</label>
                            </div>
                            <div className="form-check form-check-inline" style={{margin: 5}}>
                                <input
                                    type="radio"
                                    id="female"
                                    name="sex"
                                    value="female"
                                    onChange={() => setSex("FEMALE")}
                                />
                                <label>Žensko</label>
                            </div>
                        </Form.Group>
                        <Form.Group controlId="zipCode">
                            <Form.Label className="label">Poštanski broj</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={coach?.zipCode.toString()}
                                onChange={handleZipCodeChange}
                                value={zipCode}
                                className="control"
                            />
                        </Form.Group>
                        <Form.Group controlId="placeName">
                            <Form.Label className="label">Ime mjesta</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={coach?.placeName}
                                onChange={handlePlaceNameChange}
                                value={placeName}
                                className="control"
                            />
                        </Form.Group>
                        <Form.Group controlId="yearsOfExperience">
                            <Form.Label className="label">Godine iskustva</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={coach?.yearsOfExperience.toString()}
                                onChange={handleYearsOfExperienceChange}
                                value={yearsOfExperience}
                                className="control"
                            />
                        </Form.Group>
                        <Form.Group controlId="specialization">
                            <Form.Label className="label">Specijalizacija</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={coach?.specialization}
                                onChange={handleSpecializationChange}
                                value={specialization}
                                className="control"
                            />
                        </Form.Group>
                        <Form.Group controlId="clubName">
                            <Form.Label className="label">Ime kluba</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={coach?.clubName}
                                onChange={handleClubNameChange}
                                value={clubName}
                                className="control"
                            />
                        </Form.Group>
                        <Form.Group controlId="dateFrom">
                            <Form.Label className="label">Datum prelaska u klub</Form.Label>
                            <Form.Control
                                type="date"
                                onChange={handleFromChange}
                                value={from}
                            />
                        </Form.Group>
                        <button type="submit" className="links" onClick={handleChangeClick}>Potvrdi</button>
                    </Form>
                )}
            </div>
            <div className="empty"></div>
        </div>
    )
};

export default CoachDetail;