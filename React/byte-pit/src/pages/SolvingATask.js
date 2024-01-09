import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Countdown from 'react-countdown';
import './SolvingATask.css';
import Cookies from 'universal-cookie';


const SolvingATask = () => {
  const { id } = useParams();
  const taskKey = `startTime_${id}`; // Unique key for each task
  const [task, setTask] = useState(null);
  const [durationMilliseconds, setDurationMilliseconds] = useState(0);
  const [solution, setSolution] = useState('');
  const [testResult, setTestResult] = useState('');
  const [solutionOutput, setSolutionOutput] = useState(''); // New state for solution output
  const [solutionError, setSolutionError] = useState(''); // New state for solution error
  const [userInput, setUserInput] = useState('');
  let fileInputRef = null;
  const [userData, setUserData] = useState(null);

  const cookies = new Cookies();
  const jwtToken = cookies.get('jwt_authorization');

  const handleCountdownComplete = () => {
    // Clear the stored value when countdown completes
    localStorage.removeItem(taskKey);
    setDurationMilliseconds(0);

    if (durationMilliseconds === 0) {
      const [minutes, seconds] = task.duration.split(':');
      const totalMilliseconds = (parseInt(minutes, 10) * 60 + parseInt(seconds, 10)) * 1000;

      setDurationMilliseconds(totalMilliseconds);
      localStorage.setItem(taskKey, Date.now().toString());
    }

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
      const response = await fetch(`http://localhost:8080/solution/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
            body: JSON.stringify({ code: solution, input: userInput }), // Send code and input
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

  const handleSubmitFile = async () => {
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
      formData.append('time', passedTimeInSeconds);
      formData.append('user', userData.username);
      formData.append('problem', task.id)

      const submitResponse = await fetch(`http://localhost:8080/submit/${id}`, {
        method: 'POST',
        body: formData,
      });

      if (submitResponse.ok) {
        // Handle success
        console.log('File submitted successfully');
        // Additional logic if needed after successful submission
      } else {
        // Handle failure
        console.error('Failed to submit file');
      }
    } catch (error) {
      console.error('Error submitting file:', error);
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
        <button className="submit-button" onClick={handleSubmitFile}>
          Predaj
        </button>
      </div>

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
  );
};

export default SolvingATask;
