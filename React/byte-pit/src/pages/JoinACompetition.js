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

  useEffect(() => {
    if(userData && userData.id && competitionId){
      const fetchData = async () => {
        try{
          fetch(`http://localhost:8080/competitions/${competitionId}/competitors/${userData.id}`)
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
          console.log("OVJDE SAM");
        }
      }
      fetchData();
    }

  }, [userData, competitionId]);

  useEffect(() => {
    fetch(`http://localhost:8080/competitions/${competitionId}`)
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
    console.log(pristupio);
    // Redirect to the first problem of the competition
    if (competitionInfo && competitionInfo.length > 0 && !pristupio && userData) {
      await fetch(`http://localhost:8080/competitions/${competitionId}/competitors/${userData.id}`, {
        method: 'PUT'
      })
      const firstProblemId = competitionInfo[0].id; // Assuming the first problem's ID is used
      window.location.href = `/competitions/${competitionId}/${firstProblemId}`;
    } else {
      console.error('No problems found in the competition');
      // You can handle this case, maybe show an error message
    }
  };
if (!isLoggedIn){
  return <p>FORBIDDEN</p>
}
if(pristupio){
  return <p>VEC STE PRISTUPILI NATJECANJU!</p>
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
    </div>
  );
};

export default JoinACompetition;
