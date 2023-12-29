import React, { useState } from "react";
import './Calendar.css';
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';


const Cal = () => {
    return ( 
        <div className="body">
            <Calendar></Calendar>
        </div>
    );
}
 
export default Cal;