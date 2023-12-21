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
    
    return (  
        <div id="userbody">
        {user && 
        <div id="usercontent">
            <div className="obojano"></div>
            <div id = "gornjidio">
                <div className="slikaIme">
                    <div className="slikaa"> 
                        <img className="okrugla" src={`data:image/jpeg;base64,${user.image.data}`} alt="User Image"/>
                    </div>
                    <div id="imemail">
                        <h1 id = "imeprezime">{user.name} {user.lastname}</h1>
                        <p>{user.email}</p>
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
                        <p>Sortiraj prema:  OVO TRENUTNO NISTA NE RADI !!!!!!!!!!!!
                        <select>
                            <option>abecedno</option>
                            <option>prezimenima voditelja</option>{ /* ovo nema smisla??*/}
                            <option>rješenosti</option>
                            <option>popularnosti</option>
                        </select></p>
                    </div>
                    <p>**LISTA ZADATAKA**</p>
                    {tasks && tasks.length > 0 ? (
                <ul>
                  {tasks.map(task => (
                    <li key={task.id}>{task.title}</li>
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