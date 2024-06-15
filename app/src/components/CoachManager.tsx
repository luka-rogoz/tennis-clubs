import {SetStateAction, useEffect, useRef, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import './ClubManager.css'
import {Button, Form} from "react-bootstrap";

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
    from: string;
}

interface Club {
    clubId: number;
    name: string;
    foundationYear: number;
    email: string;
    phoneNumber: string;
    webAddress: string;
    budget: number;
    zipCode: number;
    placeName: string;
}

function CoachManager() {
    const [coaches, setCoaches] = useState<Coach[]>([]);
    const [clubs, setClubs] = useState<Club[]>([]);
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
        axios.get('/coaches')
            .then(response => setCoaches(response.data))
            .catch(error => console.error("Error fetching coaches: ", error));
        axios.get('/clubs')
            .then(response => setClubs(response.data))
            .catch(error => console.error("Error fetching clubs: ", error));
    }, [coaches, clubs])

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        const requiredFields =[
            oib,
            name,
            surname,
            zipCode,
            placeName,
            clubName,
            from
        ];

        if (requiredFields.some((field) => field === null || field === "")) {
            setFormError("Potrebno je unijeti oib, ime i prezime trenera, poštanski broj i ime mjesta te ime i datum prelaska u  trenutni klub!");

            if (errorRef.current) {
                errorRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }

            return;
        }

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
                method: "POST",
                body: formData,
            }

            const res = await fetch("/coaches", options);
            if (res.status === 200) {
                alert("Trener uspješno dodan!");
                resetFormFields();
                window.scroll({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                alert("Trener nije uspješno dodan!" + res.status);
            }
        } catch (err) {
            console.error(err);
            alert("Pogreška pri dodavanju trenera!");
        }
    };

    const resetFormFields = () => {
        setOib("");
        setName("");
        setSurname("");
        setDateOfBirth("");
        setSex("");
        setSpecialization("");
        setPlaceName("");
        setZipCode("");
        setYearsOfExperience("");
        setClubName("");
        setFrom("");
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

    document.title = "Treneri";
    return (
        <div>
            <div className="container">
                <h1>Treneri</h1>
                <p>Ovdje možete pregledavati sve trenere koji se nalaze u bazi, unijeti nove trenere te
                    ažurirati podatke za postojeće.</p>
                <h2>Popis trenera:</h2>
                {coaches.length === 0 ? (
                    <p style={{fontStyle: 'italic'}}>Trenutno nema trenera u bazi.</p>
                ) : (
                    <table>
                        <tbody>
                        {coaches.map(coach => (
                            <tr key={coach.coachId}>
                                <Link to={`/coaches/${coach.coachId}`}>
                                    <td>{coach.name} {coach.surname}</td>
                                    <td>{coach.clubName}</td>
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
                <h2>Dodajte novog trenera:</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="name">
                        <Form.Label className="label">Ime</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Upišite ime trenera"
                            onChange={handleNameChange}
                            value={name}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="surname">
                        <Form.Label className="label">Prezime</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Upišite prezime trenera"
                            onChange={handleSurnameChange}
                            value={surname}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="oib">
                        <Form.Label className="label">Oib</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Upišite oib trenera"
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
                            placeholder="Upišite poštanski broj mjesta iz kojeg je klub"
                            onChange={handleZipCodeChange}
                            value={zipCode}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="placeName">
                        <Form.Label className="label">Ime mjesta</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Upišite ime mjesta iz kojeg je klub"
                            onChange={handlePlaceNameChange}
                            value={placeName}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="yearsOfExperience">
                        <Form.Label className="label">Godine iskustva</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Upišite koliko trener ima godina iskustva"
                            onChange={handleYearsOfExperienceChange}
                            value={yearsOfExperience}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="specialization">
                        <Form.Label className="label">Specijalizacija</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Upišite trenerovu specijalizaciju"
                            onChange={handleSpecializationChange}
                            value={specialization}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="clubName">
                        <Form.Label className="label">Ime kluba</Form.Label>
                        <select id="club-select" value={clubName ?? ''} onChange={handleClubNameChange}>
                            <option value="" disabled>Izaberi klub</option>
                            {clubs.map(club => (
                                <option key={club.clubId} value={club.name}>
                                    {club.name}
                                </option>
                            ))}
                        </select>
                    </Form.Group>
                    <Form.Group controlId="dateFrom">
                        <Form.Label className="label">Datum prelaska u klub</Form.Label>
                        <Form.Control
                            type="date"
                            onChange={handleFromChange}
                            value={from}
                        />
                    </Form.Group>
                    <Button variant="success" type="submit">
                        Dodaj trenera
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

export default CoachManager;