import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './JoinACompetition.css'; 


const JoinACompetition = () => {
  const [competitionInfo, setCompetitionInfo] = useState(null);
  const { competitionId } = useParams();

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

  const startCompetition = () => {
    // Redirect to the first problem of the competition
    if (competitionInfo && competitionInfo.length > 0) {
      const firstProblemId = competitionInfo[0].id; // Assuming the first problem's ID is used
      window.location.href = `/competitions/${competitionId}/${firstProblemId}`;
    } else {
      console.error('No problems found in the competition');
      // You can handle this case, maybe show an error message
    }
  };

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
