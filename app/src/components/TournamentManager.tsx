import {SetStateAction, useEffect, useRef, useState} from "react";
import axios from "axios";
import './Manager.css'
import {Button, Form} from "react-bootstrap";

interface Tournament {
    tournamentId: number;
    name: string;
    clubName: string;
    type: string;
    ageLimit: string;
    sexLimit: string;
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

function TournamentManager() {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [clubs, setClubs] = useState<Club[]>([]);
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [ageLimit, setAgeLimit] = useState("");
    const [sexLimit, setSexLimit] = useState("");
    const [clubName, setClubName] = useState("");
    const [formError, setFormError] = useState("");
    const errorRef = useRef<HTMLDivElement | null>(null);

    const [filterName, setFilterName] = useState("");
    const [filterClubName, setFilterClubName] = useState("");
    const [filterAgeLimit, setFilterAgeLimit] = useState("");
    const [filterSexLimit, setFilterSexLimit] = useState<string[]>([]);
    const [filterCategory, setFilterSurface] = useState<string[]>([]);

    const [sortCriteria, setSortCriteria] = useState<keyof Tournament>("name");
    const [sortOrder, setSortOrder] = useState<string>("asc");

    useEffect(() => {
        axios.get('/tournaments')
            .then(response => setTournaments(response.data))
            .catch(error => console.error("Error fetching tournaments: ", error));
        axios.get('/clubs')
            .then(response => setClubs(response.data))
            .catch(error => console.error("Error fetching clubs: ", error));
    }, [tournaments, clubs])

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setFormError("");

        const requiredFields =[
            name,
            type,
            clubName
        ];

        if (requiredFields.some((field) => field === null || field === "")) {
            setFormError("Potrebno je unijeti ime i tip turnira te ime kluba organizatora!");

            if (errorRef.current) {
                errorRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }

            return;
        }

        const ageRegex = /^\d*$/;
        if (!ageRegex.test(ageLimit)) {
            setFormError("Format dobnog ograničenja je neispravan!");

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
            formData.append("type", type);
            formData.append("ageLimit", ageLimit);
            formData.append("sexLimit", sexLimit);
            formData.append("clubName", clubName);

            const options = {
                method: "POST",
                body: formData,
            }

            const res = await fetch("/tournaments", options);
            if (res.status === 200) {
                alert("Turnir uspješno dodan!");
                resetFormFields();
                window.scroll({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                alert("Turnir nije uspješno dodan!" + res.status);
            }
        } catch (err) {
            console.error(err);
            alert("Pogreška pri dodavanju turnira!");
        }
    };

    const resetFormFields = () => {
        setName("");
        setType("");
        setAgeLimit("");
        setSexLimit("");
        setClubName("");
    }

    const handleNameChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setName(e.target.value);
    const handleAgeLimitChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setAgeLimit(e.target.value);
    const handleClubNameChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setClubName(e.target.value);

    const handleFilterNameChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setFilterName(e.target.value);
    const handleFilterClubNameChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setFilterClubName(e.target.value);
    const handleFilterAgeLimitChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setFilterAgeLimit(e.target.value);
    const handleFilterSexLimitChange = (value: string) => {
        setFilterSexLimit(prev =>
            prev.includes(value)
                ? prev.filter(sex => sex !== value)
                : [...prev, value]
        );
    };
    const handleFilterCategoryChange = (value: string) => {
        setFilterSexLimit(prev =>
            prev.includes(value)
                ? prev.filter(category => category !== value)
                : [...prev, value]
        );
    };

    const handleSortChange = (criteria: keyof Tournament) => {
        setSortCriteria(criteria);
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    const sortTournaments = (tournaments: Tournament[], criteria: keyof Tournament, order: string) => {
        return tournaments.sort((a, b) => {
            if (a[criteria] < b[criteria]) {
                return order === "asc" ? -1 : 1;
            }
            if (a[criteria] > b[criteria]) {
                return order === "asc" ? 1 : -1;
            }
            return 0;
        });
    };

    const filteredTournaments = tournaments.filter(tournament => {
        return (
            (filterName === "" || tournament.name.toLowerCase().includes(filterName.toLowerCase())) &&
            (filterClubName === "" || tournament.clubName.toLowerCase().includes(filterClubName.toLowerCase())) &&
            (filterAgeLimit === "" || tournament.ageLimit.toLowerCase().includes(filterAgeLimit.toLowerCase())) &&
            (filterSexLimit.length === 0 || filterSexLimit.includes(tournament.sexLimit)) &&
            (filterCategory.length === 0 || filterCategory.includes(tournament.type))
        );
    });

    const sortedTournaments = sortTournaments(filteredTournaments, sortCriteria, sortOrder);

    document.title = "Turniri";
    return (
        <div>
            <div className="container">
                <h1>Turniri</h1>
                <p>Ovdje možete pregledavati sve turnire koji se nalaze u bazi, unijeti nove turnire te
                    ažurirati podatke za postojeće.</p>
                <hr/>
                <h2>Filtriraj turnire:</h2>
                <Form>
                    <Form.Group controlId="filterName">
                        <Form.Label className="label">Filtriraj po imenu turnira</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Unesite ime turnira"
                            onChange={handleFilterNameChange}
                            value={filterName}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="filterClubName">
                        <Form.Label className="label">Filtriraj po imenu kluba organizatora</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Unesite ime kluba organizatora"
                            onChange={handleFilterClubNameChange}
                            value={filterClubName}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="filterAgeLimit">
                        <Form.Label className="label">Filtriraj po dobnom ograničenju</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Unesite dobno ograničenje"
                            onChange={handleFilterAgeLimitChange}
                            value={filterAgeLimit}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="filterSexLimit">
                        <Form.Label className="label">Filtriraj po spolnom ograničenju</Form.Label>
                        <div className="form-check form-check-inline" style={{margin: 5}}>
                            <input
                                type="checkbox"
                                id="maleFilter"
                                name="filterSexLimit"
                                value="MALE"
                                checked={filterSexLimit.includes("MALE")}
                                onChange={() => handleFilterSexLimitChange("MALE")}
                            />
                            <label>Muškarci</label>
                        </div>
                        <div className="form-check form-check-inline" style={{margin: 5}}>
                            <input
                                type="checkbox"
                                id="femaleFilter"
                                name="filterSexLimit"
                                value="FEMALE"
                                checked={filterSexLimit.includes("FEMALE")}
                                onChange={() => handleFilterSexLimitChange("FEMALE")}
                            />
                            <label>Žene</label>
                        </div>
                    </Form.Group>
                    <Form.Group controlId="filterCategory">
                        <Form.Label className="label">Filtriraj po kategoriji</Form.Label>
                        <div className="form-check form-check-inline" style={{margin: 5}}>
                            <input
                                type="checkbox"
                                id="singlesFilter"
                                name="filterCategory"
                                value="SINGLES"
                                checked={filterCategory.includes("SINGLES")}
                                onChange={() => handleFilterCategoryChange("SINGLES")}
                            />
                            <label>Singl</label>
                        </div>
                        <div className="form-check form-check-inline" style={{margin: 5}}>
                            <input
                                type="checkbox"
                                id="doublesFilter"
                                name="filterCategory"
                                value="DOUBLES"
                                checked={filterCategory.includes("DOUBLES")}
                                onChange={() => handleFilterCategoryChange("DOUBLES")}
                            />
                            <label>Parovi</label>
                        </div>
                    </Form.Group>
                </Form>
                <Form.Group controlId="sortCriteria">
                    <Form.Label className="label">Sortiraj po:</Form.Label>
                    <Form.Control
                        as="select"
                        value={sortCriteria}
                        onChange={(e) => handleSortChange(e.target.value as keyof Tournament)}
                        className="control"
                    >
                        <option value="name">Imenu turnira</option>
                        <option value="clubName">Imenu kluba</option>
                        <option value="type">Kategoriji</option>
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
                <h2>Popis turnira:</h2>
                {sortedTournaments.length === 0 ? (
                    <p style={{fontStyle: 'italic'}}>Trenutno nema turnira u bazi.</p>
                ) : (
                    <table>
                        <tbody>
                        {sortedTournaments.map(tournament => (
                            <tr key={tournament.tournamentId} style={{cursor: 'pointer'}}
                                onClick={() => window.location.href = `/tournaments/${tournament.tournamentId}`}>
                                <td>{tournament.name}</td>
                                <td>{tournament.clubName}</td>
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
                <h2>Dodajte novi turnir:</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="name">
                        <Form.Label className="label">Ime</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Upišite jedinstveno ime turnira"
                            onChange={handleNameChange}
                            value={name}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="clubName">
                        <Form.Label className="label">Ime kluba</Form.Label>
                        <Form.Control
                            as="select"
                            value={clubName ?? ''}
                            onChange={handleClubNameChange}
                            className="control"
                        >
                            <option value="" disabled>Izaberi klub</option>
                            {clubs.map(club => (
                                <option key={club.clubId} value={club.name}>
                                    {club.name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="type">
                        <Form.Label className="label">Tip</Form.Label>
                        <div className="form-check form-check-inline" style={{margin: 5}}>
                            <input
                                type="radio"
                                id="singles"
                                name="type"
                                value="singles"
                                onChange={() => setType("SINGLES")}
                            />
                            <label>Singl</label>
                        </div>
                        <div className="form-check form-check-inline" style={{margin: 5}}>
                            <input
                                type="radio"
                                id="doubles"
                                name="type"
                                value="doubles"
                                onChange={() => setType("DOUBLES")}
                            />
                            <label>Parovi</label>
                        </div>
                    </Form.Group>
                    <Form.Group controlId="ageLimit">
                        <Form.Label className="label">Dobno ograničenje</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Upišite dobno ograničenje, ako postoji"
                            onChange={handleAgeLimitChange}
                            value={ageLimit}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="sexLimit">
                        <Form.Label className="label">Spolno ograničenje</Form.Label>
                        <div className="form-check form-check-inline" style={{margin: 5}}>
                            <input
                                type="radio"
                                id="male"
                                name="sexLimit"
                                value="male"
                                onChange={() => setSexLimit("MALE")}
                            />
                            <label>Muškarci</label>
                        </div>
                        <div className="form-check form-check-inline" style={{margin: 5}}>
                            <input
                                type="radio"
                                id="female"
                                name="sexLimit"
                                value="female"
                                onChange={() => setSexLimit("FEMALE")}
                            />
                            <label>Žene</label>
                        </div>
                    </Form.Group>
                    <Button variant="success" type="submit">
                        Dodaj turnir
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

export default TournamentManager;