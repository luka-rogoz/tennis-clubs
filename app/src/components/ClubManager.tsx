import {SetStateAction, useEffect, useRef, useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import './ClubManager.css'
import {Button, Form} from "react-bootstrap";

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

function ClubManager() {
    const [clubs, setClubs] = useState<Club[]>([]);
    const [name, setName] = useState("");
    const [foundationYear, setFoundationYear] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [webAddress, setWebAddress] = useState("");
    const [budget, setBudget] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [placeName, setPlaceName] = useState("");
    const [formError, setFormError] = useState("");
    const errorRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        axios.get('/clubs')
            .then(response => setClubs(response.data))
            .catch(error => console.error("Error fetching clubs: ", error));
    }, [clubs])

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        const requiredFields =[
            name,
            email,
            phoneNumber,
            zipCode,
            placeName
        ];

        if (requiredFields.some((field) => field === null || field === "")) {
            setFormError("Potrebno je unijeti ime kluba, email, broj telefona, poštanski broj i ime mjesta!");

            if (errorRef.current) {
                errorRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }

            return;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            setFormError("Format email-a je neispravan!");

            if (errorRef.current) {
                errorRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }

            return;
        }

        const numberRegex = /^\d+$/;
        if (!numberRegex.test(phoneNumber)) {
            setFormError("Format broja telefona je neispravan! Upišite samo brojeve.");

            if (errorRef.current) {
                errorRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }

            return;
        }
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

        const budgetRegex = /^\d+([.,])?\d*$/;
        if (!budgetRegex.test(phoneNumber)) {
            setFormError("Format budžeta je neispravan!");

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
            formData.append("name", name);
            formData.append("foundationYear", foundationYear);
            formData.append("email", email);
            formData.append("phoneNumber", phoneNumber);
            formData.append("webAddress", webAddress);
            formData.append("budget", budget);
            formData.append("zipCode", zipCode);
            formData.append("placeName", placeName);

            const options = {
                method: "POST",
                body: formData,
            }

            const res = await fetch("/clubs", options);
            if (res.status === 200) {
                alert("Klub uspješno dodan!");
                resetFormFields();
                window.scroll({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                alert("Klub nije uspješno dodan!" + res.status);
            }
        } catch (err) {
            console.error(err);
            alert("Pogreška pri dodavanju kluba!");
        }
    };

    const resetFormFields = () => {
        setName("");
        setBudget("");
        setPlaceName("");
        setZipCode("");
        setWebAddress("");
        setPhoneNumber("");
        setEmail("");
        setFoundationYear("");
    }

    const handleNameChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setName(e.target.value);
    const handleFoundationYearChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setFoundationYear(e.target.value);
    const handleEmailChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setEmail(e.target.value);
    const handlePhoneNumberChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setPhoneNumber(e.target.value);
    const handleWebAddressChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setWebAddress(e.target.value);
    const handleBudgetChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setBudget(e.target.value);
    const handleZipCodeChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setZipCode(e.target.value);
    const handlePlaceNameChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setPlaceName(e.target.value);

    document.title = "Klubovi";
    return (
        <div>
            <div className="container">
                <h1>Teniski klubovi</h1>
                <p>Ovdje možete pregledavati sve klubove koji se nalaze u bazi, unijeti nove klubove te
                ažurirati podatke za postojeće.</p>
                <h2>Popis klubova:</h2>
                {clubs.length === 0 ? (
                    <p style={{fontStyle: 'italic'}}>Trenutno nema klubova u bazi.</p>
                ) : (
                    <table>
                        <tbody>
                        {clubs.map(club => (
                            <tr key={club.clubId}>
                                <Link to={`/clubs/${club.clubId}`}>
                                    <td>{club.name}</td>
                                    <td>{club.placeName}</td>
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
                <h2>Dodajte novi klub:</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="name">
                        <Form.Label className="label">Ime kluba</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Upišite jedinstveno ime kluba"
                            onChange={handleNameChange}
                            value={name}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="foundationYear">
                    <Form.Label className="label">Godina osnutka</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Upišite godinu osnutka kluba"
                        onChange={handleFoundationYearChange}
                        value={foundationYear}
                        className="control"
                    />
                    </Form.Group>
                    <Form.Group controlId="email">
                        <Form.Label className="label">Email</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Upišite email adresu kluba"
                            onChange={handleEmailChange}
                            value={email}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="phoneNumber">
                        <Form.Label className="label">Broj telefona</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Upišite službeni broj telefona kluba"
                            onChange={handlePhoneNumberChange}
                            value={phoneNumber}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="webAddress">
                        <Form.Label className="label">Web adresa</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Upišite službenu web adresu kluba"
                            onChange={handleWebAddressChange}
                            value={webAddress}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="budget">
                        <Form.Label className="label">Budžet</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Upišite budžet kluba u eurima"
                            onChange={handleBudgetChange}
                            value={budget}
                            className="control"
                        />
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
                    <Button variant="success" type="submit">
                        Dodaj klub
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

export default ClubManager;