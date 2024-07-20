import {SetStateAction, useEffect, useRef, useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";
import './Manager.css'
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

interface Person {
    personId: number;
    oib: string;
    name: string;
    surname: string;
}

function TransactionManager() {
    const { clubId } = useParams<{ clubId: string }>();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [person, setPerson] = useState<Person[]>([]);
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

    const [filterName, setFilterName] = useState("");
    const [filterSurname, setFilterSurname] = useState("");
    const [filterPrice, setFilterPrice] = useState("");
    const [filterDescription, setFilterDescriptione] = useState("");
    const [filterPaymentMethod, setFilterPaymentMethod] = useState<string[]>([]);

    const [sortCriteria, setSortCriteria] = useState<keyof Transaction>("name");
    const [sortOrder, setSortOrder] = useState<string>("asc");

    useEffect(() => {
        axios.get(`/clubs/${clubId}/transactions`)
            .then(response => setTransactions(response.data))
            .catch(error => console.error("Error fetching transactions: ", error));
        axios.get(`/clubs/person`)
            .then(response => setPerson(response.data))
            .catch(error => console.error("Error fetching person: ", error));
    }, [transactions, clubId, person])

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setFormError("");

        const requiredFields =[
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
            setFormError(`Format oib-a je neispravan!`);

            if (errorRef.current) {
                errorRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }

            return;
        }

        const priceRegex = /^-?\d+([.,]?\d*)?$/;
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

    const handleFilterNameChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setFilterName(e.target.value);
    const handleFilterSurnameChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setFilterSurname(e.target.value);
    const handleFilterPriceChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setFilterPrice(e.target.value);
    const handleFilterDescriptionChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setFilterDescriptione(e.target.value);
    const handleFilterPaymentMethodChange = (value: string) => {
        setFilterPaymentMethod(prev =>
            prev.includes(value)
                ? prev.filter(method => method !== value)
                : [...prev, value]
        );
    };

    const handleSortChange = (criteria: keyof Transaction) => {
        setSortCriteria(criteria);
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    const sortTransactions = (transactions: Transaction[], criteria: keyof Transaction, order: string) => {
        return transactions.sort((a, b) => {
            if (a[criteria] < b[criteria]) {
                return order === "asc" ? -1 : 1;
            }
            if (a[criteria] > b[criteria]) {
                return order === "asc" ? 1 : -1;
            }
            return 0;
        });
    };

    const filteredTransactions = transactions.filter(transaction => {
        return (
            (filterName === "" || transaction.name.toLowerCase().includes(filterName.toLowerCase())) &&
            (filterSurname === "" || transaction.surname.toLowerCase().includes(filterSurname.toLowerCase())) &&
            (filterPrice === "" || transaction.price.toString().includes(filterPrice.toLowerCase())) &&
            (filterDescription === "" || transaction.description.toLowerCase().includes(filterDescription.toLowerCase())) &&
            (filterPaymentMethod.length === 0 || filterPaymentMethod.includes(transaction.paymentMethod))
        );
    });

    const sortedTransactions = sortTransactions(filteredTransactions, sortCriteria, sortOrder);

    document.title = "Transakcije";
    return (
        <div>
            <div className="container">
                <h1>Klupske transakcije</h1>
                <p>Ovdje možete pregledavati sve transakcije za odabrani klub koje se nalaze u bazi, unijeti nove
                    transakcije te
                    ažurirati podatke za postojeće.</p>
                <hr/>
                <h2>Filtriraj transakcije:</h2>
                <Form>
                    <Form.Group controlId="filterName">
                        <Form.Label className="label">Filtriraj po imenu osobe</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Unesite ime osobe"
                            onChange={handleFilterNameChange}
                            value={filterName}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="filterSurname">
                        <Form.Label className="label">Filtriraj po prezimenu osobe</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Unesite prezime osobe"
                            onChange={handleFilterSurnameChange}
                            value={filterSurname}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="filterPrice">
                        <Form.Label className="label">Filtriraj po iznosu transakcije</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Unesite iznos transakcije"
                            onChange={handleFilterPriceChange}
                            value={filterPrice}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="filterDescription">
                        <Form.Label className="label">Filtriraj po opisu</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Unesite opis transakcije"
                            onChange={handleFilterDescriptionChange}
                            value={filterDescription}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="filterPaymentMethod">
                        <Form.Label className="label">Filtriraj po načinu plaćanja</Form.Label>
                        <div className="form-check form-check-inline" style={{margin: 5}}>
                            <input
                                type="checkbox"
                                id="creditCardFilter"
                                name="filterSurface"
                                value="CREDIT_CARD"
                                checked={filterPaymentMethod.includes("CREDIT_CARD")}
                                onChange={() => handleFilterPaymentMethodChange("CREDIT_CARD")}
                            />
                            <label>Kreditna kartica</label>
                        </div>
                        <div className="form-check form-check-inline" style={{margin: 5}}>
                            <input
                                type="checkbox"
                                id="cashFilter"
                                name="filterSurface"
                                value="CASH"
                                checked={filterPaymentMethod.includes("CASH")}
                                onChange={() => handleFilterPaymentMethodChange("CASH")}
                            />
                            <label>Gotovina</label>
                        </div>
                    </Form.Group>
                </Form>
                <Form.Group controlId="sortCriteria">
                    <Form.Label className="label">Sortiraj po:</Form.Label>
                    <Form.Control
                        as="select"
                        value={sortCriteria}
                        onChange={(e) => handleSortChange(e.target.value as keyof Transaction)}
                        className="control"
                    >
                        <option value="transactionTimestamp">Datumu i vremenu transakcije</option>
                        <option value="surname">Prezimenu osobe</option>
                        <option value="price">Iznosu transakcije</option>
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
                <h2>Popis transakcija:</h2>
                {sortedTransactions.length === 0 ? (
                    <p style={{fontStyle: 'italic'}}>Trenutno nema transakcija za odabrani klub u bazi.</p>
                ) : (
                    <table>
                        <tbody>
                        {sortedTransactions.map(transaction => (
                            <tr key={transaction.transactionId} style={{cursor: 'pointer'}}
                                onClick={() => window.location.href = `/clubs/${clubId}/transactions/${transaction.transactionId}`}>
                                <td>{transaction.name} {transaction.surname}, {transaction.oib}</td>
                                <td>{transaction.price} €</td>
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
                <h2>Dodajte novu transakciju:</h2>
                <Form onSubmit={handleSubmit}>
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
                    <Form.Group controlId="price">
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
                    <Button variant="secondary" className="button-space" onClick={resetFormFields}>
                        Odustani
                    </Button>
                </Form>
            </div>
            <div className="empty"></div>
        </div>
    )
}

export default TransactionManager;