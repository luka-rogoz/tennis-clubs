import {SetStateAction, useEffect, useRef, useState} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import {Form} from "react-bootstrap";
import './Detail.css'

interface Equipment {
    equipmentId: number;
    clubName: string;
    quantity: number;
    name: string;
    price: number;
}

function EquipmentDetail() {
    const { clubId, equipmentId } = useParams<{ clubId: string, equipmentId: string }>();
    const [equipment, setEquipment] = useState<Equipment>();
    const [showChangeButton, setShowChangeButton] = useState(false);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [formError, setFormError] = useState("");
    const errorRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        axios.get(`/clubs/${clubId}/equipment/${equipmentId}`)
            .then(response => setEquipment(response.data))
            .catch(error => console.error("Error fetching equipment: ", error));
    }, [clubId, equipmentId])

    const handleDeleteClick = async () => {
        try {
            const response = await fetch(`/clubs/${clubId}/equipment/${equipmentId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                alert("Oprema uspješno obrisana!");
                navigate(`/clubs/${clubId}/equipment`);
            } else {
                alert("Oprema nije obrisana!");
            }
        } catch (err) {
            console.error("Error deleting equipment: ", err);
            alert("Pogreška pri brisanju opreme!");
        }
    }

    const handleChangeClick = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

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
            setFormError("Format poštanskog broja je neispravan!");

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
                method: "PUT",
                body: formData,
            }

            const res = await fetch(`/clubs/${clubId}/equipment/${equipmentId}`, options);
            if (res.status === 200) {
                alert("Podaci o opremi uspješno ažurirani!");
                window.scroll({
                    top: 0,
                    behavior: 'smooth'
                });
                navigate(`/clubs/${clubId}/equipment`);
            } else {
                alert("Podaci nisu ažurirani!" + res.status);
            }
        } catch (err) {
            console.error(err);
            alert("Pogreška pri ažuriranju podataka o opremi!");
        }
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

    document.title = "Oprema";
    return (
        <div>
            <div className="container">
                <h1>Podaci o opremi</h1>
                <p><strong>Naziv: </strong>{equipment?.name}</p>
                <p><strong>Količina: </strong>{equipment?.quantity}</p>
                <p><strong>Cijena: </strong>{equipment?.price} €</p>
                <p><strong>Ime kluba: </strong>{equipment?.clubName}</p>
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
                    <label>Promijeni podatke o opremi</label>
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
                    <label>Izbriši podatke o opremi</label>
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
                            <Form.Label className="label">Naziv</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={equipment?.name}
                                onChange={handleNameChange}
                                value={name}
                                className="control"
                            />
                        </Form.Group>
                        <Form.Group controlId="price">
                            <Form.Label className="label">Cijena</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={equipment?.price.toString()}
                                onChange={handlePriceChange}
                                value={price}
                                className="control"
                            />
                        </Form.Group>
                        <Form.Group controlId="quantity">
                            <Form.Label className="label">Količina</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={equipment?.quantity.toString()}
                                onChange={handleQuantityChange}
                                value={quantity}
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

export default EquipmentDetail;