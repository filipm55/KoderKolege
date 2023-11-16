import './Tasks.css';
import { useEffect, useState } from "react";
import {Link} from "react-router-dom";
import useFetch from "../useFetch";

const Tasks = () => {

     const {data:tasks, error} =useFetch('https://bytepitb.onrender.com/problems')
//u link ubaciti link za dohvat podataka o pojedinom zadatku
    //backend mora provjeravati i povezivati autora i zadatak?? moramo imat sa zadatka link na korisnika koji ga je objavio i obratno,
    // pri zahtjevu za dohvatom podataka o zadatku moraju tu biti i podaci o autoru (bar id i ime i prezime)
    return (
        <div className="wrapper">
            { error && <div>{ error }</div> }
            { tasks && <div className="task-list">
                {tasks.map(task => (
                    <div className="task" key={task.id} >
                        <Link to={'/zadaci/'+task.id}><h2>{ task.title }</h2></Link>
                    </div>
                ))}
            </div> }
        </div>
    );
}

export default Tasks;