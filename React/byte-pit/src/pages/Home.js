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
import Cookies from "universal-cookie";
import ComputerIcon from '@mui/icons-material/Computer';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleIcon from '@mui/icons-material/People';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';

const Home = () => {
    const cookies = new Cookies();
    const jwtToken = cookies.get('jwt_authorization');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {
        if (jwtToken) {
            setIsLoggedIn(true);
        }
    }, [jwtToken]);

  const {data:competitions, error} = useFetch('https://bytepitb-myjy.onrender.com/competitions');
  var mapa = new Map();
  return  (
    <div id="body27">
        <div className='nadkontenjer'>
            <h1 id="naslov27">Dobrodošli na BytePit!</h1>
            <h3 id="tekst27">Naša platforma pruža prostor za istraživanje, učenje i natjecanje u svijetu programiranja. Bez obzira jeste li iskusni programer ili tek započinjete, BytePit vam nudi priliku da rješavate zadatke, sudjelujete u natjecanjima i povezujete se s zajednicom programera. Slobodno istražujte zadatke, pregledavajte kalendar natjecanja i pratite svoj napredak. Ukoliko ste spremni na izazov, sudjelujte u natjecanjima i testirajte svoje vještine programiranja.<br/> Registrirajte se i pridružite se našoj zajednici! Želimo vam puno zabave i uspjeha!</h3>
            {false && <div className='welcomeText'>
                Dobrodošli na BytePit, mjesto gdje strast prema programiranju susreće izazov i zajedništvo. Ova platforma pruža prostor za istraživanje, učenje i natjecanje u svijetu programskog inženjerstva. Bez obzira jeste li iskusni programer ili tek započinjete svoje putovanje, BytePit vam nudi priliku da rješavate zadatke, sudjelujete u natjecanjima i povezujete se s zajednicom entuzijasta.Slobodno istražujte zadatke, pregledavajte kalendar natjecanja i pratite svoj napredak. Ukoliko ste spremni na izazov, sudjelujte u natjecanjima i testirajte svoje vještine programiranja. BytePit čeka da otkrijete svijet mogućnosti koje programsko inženjerstvo donosi.Registrirajte se i pridružite se zajednici programera. Uživajte u programiranju, učenju i natjecanjima na BytePit platformi!
            </div>}
            <div id="kategorije27">
                {isLoggedIn && <Link to='/practice' id="link27"><div className='kat27'>
                    <ComputerIcon id="ikon27" className='ikona27'/>
                    Vježbaj programiranje
                    <p className='p27'>Usavrši svoje vještine rješavanjem zadataka, a za pravi izazov pokreni virtualno natjecanje!</p>
                </div></Link>}
                {!isLoggedIn && <div className='kat27'>
                    <ComputerIcon id="ikon27" className='ikona27'/>
                    Vježbaj programiranje
                    <p className='p27'>Usavrši svoje vještine rješavanjem zadataka, a za pravi izazov pokreni virtualno natjecanje!</p>
                </div>}
                <a href="#akt27" id="link27"><div className='kat27'>
                    <EmojiEventsIcon id="ikon27" className='ikona27'/>
                    Sudjeluj u natjecanjima!
                    <p className='p27'>Pregledaj koja natjecanja su aktivna klikom na ovu kategoriju!</p>
                </div></a>
                {/* <Link id="link27" to='/registration'><div className='kat27'>
                    <PeopleIcon id="ikon27" className='ikona27'/>
                    Uključi se u zajednicu
                    <p className='p27'>Registriraj se i postani dio BytePit tima!</p>
                </div></Link>*/}
                <Link id="link27" to='/competitions/results'><div className='kat27'>
                    <MilitaryTechIcon id="ikon27" className='ikona27'/>
                    Rezultati nedavnih natjecanja
                    <p className='p27'>Pogledaj poredak i rješenja drugih korisnika!</p>
                </div></Link>
            </div>
        </div>
        <div id="praznina"></div>
        <div className='aktivnaNatjecanja'>
            <h2 id="akt27">Aktivna natjecanja:</h2>
            {!isLoggedIn && <p id="napomena27">Napomena: za sudjelovanje u natjecanju najprije se potrebno ulogirati!</p>}
            {competitions && competitions.map((comp) => (
                <div  key={comp.id}>
                    {isCompetitionActive(comp) && (!comp.isvirtual || comp.isvirtual===null) &&(
                    <div className='natjecanje'>
                        <span className='boja' style={{backgroundColor: mapa.get(comp.id)}}></span>
                        {comp.name ? (<p>{comp.name}</p>) : (<p>Natjecanje {comp.id}</p>)}
                        <p><ScheduleIcon className='ikona'/> {formatDate(comp.dateTimeOfBeginning) } <EastIcon className='ikona'/> {formatDate(comp.dateTimeOfEnding)}</p>
                        {isLoggedIn && <Link className='joinComp' to={`/competitions/${comp.id}`}> Pridruži se! </Link>}
                    </div>)}
                </div>))}
            </div>
    </div>
	);
}
export default Home;