import {SetStateAction, useEffect, useRef, useState} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import './Manager.css'
import {Form} from "react-bootstrap";

interface Transaction {
    transactionId: number;
    name: string;
    surname: string;
    oib: string;
    clubName: string;
    transactionTimestamp: string;
    price: number;
    paymentMethod: string;
    description: string;
}

interface Person {
    personId: number;
    oib: string;
    name: string;
    surname: string;
}

function TransactionDetail() {
    const { clubId, transactionId } = useParams<{ clubId: string, transactionId: string }>();
    const [transaction, setTransaction] = useState<Transaction>();
    const [person, setPerson] = useState<Person[]>([]);
    const [showChangeButton, setShowChangeButton] = useState(false);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [oib, setOib] = useState("");
    const [transactionTimestamp, setTransactionTimestamp] = useState("");
    const [price, setPrice] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [description, setDescription] = useState("");
    const [formError, setFormError] = useState("");
    const errorRef = useRef<HTMLDivElement | null>(null);
    const [selectedPerson, setSelectedPerson] = useState('');

    useEffect(() => {
        axios.get(`/clubs/${clubId}/transactions/${transactionId}`)
            .then(response => setTransaction(response.data))
            .catch(error => console.error("Error fetching transaction: ", error));
        axios.get(`/clubs/person`)
            .then(response => setPerson(response.data))
            .catch(error => console.error("Error fetching person: ", error));
    }, [transactionId, clubId, person])

    const handleDeleteClick = async () => {
        try {
            const response = await fetch(`/clubs/${clubId}/transactions/${transactionId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                alert("Transakcija uspješno obrisana!");
                navigate(`/clubs/${clubId}/transactions`);
            } else {
                alert("Transakcija nije obrisana!");
            }
        } catch (err) {
            console.error("Error deleting transaction: ", err);
            alert("Pogreška pri brisanju transakcije!");
        }
    }

    const handleChangeClick = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setFormError("");

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

        const priceRegex = /^\d+([.,])?\d*$/;
        if (!priceRegex.test(price)) {
            setFormError("Format cijene je neispravan!");

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
            formData.append("surname", surname);
            formData.append("oib", oib);
            if (clubId != undefined) formData.append("clubId", clubId);
            formData.append("transactionTimestamp", transactionTimestamp);
            formData.append("price", price);
            formData.append("paymentMethod", paymentMethod);
            formData.append("description", description);

            const options = {
                method: "PUT",
                body: formData,
            }

            const res = await fetch(`/clubs/${clubId}/transactions/${transactionId}`, options);
            if (res.status === 200) {
                alert("Podaci o transakciji uspješno ažurirani!");
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
            alert("Pogreška pri ažuriranju podataka o transakciji!");
        }
    };

    const handlePersonChange = (event: { target: { value: string; }; }) => {
        const selectedPerson = person.find(p => p.oib === event.target.value);
        if (selectedPerson) {
            setOib(selectedPerson.oib);
            setName(selectedPerson.name);
            setSurname(selectedPerson.surname);
        }
    };
    const handleTransactionTimestampChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setTransactionTimestamp(e.target.value);
    const handlePriceChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setPrice(e.target.value);
    const handleDescriptionChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setDescription(e.target.value);

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

    document.title = "Transakcija";
    return (
        <div>
            <div className="container">
                <h1>Podaci o transakciji</h1>
                <p><strong>Ime, prezime i oib
                    osobe: </strong>{transaction?.name} {transaction?.surname}, {transaction?.oib}</p>
                <p><strong>Ime kluba: </strong>{transaction?.clubName}</p>
                <p><strong>Datum i vrijeme transakcije: </strong>{formatDateTime(transaction?.transactionTimestamp)}</p>
                <p><strong>Iznos: </strong>{transaction?.price}</p>
                {transaction?.paymentMethod && transaction.paymentMethod === "CASH" &&
                    <p><strong>Način plaćanja: </strong>Gotovina</p>}
                {transaction?.paymentMethod && transaction.paymentMethod === "CREDIT_CARD" &&
                    <p><strong>Način plaćanja: </strong>Kreditna kartica</p>}
                {transaction?.description && <p><strong>Opis: </strong>{transaction.description}</p>}
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
                    <label>Promijeni podatke o transakciji</label>
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
                    <label>Izbriši podatke o transakciji</label>
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
                        <Form.Group controlId="person">
                            <Form.Label className="label">Osoba uz koju je transakcija vezana</Form.Label>
                            <Form.Control
                                as="select"
                                value={oib ?? ''}
                                onChange={handlePersonChange}
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
                        <Form.Group controlId="transactionTimestamp">
                            <Form.Label className="label">Datum i vrijeme transakcije</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                onChange={handleTransactionTimestampChange}
                                value={transactionTimestamp}
                            />
                        </Form.Group>
                        <Form.Group controlId="webAddress">
                            <Form.Label className="label">Iznos</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={transaction?.price.toString()}
                                onChange={handlePriceChange}
                                value={price}
                                className="control"
                            />
                        </Form.Group>
                        <Form.Group controlId="paymentMethod">
                            <Form.Label className="label">Način plaćanja</Form.Label>
                            <div className="form-check form-check-inline" style={{margin: 5}}>
                                <input
                                    type="radio"
                                    id="cash"
                                    name="paymentMethod"
                                    value="cash"
                                    onChange={() => setPaymentMethod("CASH")}
                                />
                                <label>Gotovina</label>
                            </div>
                            <div className="form-check form-check-inline" style={{margin: 5}}>
                                <input
                                    type="radio"
                                    id="credit-card"
                                    name="paymentMethod"
                                    value="credit-card"
                                    onChange={() => setPaymentMethod("CREDIT_CARD")}
                                />
                                <label>Kreditna kartica</label>
                            </div>
                        </Form.Group>
                        <Form.Group controlId="zipCode">
                            <Form.Label className="label">Opis</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={transaction?.description}
                                onChange={handleDescriptionChange}
                                value={description}
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
}

export default TransactionDetail;