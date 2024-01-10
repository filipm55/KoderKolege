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
import ScheduleIcon from '@mui/icons-material/Schedule';
import EastIcon from '@mui/icons-material/East';


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

    var mapa = new Map();

    const {data:competitions, error2} = useFetch('http://localhost:8080/competitions');

    function getRandomHexColor() {
        // Generate random RGB components
        const red = Math.floor(Math.random() * 150) + 100;
        const green = Math.floor(Math.random() * 150) + 100;
        const blue = Math.floor(Math.random() * 150) + 100;
      
        // Convert RGB components to hexadecimal and construct the color string
        const randomLightHexColor = `#${red.toString(16)}${green.toString(16)}${blue.toString(16)}`;
        return randomLightHexColor;
      }

    const formatTime = (timeString) => {
        return timeString.toString().length === 1 ? `0${timeString}` : timeString;

    };
    const formatDate = (dateString) => {
        const [year, month, day, hours, minutes] = dateString;

        const formattedDay = formatTime(day);
        const formattedMonth = formatTime(month);
        const formattedHours = formatTime(hours);
        const formattedMinutes = formatTime(minutes);

        return `${year}-${formattedMonth}-${formattedDay} ${formattedHours}:${formattedMinutes}`;
    };
    const isCompetitionActive = (comp) => {
        const currentDateTime = new Date();
        const compStartDate = new Date(formatDate(comp.dateTimeOfBeginning));
        const compEndDate = new Date(formatDate(comp.dateTimeOfEnding));

        return currentDateTime >= compStartDate && currentDateTime < compEndDate;
    };


    if (competitions) {
        competitions.map(comp => {
            var col = getRandomHexColor();
            mapa.set(comp.id, col);
        })
    }

    const tileContent = ({ date, view }) => {
        // Check if the date falls within the start and end dates of any competition
        if(competitions){
            const competition = competitions.filter(comp => {
                let datumic = comp.dateTimeOfBeginning;
                let dataArray = [datumic[0], datumic[1], datumic[2], datumic[3], datumic[4]]; // [godina, mjesec, dan, sat, minute]
                let [year, month, day, hours, minutes] = dataArray

                let compStartDate = new Date(year, month-1, day, 0, 0);
                datumic = comp.dateTimeOfEnding;
                dataArray = [datumic[0], datumic[1], datumic[2], datumic[3], datumic[4]];
                [year, month, day, hours, minutes] = dataArray
                let compEndDate = new Date(year, month-1, day, 23, 59);   // AKO SE OVDJE UPIŠE hours i minutes NE RADI DOBRO PRIKAZ JER FUNKCIJA date >= compStartDate && date <= compEndDate VRAĆA FALSE AKO JE DATUM POČETKA I KRAJA NATJECANJA ISTI DAN!!!!!!!!!!!!!
                if (comp.id==110){
                    console.log(date >= compStartDate);
                }
                return date >= compStartDate && date <= compEndDate;
            });
            
            if (competition) {
                // If there is a competition on this date, display its id
                return (
                    <div>
                        {competition.map((comp, index) => (
                                (comp.competitionMaker.id == id) && <div style={{ color: "black", background: mapa.get(comp.id) }}>
                                   Natjecanje! {comp.id}
                                 </div>  
                        ))}
                    </div>
                );
            }
            return null;
        }
        else return null;
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
                            <Calendar id="voditelj" tileContent={tileContent}/>
                            <div id="natjecanja">
                                {competitions && competitions.map((comp) => (
                                    <div>
                                        {(comp.competitionMaker.id == id) && (<div className="natjecanje" id ="malo">
                                            <span className='boja' style={{backgroundColor: mapa.get(comp.id)}}></span>
                                            <p className="slova3">Natjecanje {comp.id} </p>
                                            <p className="slova3"><ScheduleIcon className='ikona'/> {formatDate(comp.dateTimeOfBeginning) } <EastIcon className='ikona'/> {formatDate(comp.dateTimeOfEnding)}</p>
                                        </div>)}
                                    </div>
                                ))}
                            </div>
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