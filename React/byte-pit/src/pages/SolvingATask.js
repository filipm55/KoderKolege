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
        body: JSON.stringify({ code: solution }),
      });
      console.log('Sending request:', response);  // Log the request being sent

      if (response.ok) {
        const result = await response.json();
        setTestResult('Passed!');
        setSolutionOutput(result.output); // Update the output state with the response from the server
        console.log('Received response:', result);  // Log the received response
      } else {
        setTestResult('Failed to test solution');
        setSolutionOutput(''); // Reset output if the test fails
      }
    } catch (error) {
      console.error('Error testing solution:', error);
      setTestResult('Failed to test solution');
      setSolutionOutput(''); // Reset output on error
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

      <button className="test-button" onClick={handleTestSolution}>Testiraj</button>

      {testResult && <div className="test-result">Test Result: {testResult}</div>}

      {/* Displaying the solution output */}
      {solutionOutput && (
        <div className="solution-output">
          <h3>Output:</h3>
          <pre>{solutionOutput}</pre>
        </div>
      )}
    </div>
  );
};

export default SolvingATask;
