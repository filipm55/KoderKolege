import {useParams} from "react-router-dom";
import {Link} from "react-router-dom";
import useFetch from "../useFetch";
import Cookies from 'universal-cookie';
import React, { useState, useEffect } from 'react';
import './User.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FilterVintageIcon from '@mui/icons-material/FilterVintage';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Calendar from 'react-calendar'


const User = () => {
    const [sortingOption, setSortingOption] = useState('newest-first');
    const [sortingTasks, setSortingTasks] = useState([]);
    var user;
    var isCompetitor = null;
    const { id } = useParams();
    const {data:users, error} = useFetch('http://localhost:8080/users');
    if (users) {
        users.map(u => {
            if(u.id == id) {
                user = u;
                if (u.userType == "COMPETITOR") isCompetitor = true;
                else isCompetitor = false;
            } 
        });
    }
    const { data: tasks, error: tasksError } = useFetch(
      `http://localhost:8080/problems/byMakerId/${id}`
    );
    const handleSortingChange = (e) => {
        setSortingOption(e.target.value);
    };

    useEffect(() => {
        // deault je 'newest-first', za <0 a ide prije b
        if(tasks){
            let sortedTasks = [...tasks];

            if (sortingOption === 'oldest-first') {
                sortedTasks.sort((a,b)=> a.id - b.id)
            } else if (sortingOption === 'by-type-asc' || sortingOption === 'by-type-desc') {
                var mult = 1;
                var difficultyOrder;
                if (sortingOption === 'by-type-asc') {
                    difficultyOrder = {'EASY': 0, 'MEDIUM': 1, 'HARD': 2};
                } else {
                    difficultyOrder = {'EASY': 2, 'MEDIUM': 1, 'HARD': 0};
                    mult = -1;
                }
                //najprije easy (i onda po bodovima, zatiim medium po bodovima, zatim teski po bodovima
                sortedTasks.sort((a, b) => {
                    if (a.problemType === b.problemType) {
                        // If difficulty is the same, sort by points
                        return (a.points - b.points) * mult;
                    } else {
                        // Sort by difficulty in ascending order
                        return difficultyOrder[a.problemType] - difficultyOrder[b.problemType];
                    }
                });
            }
            else{
                //default tj. newest first
                sortedTasks.sort((a,b)=>-a.id+b.id);
            }

            setSortingTasks(sortedTasks);
        }}, [sortingOption, tasks]);

    return (  
        <div id="userbody">
        {user && 
        <div id="usercontent">
            <div className="obojano"></div>
            <div id = "gornjidio">
                <div className="slikaIme">
                    <div className="slikaa"> 
                        <img className="okrugla" src={`data:image/jpeg;base64,${user.image?.data}`} alt="User Image"/>
                    </div>
                    <div id="imemail">
                        <h1 id = "imeprezime">{user.name} {user.lastname}</h1>
                        {/*<p>{user.email}</p>*/}
                    </div>
                </div>
                {isCompetitor && <div id="statistika">
                    <div className="brojopis">
                        <h6>20</h6> {/*UMETNI BROJ SVIH ZAPOČETIH ZADATAKA */}
                        <p>Započeti zadaci</p>
                    </div>
                    <div className="brojopis">
                        <h6>20</h6> {/*UMETNI BROJ SVIH RJEŠENIH ZADATAKA */}
                        <p>Uspješno rješeni zadaci</p>
                    </div>
                    <div className="brojopis">
                        <h6>100%</h6> {/*UMETNI OMJER DRUGOG I PRVOG BROJA U OBLIKU % */}
                        <p>Uspješnost</p>
                    </div>
                </div>}
            </div>
            <div id="korisniknagrade">
                <div className="korisnik">
                    <div className="ikonaOpis">
                        <AccountCircleIcon/> <p> {user.username}</p>
                    </div>
                    <div className="ikonaOpis">
                        <FilterVintageIcon/> <p> {user.userType}</p>
                    </div>
                </div>
                {isCompetitor && <div id="nagrade"> {/*DIO ZA PEHARE I NAGRADE - napraviti for po osvojenim natjecanjima */}
                        <div className="osvojeno">
                            <p>
                            <EmojiEventsIcon className="pehar" sx={{ color: "gold" }} ></EmojiEventsIcon>
                            Regionalno natjecanje 2020</p>
                        </div>
                        <div className="osvojeno">
                            <p>
                            <EmojiEventsIcon className="pehar" sx={{ color: "brown" }} ></EmojiEventsIcon>
                            IPX competiton 2016</p>
                        </div>
                        <div className="osvojeno">
                            <p>
                            <EmojiEventsIcon className="pehar" sx={{ color: "silver" }} ></EmojiEventsIcon>
                            Božični turnir 2019</p>
                        </div>
                        <div className="osvojeno">
                            <p>
                            <EmojiEventsIcon className="pehar" sx={{ color: "brown" }} ></EmojiEventsIcon>
                            Državno natjecanje 2014</p>
                        </div>
                    </div>}
                    {!isCompetitor && 
                        <div id="kalendar">
                            <p><CalendarMonthIcon className="pehar"/>
                                OBJAVLJENA NATJECANJA</p>
                            <Calendar id="voditelj"/>
                        </div>
                    }
                </div>
                {!isCompetitor && <div id="zadaci">
                    <div>
                        <b>Popis objavljenih zadataka</b>
                        <p>Sortiraj prema:
                        <select onChange={handleSortingChange}>
                            <option value="newest-first">najnovije prvo</option>
                            <option value="oldest-first">najstarije prvo</option>
                            <option value="by-type-desc">težini - silazno</option>
                            <option value="by-type-asc">težini - uzlazno</option>
                        </select></p>
                    </div>
                    {tasks && sortingTasks.length > 0 ? (
                <ul>
                  {sortingTasks.map(task => (
                    <li key={task.id}>
                        <Link to={`/tasks/${task.id}`}>
                            {task.title}
                        </Link>
                        <p>{task.points}, {task.problemType}</p></li>
                  ))}
                </ul>
              ) : (
                <p>No tasks found.</p>
              )}
                    
                </div>}
        </div>}
        </div>
    );
}
 
export default User;