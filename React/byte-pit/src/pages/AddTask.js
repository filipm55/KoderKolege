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
    const [taskInput, setTaskInput] = useState('');
    const [taskOutput, setTaskOutput] = useState('');
    const [taskCategory, setTaskCategory] = useState('EASY')
    // const [isError, setIsError] = useState(false);
    // const [errorMsg, setErrorMsg] = useState('');
    // const [message, setMessage] = useState('');
    // const [errorMessage, setErrorMessage] = useState('');
    //const cookies = new Cookies();

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
            problemMaker: userData.username,
            title: taskName,
            points: taskPoints,
            duration: taskTime,
            text: taskText,
            inputExample: taskInput,
            outputExample: taskOutput,
            isPrivate: 1,              // !!!!!!!!!!!!!!!!!! ovo bi po meni defaultno trebalo biti 1 te nakon 
            problemType: taskCategory   ///      !!!!!!!!!!!!!!!!!!!!!!!! za sad ? petra nije stavila unos kategorije treba dodati
        };

        console.log(JSON.stringify(requestData));
        fetch('http://localhost:8080/problems', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
        })  .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            // If the response is OK, return the JSON data
            return response.json();
        })
        .then(data => {
            // Handle the JSON data
            console.log('Server response:', data);
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
                        <label>Naziv zadatka:</label>
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
