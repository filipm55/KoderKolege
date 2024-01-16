import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Countdown from 'react-countdown';
import './SolvingATask.css';
import Cookies from 'universal-cookie';


const SolvingATask = () => {
  const { id } = useParams();
  const taskKey = `startTime_${id}`;
  const [task, setTask] = useState(null);
  const [durationMilliseconds, setDurationMilliseconds] = useState(0);
  const [solution, setSolution] = useState('');
  const [testResult, setTestResult] = useState('');
  const [solutionOutput, setSolutionOutput] = useState('');
  const [solutionError, setSolutionError] = useState('');
  const [userInput, setUserInput] = useState('');
  let fileInputRef = null;
  const [userData, setUserData] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState('');
  const [buttonClicked, setButtonClicked] = useState(false); 
  const [pointsFinal, setPoints] = useState(null);
  const [outputResults, setOutputResults] = useState(null)


  const cookies = new Cookies();
  const jwtToken = cookies.get('jwt_authorization');

  const handleCountdownComplete = () => {
    localStorage.removeItem(taskKey);
    setDurationMilliseconds(0);

  };


  useEffect(() => {
    const fetchTaskById = async () => {
      try {
        const response = await fetch(`http://localhost:8080/problems/${id}`);
        const task = await response.json();

        const [minutes, seconds] = task.duration.split(':');
        const totalMilliseconds = (parseInt(minutes, 10) * 60 + parseInt(seconds, 10)) * 1000;

        setTask(task);
        setDurationMilliseconds(totalMilliseconds);

        const storedTime = parseInt(localStorage.getItem(taskKey));
        if (storedTime && storedTime > 0) {
          const elapsedTime = Date.now() - storedTime;
          const remainingTime = totalMilliseconds - elapsedTime;
          if (remainingTime > 0) {
            setDurationMilliseconds(remainingTime);
          } else {
            setDurationMilliseconds(0);
          }
        } else {
          localStorage.setItem(taskKey, Date.now().toString());
          window.location.reload();
        }
      } catch (error) {
        console.error('Error fetching task:', error);
        setTask(null);
        setDurationMilliseconds(0);
      }
    };

    fetchTaskById();
  }, [id, taskKey]);

useEffect(() => {
          if (jwtToken) {
              const fetchData = async () => {
                  try {
                      const url = `http://localhost:8080/users/${jwtToken}`;
                      const response = await fetch(url);
                      const data = await response.json();
                      setUserData(data);
                  } catch (error) {
                      console.error(error);
                  }
              };

              fetchData();
          } else {
          }
      }, [jwtToken]);

  const handleTestSolution = async () => {
    const storedTime = parseInt(localStorage.getItem(taskKey));
    const [minutes, seconds] = task.duration.split(':');
    const totalMilliseconds = (parseInt(minutes, 10) * 60 + parseInt(seconds, 10)) * 1000;
        if (storedTime && storedTime > 0) {
          const elapsedTime = Date.now() - storedTime;
          const remainingTime = totalMilliseconds - elapsedTime;
          if (remainingTime > 0) {
            setDurationMilliseconds(remainingTime);
          } else {
            setDurationMilliseconds(0);
          }
        } else {
          localStorage.setItem(taskKey, Date.now().toString());
        }


    try {
        const regex = /(public\s+)?class\s+(\w+)/;
        const match = solution.match(regex);
        var newSolution;
        if (match && match[2]) {
            // match[1] contains the first word after 'public class'
            const oldClassName = match[2];
            // Replace the old class name with a new class name
            const newClassName = "TempClass" + id;
            newSolution = solution.replace(oldClassName, newClassName);
        }

      const response = await fetch(`http://localhost:8080/solution/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
            body: JSON.stringify({ code: newSolution, input: userInput }),
      });
      console.log('Sending request:', response);

 if (response.ok) {
      const result = await response.json();
      const correctOutput = task?.inputOutputExamples?.[userInput];

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
      setSolutionOutput('');
      setSolutionError(error.message);
    }
  };

  const handleSubmitFile = async () => {
    setButtonClicked(true);
    if (!fileInputRef || !fileInputRef.files || fileInputRef.files.length === 0) {
      console.error('No file uploaded');
      return;
    }

    const uploadedFile = fileInputRef.files[0];

    try {
      const timerElement = document.querySelector('.timer span');
    const currentTime = timerElement.innerText;

    const [currentMinutes, currentSeconds] = currentTime.split(':').map(Number);

    const [totalMinutes, totalSeconds] = task.duration.split(':').map(Number);

    const passedMinutes = totalMinutes - currentMinutes;
    const passedSeconds = totalSeconds - currentSeconds;

    const passedTimeInSeconds = passedMinutes * 60 + passedSeconds;
    console.log(passedTimeInSeconds)

      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('time', 1)
      formData.append('user', userData.username);
      formData.append('problem', task.id)
      formData.append('competition_id', "0")

      const submitResponse = await fetch(`http://localhost:8080/submit/${id}`, {
        method: 'POST',
        body: formData,
      });

      if (submitResponse.ok) {
        const responseData = await submitResponse.json();        
      
        console.log("response:", responseData);                                       // znaci ovo je objekt s atributima points i outputresults koji je mapa
        console.log("points",responseData.points);
        setPoints(responseData.points);
        setOutputResults(responseData.outputResults);
        setSubmissionStatus('File submitted successfully');
      } else {
        setSubmissionStatus('Failed to submit file');
      }
    } catch (error) {
      console.error('Error submitting file:', error);
      setSubmissionStatus(`Error submitting file: ${error.message}`);
    }
  };

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <div className="task-container">
      <div className="timer">
        <Countdown
          date={Date.now() + durationMilliseconds}
          onComplete={handleCountdownComplete}
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

        <div className='input-container'>
        <textarea
            className="user-input-textarea"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter input here..."
            rows={5}
        ></textarea>

      <button className="test-button" onClick={handleTestSolution}>Testiraj</button>
      </div>

      <div className="upload-container">
        <input
          type="file"
          ref={(ref) => (fileInputRef = ref)}
          className="file-uploader"
        />
        <button
          className={`submit-button ${buttonClicked ? 'disabled' : ''}`}
          onClick={handleSubmitFile}
          disabled={buttonClicked}
        >
          Predaj
        </button>
      </div>
      {submissionStatus && <div className="submission-status">{submissionStatus}</div>}
      {pointsFinal !== null && <div className='bodovi'>Bodovi: {pointsFinal}</div>}

      {outputResults && (
        <div className="output-results">
          <h3>Output Results:</h3>
          <ul>
            {Object.entries(outputResults).map(([expected, actual], index) => (
              <li
                key={index}
                style={{ color: expected === actual ? 'green' : 'red' }}
              >
                <strong>Correct output:</strong> {expected} --- <strong>My output:</strong> {actual}
              </li>
            ))}
          </ul>
        </div>
      )}

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
  );
};

export default SolvingATask;
