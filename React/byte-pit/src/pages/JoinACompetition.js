import React, { useEffect, useState } from 'react';
import useFetch from '../useFetch';
import { useParams } from 'react-router-dom';

const JoinACompetition = () => {
  const [problems, setProblems] = useState([]);
  const { competitionId } = useParams();
  console.log(`This is the competitionId: ${competitionId}`);

  useEffect(() => {
    console.log('competitionId:', competitionId);
    
    fetch(`http://localhost:8080/competitions/${competitionId}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.error('Error fetching competition problems');
          throw new Error('Error fetching competition problems');
        }
      })
      .then((data) => {
        console.log('Competition Problems:', data);
        setProblems(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [competitionId]);

  return (
    <div>
      <h1>Ok ekipa evo spojeni su zadatci koji su ukljuceni u natjecanje nek neko napravi frontend izvod toga</h1>
      <h1>Competition Problems</h1>
      <ul>
        {problems.map((problem) => (
          <li key={problem.id}>{problem.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default JoinACompetition;
