import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AllTasks.css';
import useFetch from "../useFetch";


const AllTasks = () => {
        const [data, setData] = useState([]);
        const [sort, setSort] = useState('ALL');
        var problemMakerr = null;

        const {data:users, error} = useFetch('http://localhost:8080/users');

      
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
          //console.log(data);
        }, []); 

        const findMaker = (makerId) => {
          var mak = null;
          if (users) {
            users.forEach(user => {
              if (user.id == makerId) {
                mak = user;
                problemMakerr=user;
              }
            });
          }
          //console.log(mak);
          return mak;
        }


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
              <div id="popis11">
                <div id="naslovSort">
                  <h1 id="zdzvj">Zadaci za vježbu</h1>
                  <div id="tezina11">
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
                  <thead>
                  <tr id="vrh">
                    <td className='tName'>Ime zadatka</td>
                    <td>Težina zadatka</td>
                    <td>Broj bodova</td>
                    <td>Autor zadatka</td>
                    <td></td>
                  </tr>
                  </thead>
                <tbody>
                {Object.keys(tasksByDifficulty).map(difficulty => (
                      tasksByDifficulty[difficulty].map((task, index) => (
                        ((sort === 'ALL') || (sort === task.problemType)) && !task.isPrivate &&
                        <tr key={task.id}>
                              <td className='tName'><Link className='taskName' to={`/tasks/${task.id}`}>{task.title}</Link></td>
                              <td>{task.problemType}</td>
                              <td>{task.points}</td>
                              <td>
                              {(task.problemMaker == 1) && <span id ="korisnik">Admin</span>}
                              {findMaker(task.problemMaker) && 
                                <span>
                                  <Link id ="korisnik" to={'/users/'+problemMakerr.id}>
                                    {problemMakerr.name} {problemMakerr.lastname}
                                  </Link>
                                </span>}
                              </td>
                              <td><Link id="zeleno" className='taskName' to={`/tasks/${task.id}`}>RIJEŠI!</Link></td>
                        </tr>
                      ))
                ))}</tbody></table>
              </div>
            </div>
          );
    };

export default AllTasks;