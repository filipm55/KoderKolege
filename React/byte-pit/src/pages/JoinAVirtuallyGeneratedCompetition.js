import React, { useEffect, useState, useCallback } from 'react';
import './JoinACompetition.css'; 
import Cookies from 'universal-cookie';
import useFetch from "../useFetch";

const JoinACompetition = () => {

  const [competitionInfo, setCompetitionInfo] = useState(null);
  const [fetchError, setFetchError] = useState(false);
  const [randomlyPickedTasks, setRandomlyPickedTasks] = useState([]);
  const [message, setMessage] = useState('');
  const [adminUser, setAdmin] = useState(null);
  const [competitionCreated, setCompetitionCreated] = useState(false);
  const [processStarted, setProcessStarted] = useState(false);

  const pickRandomTasks = (tasks, count) => {
    const shuffledTasks = tasks.sort(() => 0.5 - Math.random());
    return shuffledTasks.slice(0, count);
  };

  const fetchAdminUser = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8080/users/getadmin');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const adminUserData = await response.json();
      setAdmin(adminUserData);
    } catch (error) {
      console.error('Error:', error);
    }
  }, []);

  useEffect(() => {
    fetchAdminUser();
  }, [fetchAdminUser]);

  useEffect(() => {
    if (!processStarted && adminUser) {
      setProcessStarted(true); // Ensure that the process runs only once

      fetch('http://localhost:8080/problems')
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            setFetchError(true);
            console.error('Error fetching problems');
            throw new Error('Error fetching problems');
          }
        })
        .then((problems) => {
          const randomtasks = pickRandomTasks(problems, 5);
          setRandomlyPickedTasks(randomtasks);
          setCompetitionInfo(randomtasks);

          const formData = new FormData();
          const currentTime = new Date();
          const twoHoursFromNow = new Date(currentTime.getTime() + 2 * 60 * 60 * 1000);
          const problemsArray = Array.from(new Set(randomtasks.map(problem => problem.id)));
          const trophyPictureFile = new Blob([], { type: 'image/png' });

          formData.append('name', "Virtualno");
          formData.append('competitionMaker', adminUser.id);
          formData.append('dateTimeOfBeginning', "2024-01-05T00:00:00");
          formData.append('dateTimeOfEnding', "3000-01-01T00:00:00");
          formData.append('numberOfProblems', 5);
          formData.append('trophyPicture', trophyPictureFile);
          formData.append('problems', problemsArray);
          formData.append('isvirtual', Boolean(true));

          console.log('FormData:');
          for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
          }

          fetch('http://localhost:8080/competitions', {
            method: 'POST',
            body: formData,
          })
            .then(response => {
              const contentType = response.headers.get('content-type');
              if (contentType && contentType.includes('application/json')) {
                return response.json();
              } else {
                return response.text();
              }
            })
            .then(data => {
              console.log('Success:', data);
              if (typeof data === 'object') {
                setMessage('');
              } else {
                setMessage(data);
              }
            })
            .catch((error) => {
              console.error('Error:', error);
            });

          setCompetitionCreated(true);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, [adminUser, processStarted]);
  
  return (
    <div className="competition-container">
      {competitionInfo && adminUser && (
        <div className="competition-details">
          <p className="competition-disclaimer">
            May the odds be ever in your favour.
          </p>
          <button className="start-button" >
            Pokreni Natjecanje
          </button>
        </div>
      )}
    </div>
  );
};

export default JoinACompetition;
