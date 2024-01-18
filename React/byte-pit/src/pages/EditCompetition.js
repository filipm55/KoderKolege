import sendData from "../sendData";
import './AddTask.css';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import React, { useState, useEffect } from 'react';
import useFetch from "../useFetch";
import {useParams} from "react-router-dom";


const EditCompetition = () => {
    const [name, setName] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [numOfProblems, setNumOfProblems] = useState('');
    const { id } = useParams();

    const [selectedProblems, setSelectedProblems] = useState([]);
    const [faultyEndTime, setFaultyEndTime] = useState(false);
    const [message, setMessage] = useState('');
    const [expandedTask, setExpandedTask] = useState([]);
    const [isError, setIsError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const emptyBlob = new Blob([''], { type: 'text/plain' });
    const [picture, setPicture] = useState(emptyBlob);


    const [userData, setUserData] = useState(null);
    const cookies = new Cookies();
    const jwtToken = cookies.get('jwt_authorization');

    useEffect(() => {
        if (jwtToken) {
            const fetchData = async () => {
                try {
                    const url = `https://bytepitb-myjy.onrender.com//users/${jwtToken}`;
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
    const {data:problems, error} = useFetch('https://bytepitb-myjy.onrender.com//problems');
    const {data:competition} = useFetch(`https://bytepitb-myjy.onrender.com//competitions/competition/${id}`);

    useEffect(() => {
        if (competition) {
            console.log(competition);
            setName(competition.name);
            const dateArray = competition.dateTimeOfBeginning; 
            const formattedStartDate = new Date(Date.UTC(...dateArray)).toISOString().slice(0, -1);

            const endDateArray = competition.dateTimeOfEnding;
            const formattedEndDate = new Date(Date.UTC(...endDateArray)).toISOString().slice(0, -1);
            setStartTime(formattedStartDate);
            setEndTime(formattedEndDate);
            setNumOfProblems(competition.numberOfProblems);
            if(competition.trophyPicture)
                setPicture(competition.trophyPicture);

            setSelectedProblems([...competition.problems.map(problem => problem.id)]);
            console.log(competition.trophyPicture);
        /*formData.append('trophyPicture', picture);
        formData.append('problems', problemsArray);
        formData.append('isvirtual',Boolean(false));

            fetchData();*/
        } else {
        }
    }, [competition]);

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

        const problemsArray = Array.from(new Set(problems.filter(problem => selectedProblems.includes(problem.id)).map(problem => problem.id)));

        const formData = new FormData();
        console.log(name, startTime);
        formData.append('name', name);
        formData.append('competitionMaker', competition.competitionMaker.id);
        formData.append('dateTimeOfBeginning', startTime);
        formData.append('dateTimeOfEnding', endTime);
        formData.append('numberOfProblems', numOfProblems);
        if (picture.size > 0) {
            formData.append('trophyPicture', picture);
        }
        else formData.append('trophyPicture', emptyBlob);

        formData.append('problems', problemsArray);
        //formData.append('isvirtual',Boolean(false));
        console.log(formData.get('dateTimeOfBeginning'));

        fetch(`https://bytepitb-myjy.onrender.com//competitions/${id}`, {
            method: 'PUT',
            body: formData
        
        }).then(response => {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return response.json(); // Parse as JSON
            } else {
                return response.text(); // Parse as text
            }
        })
            .then(data => {
                console.log('Success:', data);
                if (typeof data === 'object') {
                    // JSON response
                    setMessage('');
                } else {
                    // Text response
                    setMessage(data);
                    //window.location.href = '/'; // Redirect to the login page

                }
            })
            .catch((error) => {
                console.error('Error:', error);
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
                <h2 id="novizd">Uredi natjecanje</h2>
                <form id="addTask" onSubmit={submitFja}>
                    <div id="lijeviDio">
                    <div className="input">
                            <label>Naziv natjecanja: </label>
                            <input type ="text" value={name} size ="40" required onChange={(e) => setName(e.target.value)}></input>
                        </div>
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
                                    <li key={problem.id} style={{ listStyleType: 'none' }}>
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
                    <button className='submitGumb' id="addTask">Spremi promjene</button>

                </form>
            </div>
            <div id="pic2">

            </div>
        </div>
    )
};

export default EditCompetition;
