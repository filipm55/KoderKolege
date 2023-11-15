import {Link} from "react-router-dom";
import useFetch from "../useFetch";
import { useState } from 'react';
import './Tasks.css';

const Users = () => {
    var [promjena, setPromjena] = useState(false);
    var uredi = new Map();
    var postojeKorisnici = false;
    //funkcija koja salje bazi zahtjev za brisanjem korisnika sa id-em id
    var obrisiKorisnika = (id) => {
        fetch(`http://localhost:8080/users/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    // Ako je zahtjev uspješan (status kod 200-299), možete obraditi odgovor
                    console.log("Uspješno izbirsan user s id-om: " + id);
                }
                else throw new Error('Network response was not ok.');
            })
            .then(data => {
                // Ovdje možete obraditi odgovor od servera (ako je potrebno)
                console.log('Uspjeh:', data);
            })
            .catch(error => {
                // Uhvatite i obradite bilo kakve greške prilikom slanja zahtjeva
                console.error('Greška prilikom slanja DELETE zahtjeva:', error);
            });
    };


    const {data:users, error} = useFetch('http://localhost:8080/users')
    //u link ubaciti link za dohvat podataka o pojedinom zadatku
    //na svakom profilu moraju biti zadaci koje je objavio u obliku popisa, backend u odgovoru na ovaj zahtjev mora poslati uz podatke o autoru i podatke o
    //imenima zadataka te id-u zadatka (ako mu je to jedinstveni identifikator

    if (users) {
        users.map(user => {
            uredi.set(user.username, false);
        });
    }   

    if (users && users.length !== 0) postojeKorisnici = true;

    var urediKorisnike = (id, formData) => {

        setPromjena(true);
    }

    var proba = (id) => { // SAMO DA ISPROBAM MOGU LI SE PROMIJENITI PODACI, RADI, VI TREBATE SAMO OSIGURAT OVAJ DIO SA formDATA  DA TO PROCITA SA FRONTENDA
        // IZ NEKOG RAZLOGA NE RADI KADA SE BUTTON NALAZI UNUTAR "nestajuciForm", A KAD SAM GA STAVIO VAN ONDA RADI
        const formData = new FormData();
        formData.append('name', "PROBNO IME1");
        formData.append('lastname', "PROBNO PREZIME1");
        formData.append('username', "PROBNI USERNAME1");
        formData.append('email', "probniMail1@das.com");
        formData.append('userType', "COMPETITION_LEADER");

        fetch(`http://localhost:8080/users/${id}`, {
            method: 'PUT',
            body: formData,
        }).then(response => {
            console.log("USPJEH");
        }).catch(error => {
            console.log("NEUSPJEH");
        });
    }


    return (
        <div className="wrrapper">
            { error && <div>{ error }</div> }
            { users && 
            <div className="task-list">
            
                {users.map(user => (
                    <div className="task" key={user.id} >
                        <div className="naslov">
                            <Link className = "imeiprezime" to={'/users/'+user.id}><h2>{ user.name + ' ' + user.lastname }</h2></Link>
                            <div className="gumbici">
                                {promjena && <button onClick={() => obrisiKorisnika(user.id)}>Obriši korisnika</button>}
                            </div>
                        </div>
                        <hr/>
                        <div className="info">
                            <div className="tekstDio">
                                <h3 className="podaciokorisniku">Podaci o korisniku:</h3>
                                {!promjena  && 
                                    <div className="nekidio">
                                        <p>Email:  {user.email}</p>
                                        <p>Korisničko ime:  {user.username}</p>
                                        <p>Uloga:  {user.userType}</p>
                                    </div>
                                 }
                                {promjena && 
                                <form className="nestajuciForm">
                                    <div className="kucica">
                                        <p>Ime: <input type = "text" value={user.name} ></input></p>
                                    </div>
                                    <div className="kucica">
                                    <p>Prezime: <input type = "text" value={user.lastname} ></input></p>
                                    </div>
                                    <p>Email: <input type = "text" value={user.email} length = "20"></input></p>
                                    <p>Korisničko ime: <input type = "text" value ={user.username}></input> </p>
                                    <div className='izbor'><label>Uloga:</label>
                                    <input type="radio" id="natjecatelj" name="uloga" /><p>natjecatelj</p>
                                    <input type="radio" id="voditelj" name="uloga"/><p>voditelj</p>
                                    </div>
                                    <button onClick={() => urediKorisnike()}>Spremi promjene</button>

                                </form>}
                            </div>
                            <p> <img
                                src={`data:image/jpeg;base64,${user.image.data}`} //basicly jer znamo da je slika jpeg uzimamo njezine bajtove i pretvaramo ih u sliku
                                alt="User Image"
                            /></p>
                            <button onClick={() => proba(user.id)}>probni</button>
                        </div>
                    </div>
                ))}
            </div> }
            {postojeKorisnici && !promjena && <button className="urediKorisnikeGumb" onClick={() => urediKorisnike()}>Uredi korisnike</button>}
        </div>
    );
}

export default Users;