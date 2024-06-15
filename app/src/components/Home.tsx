import './Home.css';

function Home() {
    return (
        <div>
            <div className="container">
            <h1>Dobrodošli u web aplikaciju za pohranu podataka o teniskim klubovima!</h1>
            <p>Aplikacija koja se nalazi pred Vama omogućuje jednostavan i efikasan način
            za pregled, unos, izmjenu i brisanje podataka o teniskim klubovima. Bilo da ste
            menadžer kluba, trener ili ljubitelj tenisa, naša platforma vam pruža sve što
            je potrebno za upravljanje informacijama o teniskim klubovima.</p>
            <h2>Funkcionalnosti aplikacije:</h2>
            <ul className="features-list">
                <li><strong>Pregled, unos, izmjena i brisanje podataka o klubovima: </strong>
                Osnovni podaci o klubu, popis igrača i trenera koji su dio kluba, klupske transakcije,
                oprema, održani sastanci i tereni.</li>
                <li><strong>Pregled, unos, izmjena i brisanje podataka o trenerima: </strong>
                Osnovni podaci o treneru i treninzima koje je održao.</li>
                <li><strong>Pregled, unos, izmjena i brisanje podataka o tenisačima: </strong>
                Osnovni podaci o tenisaču i mečevima koje je odigrao.</li>
                <li><strong>Pregled, unos, izmjena i brisanje podataka o parovima: </strong>
                Osnovni podaci o paru i mečevima koje je odigrao.</li>
                <li><strong>Pregled, unos, izmjena i brisanje podataka o turnirima: </strong>
                Osnovni podaci o turniru i mečevima održanim u sklopu turnira.</li>
            </ul>
            <h2>Zašto koristiti aplikaciju?</h2>
            <ul className="advantages-list">
                <li><strong>Jednostavnost upotrebe: </strong>Intuitivan dizajn i korisničko sučelje
                omogućavaju lako snalaženje i upotrebu aplikacije.</li>
                <li><strong>Analiza podataka: </strong>Aplikacija vam pruža mogućnost analize podataka
                klubu, njihovim igračima i trenerima te ostalim popratnim stvarima, što Vam može pomoći
                u donošenju informiranih odluka o daljnjem razvoju kluba.</li>
            </ul>
            <p>Hvala što koristite aplikaciju! Uživajte u korištenju i doprinosu
                teniskoj zajednici.</p>
            </div>
            <div className="empty"></div>
        </div>
    )
}

export default Home;