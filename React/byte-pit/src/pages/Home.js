import './Home.css';
import React, { useState, useEffect } from 'react';
import useFetch from "../useFetch";
//import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EastIcon from '@mui/icons-material/East';
import { Link } from 'react-router-dom';
import { isCompetitionActive } from './Calendar.js';
import { formatDate } from './Calendar.js';






const Home = () => {
  const {data:competitions, error} = useFetch('http://localhost:8080/competitions');
  var mapa = new Map();
  return  (
    <div>
      <h1>Home Page</h1>
      <div className='nadkontenjer'>
      <div className='welcomeText'>Dobrodošli na BytePit, mjesto gdje strast prema programiranju susreće izazov i zajedništvo. Ova platforma pruža prostor za istraživanje, učenje i natjecanje u svijetu programskog inženjerstva. Bez obzira jeste li iskusni programer ili tek započinjete svoje putovanje, BytePit vam nudi priliku da rješavate zadatke, sudjelujete u natjecanjima i povezujete se s zajednicom entuzijasta.

Slobodno istražujte zadatke, pregledavajte kalendar natjecanja i pratite svoj napredak. Ukoliko ste spremni na izazov, sudjelujte u natjecanjima i testirajte svoje vještine programiranja. BytePit čeka da otkrijete svijet mogućnosti koje programsko inženjerstvo donosi.

Registrirajte se i pridružite se zajednici programera. Uživajte u programiranju, učenju i natjecanjima na BytePit platformi!</div>
      <div className='aktivnaNatjecanja'> Aktivna natjecanja

      
      {competitions &&
                        competitions.map((comp) => (
                            <div  key={comp.id}>
                                {isCompetitionActive(comp) && (
                                <div className='natjecanje'>
                                    <span className='boja' style={{backgroundColor: mapa.get(comp.id)}}></span>
                                    {comp.name ? (
                                        <p>{comp.name}</p>
                                    ) : (
                                        <p>Natjecanje {comp.id}</p>
                                    )}
                                    <p><ScheduleIcon className='ikona'/> {formatDate(comp.dateTimeOfBeginning) } <EastIcon className='ikona'/> {formatDate(comp.dateTimeOfEnding)}</p>
                                        <Link className='joinComp' to={`/competitions/${comp.id}`}> Pridruži se! 
                                        </Link>
                                </div>)}
                            </div>
                        ))}
     </div>
    </div>
    </div>
	);
}
export default Home;