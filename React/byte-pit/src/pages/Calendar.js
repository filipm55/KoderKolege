import './Calendar.css';
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EastIcon from '@mui/icons-material/East';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';


import useFetch from "../useFetch";
import {useEffect, useState} from "react";





export const formatTime = (timeString) => {
    return timeString.toString().length === 1 ? `0${timeString}` : timeString;

};
export const formatDate = (dateString) => {
    const [year, month, day, hours, minutes] = dateString;

    const formattedDay = formatTime(day);
    const formattedMonth = formatTime(month);
    const formattedHours = formatTime(hours);
    const formattedMinutes = formatTime(minutes);

    return `${year}-${formattedMonth}-${formattedDay} ${formattedHours}:${formattedMinutes}`;
};

export const isCompetitionActive = (comp) => {
    const currentDateTime = new Date();
    const compStartDate = new Date(formatDate(comp.dateTimeOfBeginning));
    const compEndDate = new Date(formatDate(comp.dateTimeOfEnding));

    return currentDateTime >= compStartDate && currentDateTime < compEndDate;
};
export const isCompetitionUpcoming = (comp) => {
    const currentDateTime = new Date();
    const compStartDate = new Date(formatDate(comp.dateTimeOfBeginning));
    const compEndDate = new Date(formatDate(comp.dateTimeOfEnding));

    return currentDateTime < compEndDate;
};
const Cal = () => {
    const cookies = new Cookies();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const jwtToken = cookies.get('jwt_authorization');
    useEffect(() => {
        if (jwtToken) {
            setIsLoggedIn(true);
        }
    }, [jwtToken]);

    var mapa = new Map();

    const {data:competitions, error} = useFetch('https://bytepitb.onrender.com/competitions');

    function getRandomHexColor() {
        // Generate random RGB components
        const red = Math.floor(Math.random() * 150) + 100;
        const green = Math.floor(Math.random() * 150) + 100;
        const blue = Math.floor(Math.random() * 150) + 100;
      
        // Convert RGB components to hexadecimal and construct the color string
        const randomLightHexColor = `#${red.toString(16)}${green.toString(16)}${blue.toString(16)}`;
        return randomLightHexColor;
      }



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
                return date >= compStartDate && date <= compEndDate;
            });
            
            if (competition) {
                var i = 0;
                // If there is a competition on this date, display its id
                return (
                    <div unique='true' key ={i ++}>
                        {competition.map((comp, index) => (
                             (
                                <div key={comp.id} style={{ color: "black", background: mapa.get(comp.id) }}>
                                {comp.name ? comp.name : "Natjecanje "+comp.id}
                             </div>                           
                              )
                                
                            
                        ))}
                    </div>
                );
            }
            return null;
        }
        else return null;
    };


    return (
        <div className="body" id="izKalendara">
            <div id="prozor17">
                <div id="kalendar17">
                    <Calendar id="kalendar" tileContent={tileContent} />
                </div>
                <div id="natjecanja">
                <h1 id="naslov17"> Nadolazeća i aktualna natjecanja</h1>
                    {competitions &&
                        competitions.map((comp) => (
                            <div  key={comp.id}>
                                {isCompetitionUpcoming(comp) && (!comp.isvirtual || comp.isvirtual===null) && (
                                <div className='natjecanje'>
                                    <span className='boja' style={{backgroundColor: mapa.get(comp.id)}}></span>
                                    {comp.name ? (
                                        <p>{comp.name}</p>
                                    ) : (
                                        <p>Natjecanje {comp.id}</p>
                                    )}
                                    <p><ScheduleIcon className='ikona17'/> {formatDate(comp.dateTimeOfBeginning) } <EastIcon className='ikona17'/> {formatDate(comp.dateTimeOfEnding)}</p>
                                    {isCompetitionActive(comp) && isLoggedIn && (
                                        <Link className='joinComp' to={`/competitions/${comp.id}`}> Pridruži se! 
                                        </Link>
                                        
                                    )}
                                </div>)}
                            </div>
                        ))}
                </div>
                <div id="natjecanja">
                    <h1 id="naslov17"> Virtualna natjecanja za vježbu</h1>
                    {competitions &&
                        competitions.map((comp) => (
                            <div  key={comp.id}>
                                {(comp.isvirtual) && (
                                    <div className='natjecanje'>
                                        <span className='boja' style={{backgroundColor: mapa.get(comp.id)}}></span>
                                        {comp.name ? (
                                            <p>{comp.name}</p>
                                        ) : (
                                            <p>Natjecanje {comp.id}</p>
                                        )}
                                        <p><ScheduleIcon className='ikona'/> {formatDate(comp.dateTimeOfBeginning) } <EastIcon className='ikona'/> {formatDate(comp.dateTimeOfEnding)}</p>
                                        {isLoggedIn && (
                                            <Link className='joinComp' to={`/competitions/${comp.id}`}> Pokreni vježbu!
                                            </Link>

                                        )}
                                    </div>)}
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};
export default Cal;