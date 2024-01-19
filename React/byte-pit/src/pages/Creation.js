import './Creation.css';
import { useEffect, useState } from "react";
import {Link} from "react-router-dom";
import useFetch from "../useFetch";
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import ExtensionIcon from '@mui/icons-material/Extension';
import CasinoIcon from '@mui/icons-material/Casino';
import Cookies from 'universal-cookie';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const Creation = () => {

     const {data:tasks, error} =useFetch('http://localhost:8080/problems');
//u link ubaciti link za dohvat podataka o pojedinom zadatku
    //backend mora provjeravati i povezivati autora i zadatak?? moramo imat sa zadatka link na korisnika koji ga je objavio i obratno,
    // pri zahtjevu za dohvatom podataka o zadatku moraju tu biti i podaci o autoru (bar id i ime i prezime)
    const [userData, setUserData] = useState(null);
    const cookies = new Cookies();
    const jwtToken = cookies.get('jwt_authorization');

    useEffect(() => {
        if (jwtToken) {    
          const fetchData = async () => {
            try {
              const url = `http://localhost:8080/users/${jwtToken}`;
              const response = await fetch(url);
              const data = await response.json();
              setUserData(data); // Set user data fetched from the backend
            } catch (error) {
              // Handle error if needed
              console.error(error);
            }
          };
    
          fetchData();
        } else {
        }
      }, [jwtToken]);
    
    return (

        <div className="body1">
            <div className="kategorije">
                <Link to='/createCompetition' className="link">
                    <div className="kat">
                        <CasinoIcon sx={{ fontSize: 60 }} color="primary"/>
                        <h3>Kreiraj  natjecanje</h3>
                        <div className='opisKat' id="poseban2">
                            <PlayArrowIcon className='ikona'/>
                            <p className='opis' id ="drugi">Stvori novo natjecanje </p>
                        </div>
                    </div>
                </Link>
                <Link to='/tasks/addTask' className="link">
                    <div className="kat">
                        <AddToQueueIcon sx={{ fontSize: 60 }} color="primary"/>
                        <h3>Dodaj novi zadatak</h3>
                        <div className='opisKat' id="poseban2">
                            <PlayArrowIcon className='ikona'/>
                            <p className='opis' id ="drugi" >Stvori novi privatan ili javan zadatak</p>
                        </div>
                    </div>
                </Link>
            </div>
        </div>

    );
}

export default Creation;