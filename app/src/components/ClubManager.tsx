import {SetStateAction, useEffect, useRef, useState} from "react";
import axios from "axios";
import './Manager.css'
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

    const [filterName, setFilterName] = useState("");
    const [filterFoundationYear, setFilterFoundationYear] = useState("");
    const [filterBudget, setFilterBudget] = useState("");
    const [filterPlaceName, setFilterPlaceName] = useState("");

    const [sortCriteria, setSortCriteria] = useState<keyof Club>("name");
    const [sortOrder, setSortOrder] = useState<string>("asc");

    useEffect(() => {
        axios.get('/clubs')
            .then(response => setClubs(response.data))
            .catch(error => console.error("Error fetching clubs: ", error));
    }, [clubs])

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setFormError("");

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

        const numberRegex = /^\d*$/;
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

        const budgetRegex = /^\d*([.,])?\d*$/;
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

    const handleFilterNameChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setFilterName(e.target.value);
    const handleFilterFoundationYearChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setFilterFoundationYear(e.target.value);
    const handleFilterBudgetChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setFilterBudget(e.target.value);
    const handleFilterPlaceNameChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setFilterPlaceName(e.target.value);

    const handleSortChange = (criteria: keyof Club) => {
        setSortCriteria(criteria);
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    const sortClubs = (clubs: Club[], criteria: keyof Club, order: string) => {
        return clubs.sort((a, b) => {
            if (a[criteria] < b[criteria]) {
                return order === "asc" ? -1 : 1;
            }
            if (a[criteria] > b[criteria]) {
                return order === "asc" ? 1 : -1;
            }
            return 0;
        });
    };

    const filteredClubs = clubs.filter(club => {
        return (
            (filterName === "" || club.name.toLowerCase().includes(filterName.toLowerCase())) &&
            (filterFoundationYear === "" || club.foundationYear.toString().includes(filterFoundationYear)) &&
            (filterBudget === "" || club.budget.toString().includes(filterBudget)) &&
            (filterPlaceName === "" || club.placeName.toLowerCase().includes(filterPlaceName.toLowerCase()))
        );
    });

    const sortedClubs = sortClubs(filteredClubs, sortCriteria, sortOrder);

    document.title = "Klubovi";
    return (
        <div>
            <div className="container">
                <h1>Teniski klubovi</h1>
                <p>Ovdje možete pregledavati sve klubove koji se nalaze u bazi, unijeti nove klubove te
                    ažurirati podatke za postojeće.</p>
                <hr/>
                <h2>Filtriraj klubove:</h2>
                <Form>
                    <Form.Group controlId="filterName">
                        <Form.Label className="label">Filtriraj po imenu</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Unesite ime kluba"
                            onChange={handleFilterNameChange}
                            value={filterName}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="filterFoundationYear">
                        <Form.Label className="label">Filtriraj po godini osnutka</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Unesite godinu osnutka"
                            onChange={handleFilterFoundationYearChange}
                            value={filterFoundationYear}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="filterBudget">
                        <Form.Label className="label">Filtriraj po budžetu</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Unesite budžet u eurima"
                            onChange={handleFilterBudgetChange}
                            value={filterBudget}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="filterPlaceName">
                        <Form.Label className="label">Filtriraj po imenu mjesta</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Unesite ime mjesta"
                            onChange={handleFilterPlaceNameChange}
                            value={filterPlaceName}
                            className="control"
                        />
                    </Form.Group>
                </Form>
                <Form.Group controlId="sortCriteria">
                    <Form.Label className="label">Sortiraj po:</Form.Label>
                    <Form.Control
                        as="select"
                        value={sortCriteria}
                        onChange={(e) => handleSortChange(e.target.value as keyof Club)}
                        className="control"
                    >
                        <option value="name">Imenu</option>
                        <option value="foundationYear">Godini osnutka</option>
                        <option value="budget">Budžetu</option>
                        <option value="placeName">Imenu mjesta</option>
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
                <h2>Popis klubova:</h2>
                {sortedClubs.length === 0 ? (
                    <p style={{fontStyle: 'italic'}}>Trenutno nema klubova u bazi.</p>
                ) : (
                    <table>
                        <tbody>
                        {sortedClubs.map(club => (
                            <tr key={club.clubId} style={{cursor: 'pointer'}}
                                onClick={() => window.location.href = `/clubs/${club.clubId}`}>
                                <td>{club.name}</td>
                                <td>{club.placeName}</td>
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
                    <Button variant="secondary" className="button-space" onClick={resetFormFields}>
                        Odustani
                    </Button>
                </Form>
            </div>
            <div className="empty"></div>
        </div>
    )
}

export default ClubManager;