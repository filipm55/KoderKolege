import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AllTasks.css';



const AllTasks = () => {
        const [data, setData] = useState([]);
      
        useEffect(() => {
          // Funkcija za dohvat podataka
          const fetchData = async () => {
            try {
              const response = await fetch('http://localhost:8080/problems'); 
              const jsonData = await response.json();
              setData(jsonData);
            } catch (error) {
              console.error('Greška prilikom dohvaćanja podataka:', error);
            }
          };
      
          // Poziv funkcije za dohvat podataka
          fetchData();
          console.log(data);
        }, []); 


        const tasksByDifficulty = {
            EASY: [],
            MEDIUM: [],
            HARD: [],
          };
        
          data.forEach(task => {
            tasksByDifficulty[task.problemType].push(task);
          });
        
          return (
            <div>
              <h2>Popis Zadataka:</h2>
              <div id="popis">
              {Object.keys(tasksByDifficulty).map(difficulty => (
                <div id={difficulty.toLowerCase()}  className="zadatcitezine" key={difficulty}>
                  <h3>{difficulty}:</h3>
                  <ul>
                    {tasksByDifficulty[difficulty].map((task, index) => (
                      <li key={task.id}>
                         <Link to={`/tasks/${task.id}`}>
                            {/* Zadatak_{index + 1}        želimo li  zadatak1,zadatak2 ili imena zadataka */}
                            {task.title}
                        </Link>
                     
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              </div>
            </div>
          );
    };

export default AllTasks;