import React, { useState } from "react";
import './Calendar.css';
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import useFetch from "../useFetch";

const Cal = () => {
    const {data:competitions, error} = useFetch('http://localhost:8080/competitions');
    console.log(competitions);

    const tileContent = ({ date, view }) => {
        // Check if the date falls within the start and end dates of any competition
        if(competitions){
            const competition = competitions.find(comp => date >= comp.start && date <= comp.end);
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