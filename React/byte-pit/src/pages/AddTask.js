import sendData from "../sendData";
import './AddTask.css';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import React, { useState, useEffect } from 'react';


//import Cookies from "universal-cookie"
//import { useHistory } from 'react-router-dom'; // Import useHistory

const AddTask = () => {
    const [taskName, setTaskName] = useState('');
    const [taskPoints, setTaskPoints] = useState('');
    const [taskTime, setTaskTime] = useState('');
    const [taskText, setTaskText] = useState('');
    const [examplePairs, setExamplePairs] = useState([{ input: '', output: '' }]);
    const [taskCategory, setTaskCategory] = useState('EASY')
    const[visibility, setVisibility]=useState(1)
    // const [isError, setIsError] = useState(false);
    // const [errorMsg, setErrorMsg] = useState('');
    // const [message, setMessage] = useState('');
    // const [errorMessage, setErrorMessage] = useState('');
    //const cookies = new Cookies();

    const [userData, setUserData] = useState(null);
    const cookies = new Cookies();
    const jwtToken = cookies.get('jwt_authorization');

    const addExample = () => {
        setExamplePairs([...examplePairs, { input: '', output: '' }]);
    };
    const handleVisibilityChange = (value) =>{
        setVisibility(value)
    };


    useEffect(() => {
        if (jwtToken) {
            const fetchData = async () => {
                try {
                    const url = `https://bytepitb-myjy.onrender.com/users/${jwtToken}`;
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

    const submitFja = async (e) => {
        //fja za dodavanje zadatka u bazu
        //setErrorMessage('')
        e.preventDefault();

        /* const fakeUserZaSad = {  /////////?????????????????????????????????? za sad
            name: "name",
            lastname: "surname",
            username: "username",
            email: "email@gmail.com",
            password: "password",
            userType: "COMPETITOR",
            image: null
        }; */


        const requestData = {
            problemMaker: userData.id,
            title: taskName,
            points: taskPoints,
            duration: taskTime,
            text: taskText,
            inputOutputExamples: Object.fromEntries(
                examplePairs.map(({input, output}) => [input, output])
            ),
            isPrivate: Boolean(visibility),              // !!!!!!!!!!!!!!!!!! ovo bi po meni defaultno trebalo biti 1 te nakon
            problemType: taskCategory   ///      !!!!!!!!!!!!!!!!!!!!!!!! za sad ? petra nije stavila unos kategorije treba dodati
        };

        console.log(JSON.stringify(requestData));
        fetch('https://bytepitb-myjy.onrender.com/problems', {
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


    return (
        <div className="wrapper" id ="addTask">
            <div>
                <h2 id="novizd">Novi zadatak</h2>
                <form id="addTask" onSubmit={submitFja}>
                    <div id="lijeviDio">
                        <div className="input">
                            <label>Naziv zadatka: </label>
                            <input type="text" value={taskName} size ="40" required onChange={(e) => setTaskName(e.target.value)}></input>
                        </div>
                        <div className='input'>
                            <label htmlFor="category">Težina zadatka:</label>
                            <select id="category" name="category" value={taskCategory} onChange={(event) => setTaskCategory(event.target.value)}>
                                <option value="EASY">Easy</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HARD">Hard</option>
                            </select>
                        </div>
                        <div className="input">
                            <label>Broj bodova zadatka: </label>
                            <input type ="number" value={taskPoints} required onChange={(e) => setTaskPoints(e.target.value)}></input>
                        </div>
                        <div className="input">
                            <label>Vremensko ograničenje izvršavanja: </label>
                            <input type ="time" value={taskTime} required onChange={(e) => setTaskTime(e.target.value)}></input>
                        </div>
                        <div className="input">
                            <label>Vidljivost: </label>
                            <div >
                                <label>
                                    <input
                                        type="radio"
                                        name="visibility"
                                        value={1}
                                        checked={visibility === 1}
                                        onChange={() => handleVisibilityChange(1)}
                                    />
                                    Private
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="visibility"
                                        value={0}
                                        checked={visibility === 0}
                                        onChange={() => handleVisibilityChange(0)}
                                    />
                                    Public
                                </label>
                            </div>
                        </div>
                        <div className="input">
                            <label>Tekst zadatka: </label>
                            <div className="input">
                                <textarea value={taskText} cols="80" rows="10" required onChange={(e) => setTaskText(e.target.value)}></textarea>
                            </div>
                        </div>
                        <div className="input">
                            <label>Primjer za evaluaciju - ulaz/izlaz: </label>
                            {examplePairs.map((example, index) => (
                                <div key={index} className="input">
                                    <textarea
                                        value={example.input}
                                        cols="80"
                                        rows="3"
                                        required
                                        onChange={(e) => {
                                            const updatedExamplePairs = [...examplePairs];
                                            updatedExamplePairs[index].input = e.target.value;
                                            setExamplePairs(updatedExamplePairs);
                                        }}
                                    ></textarea>
                                    <textarea
                                        value={example.output}
                                        cols="80"
                                        rows="3"
                                        required
                                        onChange={(e) => {
                                            const updatedExamplePairs = [...examplePairs];
                                            updatedExamplePairs[index].output = e.target.value;
                                            setExamplePairs(updatedExamplePairs);
                                        }}
                                    ></textarea>
                                </div>
                            ))}
                            <button id ="dodavanje" type="button" onClick={addExample}>Dodaj još primjera za evaluaciju</button>

                        </div>
                    </div>
                    <button className='submitGumb' id="addTask">Stvori zadatak</button>

                </form>
            </div>
            <div id="pic">

            </div>
        </div>
    )
};

export default AddTask;
