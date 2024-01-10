import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Countdown from 'react-countdown';
import './Competition.css'; 
import './SolvingATask.css';
import useFetch from "../useFetch";

const Competition = () => {
  const [competitionInfo, setCompetitionInfo] = useState(null);
  const [task, setTask] = useState(null);
  const [countdownTime, setCountdownTime] = useState(0);

  const [solution, setSolution] = useState('');
  const [testResult, setTestResult] = useState('');
  const [solutionOutput, setSolutionOutput] = useState(''); // New state for solution output
  const [solutionError, setSolutionError] = useState(''); // New state for solution error
  const [userInput, setUserInput] = useState('');

  const { competitionId, taskId } = useParams();
  var competition;
  const {data:competitions, error} = useFetch('http://localhost:8080/competitions');
    if (competitions) {
        competitions.map(c => {
            if(c.id == competitionId) {
                competition = c;
            }
        });
    }
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

  useEffect(() => {
    if (competitionInfo && competitionInfo.length > 0) {
      let totalDuration = 0;

      competitionInfo.forEach((task) => {
        const [minutes, seconds] = task.duration.split(':');
        totalDuration += parseInt(minutes, 10) * 60 + parseInt(seconds, 10);
      });

      setCountdownTime(totalDuration * 1000); // Set the countdown time
    }
  }, [competitionInfo]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdownTime((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prevTime - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchTaskById = async () => {
      try {
        const response = await fetch(`http://localhost:8080/problems/${taskId}`);
        const task = await response.json();
        setTask(task);

      } catch (error) {
        console.error('Error fetching task:', error);
        setTask(null);
      }
    };

    fetchTaskById();
  }, [taskId]);

  const handleTestSolution = async () => {
    try {
      const response = await fetch(`http://localhost:8080/solution/${taskId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
            body: JSON.stringify({ code: solution, input: userInput,  }), // Send code and input
      });
      console.log('Sending request:', response);  // Log the request being sent

 if (response.ok) {
      const result = await response.json();
      const correctOutput = task?.inputOutputExamples?.[userInput]; // Safely access correctOutput

          if (result.error) {
            setTestResult('Failed!');
            setSolutionError(result.error);
            setSolutionOutput('');
            } else if (result.output && correctOutput && result.output.trim() === correctOutput.trim()) {
            setTestResult('Passed!');
            setSolutionOutput(result.output);
            setSolutionError('');
          } else {
            setTestResult('Failed!');
            setSolutionOutput(result.output || '');
            setSolutionError('Output does not match the expected output.');
          }
        } else {
          setTestResult('Failed to test solution');
          setSolutionOutput('');
          setSolutionError('Failed to receive valid response from server');
        }
    } catch (error) {
      console.error('Error testing solution:', error);
      setTestResult('Failed to test solution');
      setSolutionOutput(''); // Reset output on error
      setSolutionError(error.message); // Set error from catch block
    }
  };

  if (!task) {
    return <div>Loading...</div>;
  }
    //NAPRAVIO SAM DA SE POKAŽE COMPETITION NAME KAD RJEŠAVAŠ ZADATAK
  return (
    <div>
      <div className="task-buttons">
          {competition && competition.name ?
                  <p>{competition.name}</p>
               :
                  <p>Natjecanje {competition.id}</p>

          }
        {competitionInfo && competitionInfo.map((task, index) => (
          <Link
            key={task.id}
            to={`/competitions/${competitionId}/${task.id}`}
            className={`${taskId == task.id ? 'task-selected' : 'task-box'}`}
          >
            {index + 1}
          </Link>
        ))}
              <button className="finish-button">Završi Natjecanje</button>

      </div>



      <div className="task-container">
      <div className={`timer ${countdownTime <= 60000 ? 'red' : ''}`}>
        <Countdown
          date={Date.now() + countdownTime}
          onComplete={() => {
            console.log("Time's up!");
            document.querySelector('.finish-button').click();
          }}
          renderer={({ minutes, seconds }) => (
            <span>{`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}</span>
          )}
        />
      </div>
      <h2 className="task-title">{task.title}</h2>

      <div className={`problem-type problem-type-${task.problemType.toLowerCase()}`}>
        {task.problemType}
      </div>
      <p className="task-description">({task.points} pts) <br/> {task.text}</p>

      <textarea
        className="solution-textarea"
        value={solution}
        onChange={(e) => setSolution(e.target.value)}
        placeholder="Ovdje upiši rješenje..."
        rows={10}
      ></textarea>

        <textarea
            className="user-input-textarea"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter input here..."
            rows={5}
        ></textarea>

      <button className="test-button" onClick={handleTestSolution}>Testiraj</button>

      {testResult && <div className="test-result">Test Result: {testResult}</div>}

        <div className="input-output-examples">
        <h3>Input-Output Examples:</h3>
        <ul>
          {Object.entries(task.inputOutputExamples).map(([input, output], index) => (
            <li key={index}>
              <strong>Input:</strong> {input} <strong>Output:</strong> {output}
            </li>
          ))}
        </ul>
      </div>
      {/* Displaying the solution output */}
      {solutionOutput && (
        <div className="solution-output">
          <h3>Output:</h3>
          <pre>{solutionOutput}</pre>
        </div>
      )}
      {/* Displaying the solution error */}
      {solutionError && (
        <div className="solution-error">
          <h3>Error:</h3>
          <pre>{solutionError}</pre>
        </div>
      )}
    </div>
    </div>
  );
};

export default Competition;
