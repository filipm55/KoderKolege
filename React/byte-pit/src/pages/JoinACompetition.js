import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './JoinACompetition.css';
import Cookies from "universal-cookie";


const JoinACompetition = () => {
  const [competitionInfo, setCompetitionInfo] = useState(null);
  const { competitionId } = useParams();

  const cookies = new Cookies();
  const jwtToken = cookies.get('jwt_authorization');
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [pristupio, setPristupio] = useState(false);

  useEffect(() => {
    if (jwtToken) {
      setIsLoggedIn(true);
      const fetchData = async () => {
        try {
          const url = `https://bytepitb-myjy.onrender.com/users/${jwtToken}`;
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

  useEffect(() => {
    if(userData && userData.id && competitionId){
      const fetchData = async () => {
        try{
          fetch(`https://bytepitb-myjy.onrender.com/competitions/${competitionId}/competitors/${userData.id}`)
              .then(response => {
                if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json(); // Ovdje moramo parsirati JSON neovisno o tipu odgovora
              }) .then(data => {
            // Ovdje sada radimo s podacima, koji su izvučeni iz JSON formata
            if (data === true) {
              setPristupio(true);
            } else {
              setPristupio(false);
            }
          })
        }catch(error){
        }
      }
      fetchData();
    }

  }, [userData, competitionId]);

  useEffect(() => {
    fetch(`https://bytepitb-myjy.onrender.com/competitions/${competitionId}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.error('Error fetching competition info');
          throw new Error('Error fetching competition info');
        }
      })
      .then((data) => {
        console.log('Competition Info:', data);
        setCompetitionInfo(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [competitionId]);

  const startCompetition = async () => {
    if (competitionInfo && competitionInfo.length > 0 && !pristupio && userData) {
      const currentDate = new Date();
      cookies.set('startTime', currentDate.toISOString(), { path: '/' });
      
      await fetch(`https://bytepitb-myjy.onrender.com/competitions/${competitionId}/competitors/${userData.id}`, {
        method: 'PUT'
      })
      const firstProblemId = competitionInfo[0].id; // Assuming the first problem's ID is used
      window.location.href = `/competitions/${competitionId}/${firstProblemId}`;
    } else {
      console.error('No problems found in the competition');
    }
  };
if (!isLoggedIn){
  return <p>FORBIDDEN</p>
}
if(pristupio){
  return <div className="competition-container">
          <div className="competition-details">
            <p className="competition-disclaimer" id="pristup">VEĆ STE PRISTUPILI NATJECANJU!</p>
            </div></div>
}
  return (
    <div className="competition-container">
      {competitionInfo && (
        <div className="competition-details">
          <p className="competition-disclaimer">
          Pokretanjem ovog natjecanja, jasno se obvezujem da neću koristiti bilo kakve oblike varanja ili umjetne inteligencije kako bih osigurao/la poštenu igru za sve sudionike.
          </p>
          <button className="start-button" onClick={startCompetition}>
            Pokreni Natjecanje
          </button>
        </div>       
      )}
      {competitionInfo && (
        <div className="competition-details" id="napomene">
          <h1>Napomene</h1>
          <li>Jednom kada za neki zadatak predate file, više nećete moći uploadati novi pokušaj rješavanja.</li>
          <li>Zato je preporučeno koristiti opciju testiranja koda pomoću playgrounda za testiranje. Provjerite da vam testni primjeri vraćaju očekivani output.</li>
          <li>Na broj bodova koji se u natjecanjima ostvaruju utječe vrijeme rješavanja.</li>
          <li>Svaki zadatak za koji napravite upload utjecat će na vašu natjecateljsku statistiku</li>
          <h3>May the odds be ever in your favour</h3>
        </div>
)}
    </div>
  );
};

export default JoinACompetition;
