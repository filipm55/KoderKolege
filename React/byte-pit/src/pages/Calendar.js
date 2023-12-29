import './Calendar.css';
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';

import useFetch from "../useFetch";

const Cal = () => {
    //convertanje u datum ne radi, treba drugacije slat podatke ili ih drugacije convertat
    //bavit cu se time sutra

    const {data:competitions, error} = useFetch('http://localhost:8080/competitions');
    console.log(competitions);

    const tileContent = ({ date, view }) => {
        // Check if the date falls within the start and end dates of any competition
        if(competitions){
            const competition = competitions.find(comp => {
                const compStartDate = new Date(...comp.dateTimeOfBeginning);
                const compEndDate = new Date(...comp.dateTimeOfEnding);
                console.log(compStartDate);
                return date >= compStartDate && date <= compEndDate;
            });
            if (competition) {
                // If there is a competition on this date, display its title
                return (
                    <p style={{ color: 'red' }}>{competition.title}</p>
                );
            }
            return null;
        }
        else return null;
    };

    return (
        <div className="body">
        <Calendar
            tileContent={tileContent}
        />
        </div>
);
}
export default Cal;