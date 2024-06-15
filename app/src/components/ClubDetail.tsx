import {SetStateAction, useEffect, useRef, useState} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import {Button, Form} from "react-bootstrap";
import './Detail.css'

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

function ClubDetail() {
    const { clubId } = useParams<{ clubId: string }>();
    const [club, setClub] = useState<Club>();
    const [showChangeButton, setShowChangeButton] = useState(false);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const navigate = useNavigate();
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
        axios.get(`/clubs/${clubId}`)
            .then(response => setClub(response.data))
            .catch(error => console.error("Error fetching club: ", error));
    }, [clubId])

    const handleDeleteClick = async () => {
        try {
            const response = await fetch(`/clubs/${clubId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                alert("Klub uspješno obrisan!");
                navigate("/clubs/");
            } else {
                alert("Klub nije obrisan!");
            }
        } catch (err) {
            console.error("Error deleting club: ", err);
            alert("Pogreška pri brisanju kluba!");
        }
    }

    const handleChangeClick = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

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
                method: "PUT",
                body: formData,
            }

            const res = await fetch(`/clubs/${clubId}`, options);
            if (res.status === 200) {
                alert("Podaci o klubu uspješno ažurirani!");
                window.scroll({
                    top: 0,
                    behavior: 'smooth'
                });
                navigate("/clubs/");
            } else {
                alert("Podaci nisu ažurirani!" + res.status);
            }
        } catch (err) {
            console.error(err);
            alert("Pogreška pri ažuriranju podataka o klubu!");
        }
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

    document.title = club ? club.name : "Detalji o klubu";
    return (
        <div>
            <div className="container">
                <h1>Podaci o klubu</h1>
                <p><strong>Ime: </strong>{club?.name}</p>
                <p><strong>Ime kluba: </strong>{club?.zipCode} {club?.placeName}</p>
                {club?.foundationYear && <p><strong>Godina osnutka: </strong>{club.foundationYear}.</p>}
                {club?.email && <p><strong>Email: </strong>{club.email}</p>}
                {club?.phoneNumber && <p><strong>Broj telefona: </strong>{club.phoneNumber}</p>}
                {club?.webAddress && <p><strong>Web adresa: </strong>{club.webAddress}</p>}
                {club?.budget && <p><strong>Budžet: </strong>{club.budget} €</p>}
                <p><strong>Ostalo:</strong></p>
                <br/>
                <Button href={`/clubs/${clubId}/transactions`} className="links">Transakcije</Button>
                <Button href={`/clubs/${clubId}/meetings`} className="links">Sastanci</Button>
                <Button href={`/clubs/${clubId}/equipment`} className="links">Oprema</Button>
                <Button href={`/clubs/${clubId}/courts`} className="links">Tereni</Button>
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
                    <label>Promijeni podatke o klubu</label>
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
                    <label>Izbriši podatke o klubu</label>
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
                            <Form.Label className="label">Ime kluba</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={club?.name}
                                onChange={handleNameChange}
                                value={name}
                                className="control"
                            />
                        </Form.Group>
                        <Form.Group controlId="foundationYear">
                            <Form.Label className="label">Godina osnutka</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={club?.foundationYear.toString()}
                                onChange={handleFoundationYearChange}
                                value={foundationYear}
                                className="control"
                            />
                        </Form.Group>
                        <Form.Group controlId="email">
                            <Form.Label className="label">Email</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={club?.email}
                                onChange={handleEmailChange}
                                value={email}
                                className="control"
                            />
                        </Form.Group>
                        <Form.Group controlId="phoneNumber">
                            <Form.Label className="label">Broj telefona</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={club?.phoneNumber}
                                onChange={handlePhoneNumberChange}
                                value={phoneNumber}
                                className="control"
                            />
                        </Form.Group>
                        <Form.Group controlId="webAddress">
                            <Form.Label className="label">Web adresa</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={club?.webAddress}
                                onChange={handleWebAddressChange}
                                value={webAddress}
                                className="control"
                            />
                        </Form.Group>
                        <Form.Group controlId="budget">
                            <Form.Label className="label">Budžet</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={club?.budget.toString()}
                                onChange={handleBudgetChange}
                                value={budget}
                                className="control"
                            />
                        </Form.Group>
                        <Form.Group controlId="zipCode">
                            <Form.Label className="label">Poštanski broj</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={club?.zipCode.toString()}
                                onChange={handleZipCodeChange}
                                value={zipCode}
                                className="control"
                            />
                        </Form.Group>
                        <Form.Group controlId="placeName">
                            <Form.Label className="label">Ime mjesta</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={club?.placeName}
                                onChange={handlePlaceNameChange}
                                value={placeName}
                                className="control"
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

export default ClubDetail;