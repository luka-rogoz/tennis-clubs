import {SetStateAction, useEffect, useRef, useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";
import './Manager.css'
import {Button, Form} from "react-bootstrap";

interface Court {
    courtId: number;
    clubName: string;
    surface: string;
    name: string;
}

function CourtManager() {
    const { clubId } = useParams<{ clubId: string }>();
    const [courts, setCourts] = useState<Court[]>([]);
    const [surface, setSurface] = useState("");
    const [name, setName] = useState("");
    const [formError, setFormError] = useState("");
    const errorRef = useRef<HTMLDivElement | null>(null);

    const [filterName, setFilterName] = useState("");
    const [filterSurface, setFilterSurface] = useState<string[]>([]);

    const [sortCriteria, setSortCriteria] = useState<keyof Court>("name");
    const [sortOrder, setSortOrder] = useState<string>("asc");

    useEffect(() => {
        axios.get(`/clubs/${clubId}/courts`)
            .then(response => setCourts(response.data))
            .catch(error => console.error("Error fetching courts: ", error));
    }, [courts, clubId])

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setFormError("");

        const requiredFields =[
            surface,
            name
        ];

        if (requiredFields.some((field) => field === null || field === "")) {
            setFormError("Potrebno je ispuniti sva polja!");

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
            if (clubId != undefined) formData.append("clubId", clubId);
            formData.append("surface", surface);
            formData.append("name", name);

            const options = {
                method: "POST",
                body: formData,
            }

            const res = await fetch(`/clubs/${clubId}/courts`, options);
            if (res.status === 200) {
                alert("Teren uspješno dodan!");
                resetFormFields();
                window.scroll({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                alert("Teren nije uspješno dodan!" + res.status);
            }
        } catch (err) {
            console.error(err);
            alert("Pogreška pri dodavanju terena!");
        }
    };

    const resetFormFields = () => {
        setName("");
        setSurface("");
    }

    const handleNameChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setName(e.target.value);

    const handleFilterNameChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setFilterName(e.target.value);
    const handleFilterSurfaceChange = (value: string) => {
        setFilterSurface(prev =>
            prev.includes(value)
                ? prev.filter(surface => surface !== value)
                : [...prev, value]
        );
    };

    const handleSortChange = (criteria: keyof Court) => {
        setSortCriteria(criteria);
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    const sortCourts = (courts: Court[], criteria: keyof Court, order: string) => {
        return courts.sort((a, b) => {
            if (a[criteria] < b[criteria]) {
                return order === "asc" ? -1 : 1;
            }
            if (a[criteria] > b[criteria]) {
                return order === "asc" ? 1 : -1;
            }
            return 0;
        });
    };

    const filteredCourts = courts.filter(court => {
        return (
            (filterName === "" || court.name.toLowerCase().includes(filterName.toLowerCase())) &&
            (filterSurface.length === 0 || filterSurface.includes(court.surface))
        );
    });

    const sortedCourts = sortCourts(filteredCourts, sortCriteria, sortOrder);

    document.title = "Tereni";
    return (
        <div>
            <div className="container">
                <h1>Klupski tereni</h1>
                <p>Ovdje možete pregledavati sve terene za odabrani klub koja se nalaze u bazi, unijeti nove terene te
                    ažurirati podatke za postojeće.</p>
                <hr/>
                <h2>Filtriraj terene:</h2>
                <Form>
                    <Form.Group controlId="filterName">
                        <Form.Label className="label">Filtriraj po imenu</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Unesite ime terena"
                            onChange={handleFilterNameChange}
                            value={filterName}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="filterSurface">
                        <Form.Label className="label">Filtriraj po podlozi</Form.Label>
                        <div className="form-check form-check-inline" style={{margin: 5}}>
                            <input
                                type="checkbox"
                                id="clayFilter"
                                name="filterSurface"
                                value="CLAY"
                                checked={filterSurface.includes("CLAY")}
                                onChange={() => handleFilterSurfaceChange("CLAY")}
                            />
                            <label>Zemlja</label>
                        </div>
                        <div className="form-check form-check-inline" style={{margin: 5}}>
                            <input
                                type="checkbox"
                                id="grassFilter"
                                name="filterSurface"
                                value="GRASS"
                                checked={filterSurface.includes("GRASS")}
                                onChange={() => handleFilterSurfaceChange("GRASS")}
                            />
                            <label>Trava</label>
                        </div>
                        <div className="form-check form-check-inline" style={{margin: 5}}>
                            <input
                                type="checkbox"
                                id="hardFilter"
                                name="filterSurface"
                                value="HARD"
                                checked={filterSurface.includes("HARD")}
                                onChange={() => handleFilterSurfaceChange("HARD")}
                            />
                            <label>Tvrda</label>
                        </div>
                    </Form.Group>
                </Form>
                <Form.Group controlId="sortCriteria">
                    <Form.Label className="label">Sortiraj po:</Form.Label>
                    <Form.Control
                        as="select"
                        value={sortCriteria}
                        onChange={(e) => handleSortChange(e.target.value as keyof Court)}
                        className="control"
                    >
                        <option value="name">Imenu</option>
                        <option value="surface">Podlozi</option>
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
                <h2>Popis terena:</h2>
                {sortedCourts.length === 0 ? (
                    <p style={{fontStyle: 'italic'}}>Trenutno nema terena za odabrani klub u bazi.</p>
                ) : (
                    <table>
                        <tbody>
                        {sortedCourts.map(court => (
                            <tr key={court.courtId} style={{cursor: 'pointer'}}
                                onClick={() => window.location.href = `/courts/${court.courtId}`}>
                                <td>{court.name}</td>
                                <td>{court.clubName}</td>
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
                <h2>Dodajte novi teren:</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="name">
                        <Form.Label className="label">Ime</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Upišite ime terena"
                            onChange={handleNameChange}
                            value={name}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="surface">
                        <Form.Label className="label">Podloga</Form.Label>
                        <div className="form-check form-check-inline" style={{margin: 5}}>
                            <input
                                type="radio"
                                id="clay"
                                name="surface"
                                value="clay"
                                onChange={() => setSurface("CLAY")}
                            />
                            <label>Zemlja</label>
                        </div>
                        <div className="form-check form-check-inline" style={{margin: 5}}>
                            <input
                                type="radio"
                                id="grass"
                                name="surface"
                                value="grass"
                                onChange={() => setSurface("GRASS")}
                            />
                            <label>Trava</label>
                        </div>
                        <div className="form-check form-check-inline" style={{margin: 5}}>
                            <input
                                type="radio"
                                id="hard"
                                name="surface"
                                value="hard"
                                onChange={() => setSurface("HARD")}
                            />
                            <label>Tvrda</label>
                        </div>
                    </Form.Group>
                    <Button variant="success" type="submit">
                        Dodaj teren
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

export default CourtManager;