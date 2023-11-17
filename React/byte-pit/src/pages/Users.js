import {Link} from "react-router-dom";
import useFetch from "../useFetch";
import './Tasks.css';
import Cookies from 'universal-cookie';
import React, { useState, useEffect } from 'react';


const Users = () => {
    var [promjena, setPromjena] = useState(false);
    var uredi = new Map();
    var [mapa, setMapa] = useState(uredi);
    var postojeKorisnici = false;
    const cookies = new Cookies();
    const jwtToken = cookies.get('jwt_authorization');

    //za promjenu podataka
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (jwtToken) {    
          const fetchData = async () => {
            try {
              const url = `https://bytepitb.onrender.com/users/${jwtToken}`;
              const response = await fetch(url);
              const data = await response.json();
              setUserData(data); // Set user data fetched from the backend
            } catch (error) {
              // Handle error if needed
              console.error(error);
            }
          };
    
          fetchData();
        } else {
        }
      }, [jwtToken]);

    //funkcija koja salje bazi zahtjev za brisanjem korisnika sa id-em id
    var obrisiKorisnika = (id) => {
        fetch(`https://bytepitb.onrender.com/users/${id}`, {
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

            window.location.href = '/users'; // Redirect to the login page

    };


    const {data:users, error} = useFetch('https://bytepitb.onrender.com/users')
    //u link ubaciti link za dohvat podataka o pojedinom zadatku
    //na svakom profilu moraju biti zadaci koje je objavio u obliku popisa, backend u odgovoru na ovaj zahtjev mora poslati uz podatke o autoru i podatke o
    //imenima zadataka te id-u zadatka (ako mu je to jedinstveni identifikator

    if (users) {
        users.map(user => {
            uredi.set(user.username, false);
        });
    }   

    if (users && users.length !== 0) postojeKorisnici = true;

    var urediKorisnike = (username, name, surname, email, role) => {
        uredi.set(username, true);
        setUsername(username);
        setMapa(uredi);
        setName(name);
        setSurname(surname);
        setEmail(email);
        setRole(role);
        //console.log(uredi);
        //setPromjena(true);
    }

    var urediKorisnika = (usernamee, id) => {
        console.log(role);
        uredi.set(usernamee, false);
        setMapa(uredi);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('lastname', surname);
        formData.append('username', username);
        formData.append('email', email);
        formData.append('userType', role);

        fetch(`https://bytepitb.onrender.com/users/${id}`, {
            method: 'PUT',
            body: formData,
        }).then(response => {
            console.log("USPJEH");
        }).catch(error => {
            console.log("NEUSPJEH");
        });
        window.location.href = '/users'; // Redirect to the login page


    }

    var proba = (id) => { // SAMO DA ISPROBAM MOGU LI SE PROMIJENITI PODACI, RADI, VI TREBATE SAMO OSIGURAT OVAJ DIO SA formDATA  DA TO PROCITA SA FRONTENDA
        // IZ NEKOG RAZLOGA NE RADI KADA SE BUTTON NALAZI UNUTAR "nestajuciForm", A KAD SAM GA STAVIO VAN ONDA RADI
        const formData = new FormData();
        formData.append('name', "PROBNO IME1");
        formData.append('lastname', "PROBNO PREZIME1");
        formData.append('username', "PROBNI USERNAME1");
        formData.append('email', "probniMail1@das.com");


        fetch(`https://bytepitb.onrender.com/users/${id}`, {
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
                            {userData && userData.userType==="ADMIN" && (
                            <div className="gumbici">
                                { <button onClick={() => obrisiKorisnika(user.id)}>Obriši korisnika</button>}
                                {<button className="urediKorisnikeGumb" onClick={() => urediKorisnike(user.username, user.name, user.lastname, user.email, user.userType)}>Uredi korisnika</button>}
                            </div>
                            )}
                        </div>
                        <hr/>
                        <div className="info">
                            <div className="tekstDio">
                                <h3 className="podaciokorisniku">Podaci o korisniku: </h3>
                                {!mapa.get(user.username)  && 
                                    <div className="nekidio">
                                        <p>Email:  {user.email}</p>
                                        <p>Korisničko ime:  {user.username}</p>
                                        <p>Uloga:  {user.userType}</p>
                                    </div>
                                 }
                                {mapa.get(user.username) &&
                                <form className="nestajuciForm">
                                    <div className="kucica">
                                        <p>Ime: <input type = "text" defaultValue={user.name} onChange={(e) => setName(e.target.value)}></input></p>
                                    </div>
                                    <div className="kucica">
                                    <p>Prezime: <input type = "text" defaultValue={user.lastname} onChange={(e) => setSurname(e.target.value)}></input></p>
                                    </div>
                                    <p>Email: <input type = "text" defaultValue={user.email} length = "20" onChange={(e) => setEmail(e.target.value)}></input></p>
                                    <p>Korisničko ime: <input type = "text" defaultValue ={user.username} onChange={(e) => setUsername(e.target.value)}></input> </p>
                                    <div className='izbor'><label>Uloga:</label>
                                    <input type="radio" id="natjecatelj" name="uloga" checked={role === 'COMPETITOR'}
                                                            onChange={() => setRole('COMPETITOR')}/><p>natjecatelj</p>
                                    <input type="radio" id="voditelj" name="uloga" checked={role === 'COMPETITION_LEADER'}
                                                            onChange={() => setRole('COMPETITION_LEADER')}/><p>voditelj</p>
                                    </div>
                                    <button onClick={() => urediKorisnika(user.username, user.id)}>Spremi promjene</button>
                                </form>}
                            </div>
                            <p> <img
                                src={`data:image/jpeg;base64,${user.image.data}`} //basicly jer znamo da je slika jpeg uzimamo njezine bajtove i pretvaramo ih u sliku
                                alt="User Image"
                            /></p>
                        </div>
                    </div>
                ))}
            </div> }
        </div>
    );
}

export default Users;