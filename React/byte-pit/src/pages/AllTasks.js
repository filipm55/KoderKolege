import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AllTasks.css';



const AllTasks = () => {
        const [data, setData] = useState([]);
        const [sort, setSort] = useState('ALL');
      
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
            HARD: []
          };
        
          data.forEach(task => {
            tasksByDifficulty[task.problemType].push(task);
          });
        
          return (
            <div>
              <div id="popis">
                <div id="naslovSort">
                  <h1>Zadaci za vježbu</h1>
                  <div>
                        <p>Težina:  
                        <select onChange={(event) => setSort(event.target.value)}>
                            <option value = 'ALL'>ALL</option>
                            <option value ='EASY'>EASY</option>
                            <option value = 'MEDIUM'>MEDIUM</option>
                            <option value = 'HARD'>HARD</option>
                        </select></p>
                    </div>
                </div>
                <table className='popisZad'>
                  <tr id="vrh">
                    <td className='tName'>Ime zadatka</td>
                    <td>Težina zadatka</td>
                    <td>Broj bodova</td>
                    <td></td>
                  </tr>
                {Object.keys(tasksByDifficulty).map(difficulty => (
                      tasksByDifficulty[difficulty].map((task, index) => (
                        ((sort === 'ALL') || (sort === task.problemType)) && <tr key={task.id}>
                              <td className='tName'><Link className='taskName' to={`/tasks/${task.id}`}>{task.title}</Link></td>
                              <td>{task.problemType}</td>
                              <td>{task.points}</td>
                              <td><Link className='taskName' to={`/tasks/${task.id}`}>RIJEŠI!</Link></td>
                        </tr>
                      ))
                ))}</table>
              </div>
            </div>
          );
    };

export default AllTasks;