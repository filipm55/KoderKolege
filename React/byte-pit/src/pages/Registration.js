import {useState} from 'react';
import sendData from "../sendData";

//obrazac za registraciju koji šalje podatke klikom na gumb u nasu imaginarnu json bazu

const Registration = () => {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const submitFja = (e) => {
        e.preventDefault();
        const user = {name: name, surname: surname, username: username, email: email, password:password};

        sendData('http://localhost:8080/users', user);
    }
    
    return (
        <div className="wrapper">
            <h1>Registracija:</h1>
            <form onSubmit = {submitFja}>
                <label>Ime:
                    <input type = "text" value = {name} required onChange={(e) => setName(e.target.value)}></input>
                </label>
                <label>Prezime:
                    <input type = "text" value = {surname} required onChange={(e) => setSurname(e.target.value)}></input>
                </label>
                <label>Email:
                    <input type = "text" value = {email} required onChange={(e) => setEmail(e.target.value)}></input>
                </label>
                <label>Korisničko ime:
                    <input type = "text" value = {username} required onChange={(e) => setUsername(e.target.value)}></input>
                </label>
                <label>Lozinka:
                    <input type = "password" value = {password} required onChange={(e) => setPassword(e.target.value)}></input>
                </label>
                <button className='submitGumb'>Registriraj me!</button>

            </form>
        </div>
    );
}

export default Registration;