import { useState } from 'react';
import sendData from "../sendData";
import './Registration.css';
import Cookies from "universal-cookie"
//import { useHistory } from 'react-router-dom'; // Import useHistory

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [user, setUser] = useState('')

    const cookies = new Cookies();

    /*const logout = () => {
        setUser('')
        cookies.remove("jwt_authorization")
    }*/

    //login
    const submitFja = async (e) => {
        setErrorMessage('')
        setMessage('')
        e.preventDefault();
        const loginDTO = { username, password };
        
        try {
            const response = await sendData('http://localhost:8080/login', loginDTO);

            if (typeof response === 'string') {
                //setMessage(response);  
                setErrorMessage('');

                let token = response;
                const expirationDate = new Date();
                expirationDate.setTime(expirationDate.getTime() + (3 * 60 * 60 * 1000)); // stavila sam da traje 3 sata prijava..
                cookies.set("jwt_authorization", token, {
                    expires: expirationDate
                });
                window.location.href = '/'; // Redirect to the login page

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
                {message && <p className='success'>{message}</p>}
                {errorMessage && <p className='warning'>{errorMessage}</p>}
            </form>
        </div>
    );
};

export default Login;
