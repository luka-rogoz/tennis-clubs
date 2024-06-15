import {SetStateAction, useEffect, useRef, useState} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import {Button, Form} from "react-bootstrap";
import './Detail.css'

interface Player {
    playerId: number;
    oib: string;
    name: string;
    surname: string;
    dateOfBirth: string;
    sex: string;
    zipCode: number;
    placeName: string;
    height: number;
    weight: number;
    prefferedHand: string;
    rank: number;
    injury: string;
    clubName: string;
    previousClubs: Set<string>;
}

function PlayerDetail() {
    const { playerId } = useParams<{ playerId: string }>();
    const [player, setPlayer] = useState<Player>();
    const [showChangeButton, setShowChangeButton] = useState(false);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const navigate = useNavigate();
    const [oib, setOib] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [sex, setSex] = useState("");
    const [injury, setInjury] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [placeName, setPlaceName] = useState("");
    const [clubName, setClubName] = useState("");
    const [rank, setRank] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [prefferedHand, setPrefferedHand] = useState("");
    const [from, setFrom] = useState("");
    const [formError, setFormError] = useState("");
    const errorRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        axios.get(`/players/${playerId}`)
            .then(response => setPlayer(response.data))
            .catch(error => console.error("Error fetching player: ", error));
    }, [playerId])

    const handleDeleteClick = async () => {
        try {
            const response = await fetch(`/players/${playerId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                alert("Tenisač uspješno obrisan!");
                navigate("/players/");
            } else {
                alert("Tenisač nije obrisan!");
            }
        } catch (err) {
            console.error("Error deleting player: ", err);
            alert("Pogreška pri brisanju tenisača!");
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
            formData.append("height", height);
            formData.append("weight", weight);
            formData.append("prefferedHand", prefferedHand);
            formData.append("rank", rank);
            formData.append("injury", injury);
            formData.append("zipCode", zipCode);
            formData.append("placeName", placeName);
            formData.append("clubName", clubName);
            formData.append("from", from);

            const options = {
                method: "PUT",
                body: formData,
            }

            const res = await fetch(`/players/${playerId}`, options);
            if (res.status === 200) {
                alert("Podaci o tenisaču su uspješno ažurirani!");
                window.scroll({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                alert("Podaci nisu ažurirani!" + res.status);
            }
        } catch (err) {
            console.error(err);
            alert("Pogreška pri ažuriranju podataka o tenisaču!");
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
    const handleDateOfBirthChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setDateOfBirth(e.target.value);
    const handleClubNameChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setClubName(e.target.value);
    const handlePlaceNameChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setPlaceName(e.target.value);
    const handleZipCodeChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setZipCode(e.target.value);
    const handleHeightChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setHeight(e.target.value);
    const handleWeightChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setWeight(e.target.value);
    const handleRankChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setRank(e.target.value);
    const handleInjuryChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setInjury(e.target.value);
    const handleFromChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setFrom(e.target.value);

    document.title = player?.name + " " + player?.surname;
    return (
        <div>
            <div className="container">
                <h1>Podaci o tenisaču</h1>
                <p><strong>Ime i prezime: </strong>{player?.name} {player?.surname}</p>
                <p><strong>Mjesto: </strong>{player?.zipCode} {player?.placeName}</p>
                {player?.clubName && <p><strong>Ime kluba: </strong>{player.clubName}</p>}
                {player?.oib && <p><strong>Oib: </strong>{player.oib}</p>}
                {player?.dateOfBirth && <p><strong>Datum rođenja (YYYY-MM-DD): </strong>{player.dateOfBirth}</p>}
                {player?.sex && player.sex === "MALE" && <p><strong>Spol: </strong>Muško</p>}
                {player?.sex && player.sex === "FEMALE" && <p><strong>Spol: </strong>Žensko</p>}
                {player?.height && <p><strong>Visina: </strong>{player.height} cm</p>}
                {player?.weight && <p><strong>Težina: </strong>{player.weight} kg</p>}
                {player?.prefferedHand && <p><strong>Snažnija ruka: </strong>{player.prefferedHand}</p>}
                {player?.rank && <p><strong>Rank: </strong>{player.rank}</p>}
                {player?.injury && <p><strong>Ozljeda: </strong>{player.injury}</p>}
                {player?.previousClubs && (
                    <ol><p><strong>Prijašnji klubovi:</strong></p>
                        {[...(player?.previousClubs ?? new Set())].map((item) => (
                            <li key={item}><p>{item}</p></li>
                        ))}
                    </ol>
                )}
                <p><strong>Ostalo:</strong></p>
                <br/>
                <Button href={`/players/${playerId}/singles-matches`} className="links">Singl mečevi</Button>
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
                    <label>Promijeni podatke o tenisaču</label>
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
                    <label>Izbriši podatke o tenisaču</label>
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
                                placeholder={player?.name}
                                onChange={handleNameChange}
                                value={name}
                                className="control"
                            />
                        </Form.Group>
                        <Form.Group controlId="surname">
                            <Form.Label className="label">Prezime</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={player?.surname}
                                onChange={handleSurnameChange}
                                value={surname}
                                className="control"
                            />
                        </Form.Group>
                        <Form.Group controlId="oib">
                            <Form.Label className="label">Oib</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={player?.oib}
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
                                placeholder={player?.zipCode.toString()}
                                onChange={handleZipCodeChange}
                                value={zipCode}
                                className="control"
                            />
                        </Form.Group>
                        <Form.Group controlId="placeName">
                            <Form.Label className="label">Ime mjesta</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={player?.placeName}
                                onChange={handlePlaceNameChange}
                                value={placeName}
                                className="control"
                            />
                        </Form.Group>
                        <Form.Group controlId="height">
                            <Form.Label className="label">Visina</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={player?.height.toString()}
                                onChange={handleHeightChange}
                                value={height}
                                className="control"
                            />
                        </Form.Group>
                        <Form.Group controlId="weight">
                            <Form.Label className="label">Težina</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={player?.weight.toString()}
                                onChange={handleWeightChange}
                                value={weight}
                                className="control"
                            />
                        </Form.Group>
                        <Form.Group controlId="prefferedHand">
                            <Form.Label className="label">Snažnija ruka</Form.Label>
                            <div className="form-check form-check-inline" style={{margin: 5}}>
                                <input
                                    type="radio"
                                    id="left"
                                    name="prefferedHand"
                                    value="left"
                                    onChange={() => setPrefferedHand("LEFT")}
                                />
                                <label>Lijeva</label>
                            </div>
                            <div className="form-check form-check-inline" style={{margin: 5}}>
                                <input
                                    type="radio"
                                    id="right"
                                    name="prefferedHand"
                                    value="right"
                                    onChange={() => setPrefferedHand("RIGHT")}
                                />
                                <label>Desna</label>
                            </div>
                        </Form.Group>
                        <Form.Group controlId="rank">
                            <Form.Label className="label">Rank</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={player?.rank.toString()}
                                onChange={handleRankChange}
                                value={rank}
                                className="control"
                            />
                        </Form.Group>
                        <Form.Group controlId="injury">
                            <Form.Label className="label">Ozljeda</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={player?.injury}
                                onChange={handleInjuryChange}
                                value={injury}
                                className="control"
                            />
                        </Form.Group>
                        <Form.Group controlId="clubName">
                            <Form.Label className="label">Ime kluba</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={player?.clubName}
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

export default PlayerDetail;