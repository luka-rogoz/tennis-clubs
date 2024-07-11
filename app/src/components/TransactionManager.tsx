import {SetStateAction, useEffect, useRef, useState} from "react";
import axios from "axios";
import {Link, useParams} from "react-router-dom";
import './ClubManager.css'
import {Button, Form} from "react-bootstrap";

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

function TransactionManager() {
    const { clubId } = useParams<{ clubId: string }>();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [oib, setOib] = useState("");
    const [transactionTimestamp, setTransactionTimestamp] = useState("");
    const [price, setPrice] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [description, setDescription] = useState("");
    const [formError, setFormError] = useState("");
    const errorRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        axios.get(`/clubs/${clubId}/transactions`)
            .then(response => setTransactions(response.data))
            .catch(error => console.error("Error fetching transactions: ", error));
    }, [transactions, clubId])

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        const requiredFields =[
            name,
            surname,
            oib,
            transactionTimestamp,
            price,
            paymentMethod,
            description
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
                method: "POST",
                body: formData,
            }

            const res = await fetch(`/clubs/${clubId}/transactions`, options);
            if (res.status === 200) {
                alert("Transakcija uspješno dodana!");
                resetFormFields();
                window.scroll({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                alert("Transakcija nije uspješno dodana!" + res.status);
            }
        } catch (err) {
            console.error(err);
            alert("Pogreška pri dodavanju transakcije!");
        }
    };

    const resetFormFields = () => {
        setName("");
        setSurname("");
        setOib("");
        setTransactionTimestamp("");
        setPrice("");
        setPaymentMethod("");
        setDescription("");
    }

    const handleNameChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setName(e.target.value);
    const handleSurnameChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setSurname(e.target.value);
    const handleOibChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setOib(e.target.value);
    const handleTransactionTimestampChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setTransactionTimestamp(e.target.value);
    const handlePriceChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setPrice(e.target.value);
    const handleDescriptionChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setDescription(e.target.value);

    document.title = "Transakcije";
    return (
        <div>
            <div className="container">
                <h1>Klupske transakcije</h1>
                <p>Ovdje možete pregledavati sve transakcije za odabrani klub koje se nalaze u bazi, unijeti nove transakcije te
                ažurirati podatke za postojeće.</p>
                <h2>Popis transakcija:</h2>
                {transactions.length === 0 ? (
                    <p style={{fontStyle: 'italic'}}>Trenutno nema transakcija za odabrani klub u bazi.</p>
                ) : (
                    <table>
                        <tbody>
                        {transactions.map(transaction => (
                            <tr key={transaction.transactionId}>
                                <Link to={`/clubs/${clubId}/transactions/${transaction.transactionId}`}>
                                    <td>{transaction.name} {transaction.surname}, {transaction.oib}</td>
                                    <td>{transaction.price} €</td>
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
                <h2>Dodajte novu transakciju:</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="name">
                        <Form.Label className="label">Ime osobe</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Upišite ime osobe s kojom se izvršava transakcija"
                            onChange={handleNameChange}
                            value={name}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="surname">
                        <Form.Label className="label">Prezime osobe</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Upišite prezime osobe s kojom se izvršava transakcija"
                            onChange={handleSurnameChange}
                            value={surname}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="oib">
                        <Form.Label className="label">Oib osobe</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Upišite oib osobe s kojom se izvršava transakcija"
                            onChange={handleOibChange}
                            value={oib}
                            className="control"
                        />
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
                            placeholder="Upišite iznos transakcije u eurima"
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
                            placeholder="Upišite opis transakcije"
                            onChange={handleDescriptionChange}
                            value={description}
                            className="control"
                        />
                    </Form.Group>
                    <Button variant="success" type="submit">
                        Dodaj transakciju
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