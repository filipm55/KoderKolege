import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Countdown from 'react-countdown';
import './SolvingATask.css';

const SolvingATask = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [durationMilliseconds, setDurationMilliseconds] = useState(0);

  const [solution, setSolution] = useState('');
  const [testResult, setTestResult] = useState('');
  const [solutionOutput, setSolutionOutput] = useState(''); // New state for solution output
  const [solutionError, setSolutionError] = useState(''); // New state for solution error
  const [userInput, setUserInput] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  useEffect(() => {
    const fetchTaskById = async () => {
      try {
        const response = await fetch(`http://localhost:8080/problems/${id}`);
        const task = await response.json();

        const [minutes, seconds] = task.duration.split(':');
        const totalMilliseconds = (parseInt(minutes, 10) * 60 + parseInt(seconds, 10)) * 1000;

        setTask(task);
        setDurationMilliseconds(totalMilliseconds);
      } catch (error) {
        console.error('Error fetching task:', error);
        setTask(null);
        setDurationMilliseconds(0);
      }
    };

    fetchTaskById();
  }, [id]);

  const handleTestSolution = async () => {
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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setUploadedFile(file);
  };

  const handleSubmitFile = async () => {
    if (!uploadedFile) {
      console.error('No file uploaded');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);

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
          onComplete={() => console.log('Time\'s up!')}
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
          onChange={handleFileUpload}
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
