import './NoviTasks.css';
import { useEffect, useState } from "react";
import {Link} from "react-router-dom";
import useFetch from "../useFetch";
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import ExtensionIcon from '@mui/icons-material/Extension';
import CasinoIcon from '@mui/icons-material/Casino';

const Tasks = () => {

     const {data:tasks, error} =useFetch('http://localhost:8080/problems')
//u link ubaciti link za dohvat podataka o pojedinom zadatku
    //backend mora provjeravati i povezivati autora i zadatak?? moramo imat sa zadatka link na korisnika koji ga je objavio i obratno,
    // pri zahtjevu za dohvatom podataka o zadatku moraju tu biti i podaci o autoru (bar id i ime i prezime)
    return (
        /*<div className="wrapper">
            { error && <div>{ error }</div> }
            { tasks && <div className="task-list">
                {tasks.map(task => (
                    <div className="task" key={task.id} >
                        <Link to={'/zadaci/'+task.id}><h2>{ task.title }</h2></Link>
                    </div>
                ))}
            </div> }
        </div>*/

        <div className="body1">
            <div className="kategorije">
                <Link to='/tasks/virtual' className="link">
                    <div className="kat">
                        <CasinoIcon sx={{ fontSize: 60 }} color="primary"/>
                        <h3>Kreiraj virtualno natjecanje</h3>
                        <p>**opis**</p>
                    </div>
                </Link>
                <Link to='/tasks/practice' className="link">
                    <div className="kat">
                        <ExtensionIcon sx={{ fontSize: 60 }} color="primary"/>
                        <h3>Zadaci za vježbu</h3>
                        <p>**opis**</p>
                    </div>
                </Link>
                <Link to='/tasks/addTask' className="link">
                    <div className="kat">
                        <AddToQueueIcon sx={{ fontSize: 60 }} color="primary"/>
                        <h3>Dodaj novi zadatak</h3>
                        <p>**opis**</p>
                    </div>
                </Link>
            </div>
        </div>

    );
}

export default Tasks;