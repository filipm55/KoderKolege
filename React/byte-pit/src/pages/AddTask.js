import { useState } from 'react';
import sendData from "../sendData";
import './AddTask.css';
import Cookies from "universal-cookie"
//import { useHistory } from 'react-router-dom'; // Import useHistory

const AddTask = () => {
    const [taskName, setTaskName] = useState('');
    const [taskPoints, setTaskPoints] = useState('');
    const [taskTime, setTaskTime] = useState('');
    const [taskText, setTaskText] = useState('');
    const [taskInput, setTaskInput] = useState('');
    const [taskOutput, setTaskOutput] = useState('');
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const cookies = new Cookies();


    //login
    const submitFja = async (e) => {
    };

    return (
        <div className="wrapper">
            <h2>Novi zadatak</h2>
            <form onSubmit={submitFja}>
                <div className='kucica'>
                    <label>Naziv zadatka:</label>
                    <input type="text" value={taskName} required onChange={(e) => setTaskName(e.target.value)}></input>
                </div>
                <div className='kucica'>
                    <label>Broj bodova zadatka:</label>
                    <input type ="number" value={taskPoints} required onChange={(e) => setTaskPoints(e.target.value)}></input>
                </div>
                <div className='kucica'>
                    <label>Vremensko ograničenje izvršavanja:</label>
                    <input type ="time" value={taskTime} required onChange={(e) => setTaskTime(e.target.value)}></input>
                </div>
                <div className='kucica'>
                <label>Tekst zadatka:</label></div>
                <div className='kucica'>
                    <textarea value={taskText} cols="60" rows="15" required onChange={(e) => setTaskText(e.target.value)}></textarea>
                </div>
                <div className='kucica'>
                <label>Primjer za evaluaciju - ulaz:</label></div>
                <div className='kucica'>
                    <textarea value={taskInput} cols="60" rows="15" required onChange={(e) => setTaskInput(e.target.value)}></textarea>
                </div>
                <div className='kucica'>
                <label>Primjer za evaluaciju - izlaz:</label></div>
                <div className='kucica'>
                    <textarea value={taskOutput} cols="60" rows="15" required onChange={(e) => setTaskOutput(e.target.value)}></textarea>
                </div>
                <button className='submitGumb'>Stvori zadatak!</button>
                {message && <p className='success'>{message}</p>}
                {errorMessage && <p className='warning'>{errorMessage}</p>}
            </form>
        </div>
    );
};

export default AddTask;
