import './Calendar.css';
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';

import useFetch from "../useFetch";
import { type } from '@testing-library/user-event/dist/type';
import { parseISO } from 'date-fns';

const Cal = () => {
    //convertanje u datum ne radi, treba drugacije slat podatke ili ih drugacije convertat
    //bavit cu se time sutra

    const {data:competitions, error} = useFetch('http://localhost:8080/competitions');

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
    const isCompetitionUpcoming = (comp) => {
        const currentDateTime = new Date();
        const compStartDate = new Date(formatDate(comp.dateTimeOfBeginning));
        const compEndDate = new Date(formatDate(comp.dateTimeOfEnding));

        return currentDateTime < compEndDate;
    };
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
                            <p key={index} style={{ color: 'red' }}>{comp.id}</p>
                        ))}
                    </div>
                );
            }
            return null;
        }
        else return null;
    };

    return (
        <div className="body">
            <div style={{ display: 'flex' }}>
                <div style={{ flex: 1 }}>
                    <Calendar tileContent={tileContent} />
                </div>
                <div style={{ flex: 1 }}><h2>  Nadolazeća i aktualna natjecanja</h2>
                    {competitions &&
                        competitions.map((comp) => (
                            <div key={comp.id}>
                                {isCompetitionUpcoming(comp) && (
                                <p>ID: {comp.id} Start time: {formatDate(comp.dateTimeOfBeginning)} End time: {formatTime(comp.dateTimeOfEnding[3]) + ":" + formatTime(comp.dateTimeOfEnding[4])}
                                
                                    {isCompetitionActive(comp) && (
                                        <button onClick={() => console.log("klik")}>
                                            Participate Now
                                        </button>
                                    )}
                                </p>)}
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};
export default Cal;