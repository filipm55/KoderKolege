import { useState } from 'react';
import sendData from "../sendData";
import './Registration.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const submitFja = async (e) => {
        e.preventDefault();
        const user = { username, password }; 
        
        try {
            const response = await sendData('http://localhost:8080/login', user);

            if (typeof response === 'string') {
                setMessage(response);
                setErrorMessage('');
            } else {
                setMessage(response.message);
                setErrorMessage('');
            }
        } catch (error) {
            setErrorMessage(error.message);
            setMessage('');
        }
    };

    return (
        <div className="wrapper">
            <h2>Prijava</h2>
            <form onSubmit={submitFja}>
                <div className='kucica'>
                    <label>Korisničko ime:</label>
                    <input type="text" value={username} required onChange={(e) => setUsername(e.target.value)}></input>
                </div>
                <div className='kucica'>
                    <label>Lozinka:</label>
                    <input type="password" value={password} required onChange={(e) => setPassword(e.target.value)}></input>
                </div>
                <button className='submitGumb'>Prijavi me!</button>
                {message && <p className='message'>{message}</p>}
                {errorMessage && <p className='errorMessage'>{errorMessage}</p>}
            </form>
        </div>
    );
};

export default Login;
