import { useState } from 'react';
import sendData from "../sendData";
import './AddTask.css';
//import Cookies from "universal-cookie"
//import { useHistory } from 'react-router-dom'; // Import useHistory

const AddTask = () => {
    const [taskName, setTaskName] = useState('');
    const [taskPoints, setTaskPoints] = useState('');
    const [taskTime, setTaskTime] = useState('');
    const [taskText, setTaskText] = useState('');
    const [taskInput, setTaskInput] = useState('');
    const [taskOutput, setTaskOutput] = useState('');
    //const cookies = new Cookies();

    const submitFja = async (e) => {
        //fja za dodavanje zadatka u bazu
    };


    return (
        <div className="wrapper" id ="addTask">
            <div>
            <h2 id="novizd">Novi zadatak</h2>
            <form id="addTask" onSubmit={submitFja}>
                <div id="lijeviDio">
                    <div className="innput">
                        <label>Naziv zadatka:</label>
                        <input type="text" value={taskName} size ="40" required onChange={(e) => setTaskName(e.target.value)}></input>
                    </div>
                    <div className="input">
                        <label>Broj bodova zadatka:</label>
                        <input type ="number" value={taskPoints} required onChange={(e) => setTaskPoints(e.target.value)}></input>
                    </div>
                    <div className="input">
                        <label>Vremensko ograničenje izvršavanja:</label>
                        <input type ="time" value={taskTime} required onChange={(e) => setTaskTime(e.target.value)}></input>
                    </div>
                    <div className="input">
                        <label>Tekst zadatka:</label>             
                        <div className="input">
                            <textarea value={taskText} cols="100" rows="10" required onChange={(e) => setTaskText(e.target.value)}></textarea>
                        </div>
                    </div>   
                    <div className="input">
                        <label>Primjer za evaluaciju - ulaz:</label>
                        <div className="input">
                            <textarea value={taskInput} cols="100" rows="10" required onChange={(e) => setTaskInput(e.target.value)}></textarea>
                        </div>
                    </div>
                    <div className="input">
                        <label>Primjer za evaluaciju - izlaz:</label>
                        <div className="input">
                            <textarea value={taskOutput} cols="100" rows="10" required onChange={(e) => setTaskOutput(e.target.value)}></textarea>
                        </div>
                    </div>
                </div>
                <button className='submitGumb' id="addTask">Stvori zadatak</button>
            </form>
            </div>
            <div id="pic">
            
            </div>
        </div>
    );
};

export default AddTask;
