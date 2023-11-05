import {useState} from 'react';
import sendData from "../sendData";
import './Registration.css';

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
            <h2>Registracija</h2>
            <form onSubmit = {submitFja}>
                
                <div className='kucica'><label>Ime:</label>
                    <input className = 'top' type = "text" value = {name} required onChange={(e) => setName(e.target.value)}></input>
                </div>
                <div className='kucica'><label>Prezime:</label>
                    <input type = "text" value = {surname} required onChange={(e) => setSurname(e.target.value)}></input>
                </div>
                <div className='kucica'><label>Email:</label>
                    <input type = "text" value = {email} required onChange={(e) => setEmail(e.target.value)}></input>
                </div>
                <div className='kucica'><label>Korisničko ime:</label>
                    <input type = "text" value = {username} required onChange={(e) => setUsername(e.target.value)}></input>
                </div>
                <div className='kucica'><label>Lozinka:</label>
                    <input type = "password" value = {password} required onChange={(e) => setPassword(e.target.value)}></input>
                </div>
                <div className='kucica'><label>Osobna fotografija: </label><input type="file" name="datoteka"/></div>
                <button className='submitGumb'>Registriraj me!</button>

            </form>
        </div>
    );
}

export default Registration;