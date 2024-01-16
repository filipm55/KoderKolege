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
  const [competitionId, setCompetitionId] = useState(null);

  const pickRandomTasks = (tasks, count) => {
  const publicTasks = tasks.filter(task => !task.isPrivate);

  const shuffledTasks = publicTasks.sort(() => 0.5 - Math.random());

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


          const currentDateTime1 = new Date().toLocaleString('en-US', { timeZone: 'Europe/Zagreb' });
          const currentDateTime = new Date(currentDateTime1);
          currentDateTime.setHours(currentDateTime.getHours()+1);
          const dateTimeOfEnding = new Date(currentDateTime);
          dateTimeOfEnding.setHours(dateTimeOfEnding.getHours() + 2);

          const formattedDateTimeOfBeginning = new Date(currentDateTime).toISOString();
          const formattedDateTimeOfEnding = dateTimeOfEnding.toISOString();

          formData.append('name', "Virtualno");
          formData.append('dateTimeOfBeginning', formattedDateTimeOfBeginning);
          formData.append('dateTimeOfEnding', formattedDateTimeOfEnding);
          formData.append('numberOfProblems', 5);
          formData.append('trophyPicture', trophyPictureFile);
          formData.append('problems', problemsArray);
          formData.append('isvirtual', Boolean(true));
          formData.append('competitionMaker', adminUser.id);

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
              const competitionIdMatch = data.match(/s id-om:\s*(\d+)/);
              if (competitionIdMatch && competitionIdMatch[1]) {
                setCompetitionId(competitionIdMatch[1]);
                //console.log('Competition ID:', competitionId);
              } else {
                console.error('Unable to extract competition ID from the message');
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

  
  const startCompetition = async () => {
    if (competitionInfo && competitionInfo.length > 0) {
      const firstProblemId = competitionInfo[0].id; // Assuming the first problem's ID is used
      if (competitionId) {
        await fetch(`http://localhost:8080/competitions/${competitionId}/competitors/${adminUser.id}`, {
          method: 'PUT'
        }).then(response => {

        })
        console.log("OVJDE SAM");
        window.location.href = `/competitions/${competitionId}/${firstProblemId}`;
      }
    } else {
      console.error('No problems found in the competition');
    }
  };

  
  return (
    <div className="competition-container">
      {competitionInfo && adminUser && (
        <div className="competition-details">
          <p className="competition-disclaimer">
            May the odds be ever in your favour.
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
