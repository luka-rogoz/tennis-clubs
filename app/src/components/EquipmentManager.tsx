import {SetStateAction, useEffect, useRef, useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";
import './Manager.css'
import {Button, Form} from "react-bootstrap";

interface Equipment {
    equipmentId: number;
    clubName: string;
    quantity: number;
    name: string;
    price: number;
}

function EquipmentManager() {
    const { clubId } = useParams<{ clubId: string }>();
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [quantity, setQuantity] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [formError, setFormError] = useState("");
    const errorRef = useRef<HTMLDivElement | null>(null);

    const [filterName, setFilterName] = useState("");
    const [filterPrice, setFilterPrice] = useState("");
    const [filterQuantity, setFilterQuantity] = useState("");

    const [sortCriteria, setSortCriteria] = useState<keyof Equipment>("name");
    const [sortOrder, setSortOrder] = useState<string>("asc");

    useEffect(() => {
        axios.get(`/clubs/${clubId}/equipment`)
            .then(response => setEquipment(response.data))
            .catch(error => console.error("Error fetching equipment: ", error));
    }, [equipment, clubId])

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setFormError("");

        const requiredFields =[
            quantity,
            price,
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

        const numberRegex = /^\d+$/;
        if (!numberRegex.test(quantity)) {
            setFormError("Format količine je neispravan!");

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
            if (clubId != undefined) formData.append("clubId", clubId);
            formData.append("quantity", quantity);
            formData.append("price", price);
            formData.append("name", name);

            const options = {
                method: "POST",
                body: formData,
            }

            const res = await fetch(`/clubs/${clubId}/equipment`, options);
            if (res.status === 200) {
                alert("Oprema uspješno dodana!");
                resetFormFields();
                window.scroll({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                alert("Oprema nije uspješno dodana!" + res.status);
            }
        } catch (err) {
            console.error(err);
            alert("Pogreška pri dodavanju opreme!");
        }
    };

    const resetFormFields = () => {
        setName("");
        setQuantity("");
        setPrice("");
    }

    const handleNameChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setName(e.target.value);
    const handlePriceChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setPrice(e.target.value);
    const handleQuantityChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setQuantity(e.target.value);

    const handleFilterNameChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setFilterName(e.target.value);
    const handleFilterPriceChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setFilterPrice(e.target.value);
    const handleFilterQuantityChange = (e: {
        target: { value: SetStateAction<string> };
    }) => setFilterQuantity(e.target.value);

    const handleSortChange = (criteria: keyof Equipment) => {
        setSortCriteria(criteria);
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    const sortEquipment = (equipment: Equipment[], criteria: keyof Equipment, order: string) => {
        return equipment.sort((a, b) => {
            if (a[criteria] < b[criteria]) {
                return order === "asc" ? -1 : 1;
            }
            if (a[criteria] > b[criteria]) {
                return order === "asc" ? 1 : -1;
            }
            return 0;
        });
    };

    const filteredEquipment = equipment.filter(e => {
        return (
            (filterName === "" || e.name.toLowerCase().includes(filterName.toLowerCase())) &&
            (filterPrice === "" || e.price.toString().includes(filterPrice)) &&
            (filterQuantity === "" || e.quantity.toString().includes(filterQuantity))
        );
    });

    const sortedEquipment = sortEquipment(filteredEquipment, sortCriteria, sortOrder);

    document.title = "Oprema";
    return (
        <div>
            <div className="container">
                <h1>Klupska oprema</h1>
                <p>Ovdje možete pregledavati svu opremu za odabrani klub koja se nalaze u bazi, unijeti novu opremu te
                    ažurirati podatke za postojeću.</p>
                <hr/>
                <h2>Filtriraj terene:</h2>
                <Form>
                    <Form.Group controlId="filterName">
                        <Form.Label className="label">Filtriraj po imenu</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Unesite ime opreme"
                            onChange={handleFilterNameChange}
                            value={filterName}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="filterPrice">
                        <Form.Label className="label">Filtriraj po cijeni</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Unesite cijenu opreme"
                            onChange={handleFilterPriceChange}
                            value={filterPrice}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="filterQuantity">
                        <Form.Label className="label">Filtriraj po količini</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Unesite količinu opreme"
                            onChange={handleFilterQuantityChange}
                            value={filterQuantity}
                            className="control"
                        />
                    </Form.Group>
                </Form>
                <Form.Group controlId="sortCriteria">
                    <Form.Label className="label">Sortiraj po:</Form.Label>
                    <Form.Control
                        as="select"
                        value={sortCriteria}
                        onChange={(e) => handleSortChange(e.target.value as keyof Equipment)}
                        className="control"
                    >
                        <option value="name">Imenu</option>
                        <option value="price">Cijeni</option>
                        <option value="quantity">Količini</option>
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
                <h2>Popis opreme:</h2>
                {sortedEquipment.length === 0 ? (
                    <p style={{fontStyle: 'italic'}}>Trenutno nema opreme za odabrani klub u bazi.</p>
                ) : (
                    <table>
                        <tbody>
                        {sortedEquipment.map(equipment => (
                            <tr key={equipment.equipmentId} style={{cursor: 'pointer'}}
                                onClick={() => window.location.href = `/clubs/${clubId}/equipment/${equipment.equipmentId}`}>
                                <td>{equipment.name}</td>
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
                <h2>Dodajte novu opremu:</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="name">
                        <Form.Label className="label">Naziv</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Upišite naziv opreme"
                            onChange={handleNameChange}
                            value={name}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="price">
                        <Form.Label className="label">Cijena</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Upišite cijenu opreme u eurima"
                            onChange={handlePriceChange}
                            value={price}
                            className="control"
                        />
                    </Form.Group>
                    <Form.Group controlId="quantity">
                        <Form.Label className="label">Količina</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Upišite količinu"
                            onChange={handleQuantityChange}
                            value={quantity}
                            className="control"
                        />
                    </Form.Group>
                    <Button variant="success" type="submit">
                        Dodaj opremu
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

export default EquipmentManager;