import sendData from "../sendData";
import './AddTask.css';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import React, { useState, useEffect } from 'react';
import useFetch from "../useFetch";


const CreateCompetition = () => {
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [numOfProblems, setNumOfProblems] = useState('');
    const [picture, setPicture] = useState('');
    const [selectedProblems, setSelectedProblems] = useState([]);
    const [faultyEndTime, setFaultyEndTime] = useState(false);
    const [message, setMessage] = useState('');
    const [expandedTask, setExpandedTask] = useState([]);
    const [isError, setIsError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');


    const [userData, setUserData] = useState(null);
    const cookies = new Cookies();
    const jwtToken = cookies.get('jwt_authorization');

    useEffect(() => {
        if (jwtToken) {
            const fetchData = async () => {
                try {
                    const url = `http://localhost:8080/users/${jwtToken}`;
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

    //svi zadaci koji mogu biti izabrani su u data
    const {data:problems, error} = useFetch('http://localhost:8080/problems');

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];

        // Checking if the file type is allowed or not
        const allowedTypes = ["image/jpeg"]; // STAVIO SAM SAMO JPEG JER JE ZIVOT TAK JEDNOSTAVNIJI ZA RADIT SA SLIKOM, Mislav, MOZDA U ONE DODATNE FUNKCIONALNOST TREBA UPISAT
        if (!allowedTypes.includes(selectedFile?.type)) {
            setIsError(true);
            setErrorMsg("Only JPEG");
            return;
        }

        setIsError(false);
        setPicture(selectedFile);
    };
    const checkEndTime = (e) => {
        const newEndTime = e.target.value;

        // Check if newEndTime is before startTime
        if (new Date(newEndTime) <= new Date(startTime)) {
            setFaultyEndTime(true);
            setMessage("Kraj natjecanja mora biti nakon početka!");
            return;
        }
        // Update the endTime state
        setFaultyEndTime(false);
        setMessage("");
        setEndTime(newEndTime);
    };
    const submitFja = async (e) => {
        e.preventDefault();

        //fja za dodavanje zadatka u bazu
        //setErrorMessage('')
        if (selectedProblems.length !== parseInt(numOfProblems, 10)) {
            setIsError(true);
            setErrorMsg(`Broj zadataka mora biti ${numOfProblems}.`);
            return;
        }

        setIsError(false);
        setErrorMsg("");
        //const selectedProblemIds = selectedProblems.map((problemId) => ({ id: problemId }));

        const requestData = {
            competitionMaker: userData.id,
            dateTimeOfBeginning: startTime,
            dateTimeOfEnding: endTime,
            numberOfProblems: numOfProblems,
            slicicaPehara: picture,
            problems: Array.from(new Set(problems.filter(problem => selectedProblems.includes(problem.id))))
        };
        console.log(requestData);

        fetch('http://localhost:8080/competitions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        }).then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            // If the response is OK, return the JSON data
            return response.json();
        })
            .then(data => {
                // Handle the JSON data
                console.log('Server response:', data);
                window.history.back();
                // Perform any additional actions based on the response
            })
            .catch(error => {
                // Handle errors, including network errors or server errors
                console.error('Error:', error.message);
            });
    };
    const handleTaskToggle = (taskId) => {
        const isSelected = selectedProblems.includes(taskId);
        if (isSelected) {
            setSelectedProblems(selectedProblems.filter((id) => id !== taskId));
        } else {
            setSelectedProblems([...selectedProblems, taskId]);
        }
    };
    const handleTaskClick = (taskId, event) => {
        event.stopPropagation();
        setExpandedTask(taskId === expandedTask ? null : taskId);
    };


    return (
        <div className="wrapper" id ="addTask">
            <div>
                <h2 id="novizd">Novo natjecanje</h2>
                <form id="addTask" onSubmit={submitFja}>
                    <div id="lijeviDio">
                        <div className="input">
                            <label>Datum i vrijeme početka natjecanja: </label>
                            <input type ="datetime-local" value={startTime} required onChange={(e) => setStartTime(e.target.value)}></input>
                        </div>
                        <div className="input">
                            <label>Datum i vrijeme kraja natjecanja: </label>
                            <input type ="datetime-local" value={endTime} required onChange={(e) => checkEndTime(e)}></input>
                            {faultyEndTime && <p className='fileError' style={{ color: 'red' }}>{message}</p>}
                        </div>
                        <div className="input">
                            <label>Broj zadataka: </label>
                            <input type ="number" value={numOfProblems} required onChange={(e) => setNumOfProblems(e.target.value)}></input>
                        </div>
                        <div className='kucica'><label>Sličica pehara </label><input type="file" name="pehar" onChange={(e)=>handleFileChange(e)}/>
                        </div>
                        {isError && <p style={{color:"red"}}>{errorMsg}</p>}

                        {problems && <div className="input">

                            <label>Odaberite zadatke: </label>
                            <ul>
                                {problems.map((problem) => (
                                    <li key={problem.id}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={selectedProblems.includes(problem.id)}
                                                onChange={() => handleTaskToggle(problem.id)}
                                            />
                                            <span onClick={(e) => handleTaskClick(problem.id, e)} style={{ cursor: 'pointer', color: 'blue' }}>
                                              {problem.title}
                                            </span>
                                            {expandedTask === problem.id && (
                                                <div>
                                                    <p>Bodovi: {problem.points}</p>
                                                    <p>Tip: {problem.problemType}</p>
                                                    <p>{problem.text}</p>
                                                </div>
                                            )}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        }

                    </div>
                    <button className='submitGumb' id="addTask">Stvori natjecanje</button>

                </form>
            </div>
            <div id="pic">

            </div>
        </div>
    )
};

export default CreateCompetition;
