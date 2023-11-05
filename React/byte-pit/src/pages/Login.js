import {useState} from 'react';
import sendData from "../sendData";
import './Registration.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const submitFja = (e) => {
        e.preventDefault();
        const user = {username: username, password:password};

        //sendData('http://localhost:8080/users', user);
    }
    
    return (
        <div className="wrapper">
            <h2>Prijava</h2>
            <form onSubmit = {submitFja}>
                <div className='kucica'><label>Korisničko ime:</label>
                    <input type = "text" value = {username} required onChange={(e) => setUsername(e.target.value)}></input>
                </div>
                <div className='kucica'><label>Lozinka:</label>
                    <input type = "password" value = {password} required onChange={(e) => setPassword(e.target.value)}></input>
                </div>
                <button className='submitGumb'>Prijavi me!</button>
            </form>
        </div>
    );
}
export default Login;