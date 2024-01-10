import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Competition.css'; 
import './SolvingATask.css';
import useFetch from "../useFetch";
import Cookies from 'universal-cookie';


const Competition = () => {
    const { competitionId, taskId } = useParams();
    const [fetchError, setFetchError] = useState(false);
    const {data:competition, error} = useFetch(`http://localhost:8080/competitions/competition/${competitionId}`);
  const [competitionInfo, setCompetitionInfo] = useState(null);
  const [task, setTask] = useState(null);

  const [solution, setSolution] = useState('');
  const [testResult, setTestResult] = useState('');
  const [solutionOutput, setSolutionOutput] = useState(''); // New state for solution output
  const [solutionError, setSolutionError] = useState(''); // New state for solution error
  const [userInput, setUserInput] = useState('');
  let fileInputRef = null;
  const [userData, setUserData] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState('');
  const [solvedTasks, setSolvedTasks] = useState(null)

  const cookies = new Cookies();
  const jwtToken = cookies.get('jwt_authorization');

  //const [submittedTasks, setSubmittedTasks] = useState([]);
  //const [isSubmitting, setIsSubmitting] = useState()


  useEffect(() => {
    fetch(`http://localhost:8080/competitions/${competitionId}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
            setFetchError(true);
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
    const fetchTaskById = async () => {

            try {
                const response = await fetch(`http://localhost:8080/problems/${taskId}`);
                const task = await response.json();
                setTask(task);
                //setIsSubmitting(false)

            } catch (error) {
                console.error('Error fetching task:', error);
                setTask(null);
            }
    };

    fetchTaskById();
  }, [taskId]);

  useEffect(() => {

    const fetchDataByTaskUser = async () => {

      try {
          const response = await fetch(`http://localhost:8080/problems/${competitionId}/${userData.id}`);
          const solvedTasks = await response.json();
          setSolvedTasks(solvedTasks);

      } catch (error) {
          console.error('Error fetching task:', error);
          setSolvedTasks(null);
      }
};

    fetchDataByTaskUser();
  }, [taskId, competitionId]);

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
    try {
      const response = await fetch(`http://localhost:8080/solution/${taskId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
            body: JSON.stringify({ code: solution, input: userInput }),
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
    if (!fileInputRef || !fileInputRef.files || fileInputRef.files.length === 0 /*|| isSubmitting*/) {
      console.error('Niste uploadali datoteku ili ste već predali svoje rješenje...');
      return;
    }

    const uploadedFile = fileInputRef.files[0];

    try {

      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('time', 2)
      formData.append('user', userData.username);
      formData.append('problem', task.id)

      const submitResponse = await fetch(`http://localhost:8080/submit/${taskId}`, {
        method: 'POST',
        body: formData,
      });

      if (submitResponse.ok) {
        setSubmissionStatus('File submitted successfully');
        //setIsSubmitting(true); // Set submission in progress
        //setSubmittedTasks([...submittedTasks, task.id]);
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
  if (fetchError) { //AKO POKUSAS PRISTUPIT NATJECANJU KOJE SE TRENUTNO NE ODRZAVA
        return <div>FORBIDDEN</div>;
    }
    //NAPRAVIO SAM DA SE POKAŽE COMPETITION NAME KAD RJEŠAVAŠ ZADATAK
  return (
    <div>
      <h1 className="competition-title">
      {competition && competition.name ? competition.name : `Natjecanje ${competitionId}`}
      </h1>
      <div className="task-buttons">
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
        <button className="submit-button" onClick={handleSubmitFile} /*disabled={submittedTasks.includes(task.id)}*/>
        {/*submittedTasks.includes(task.id) ? 'Submitting...' :*/ 'Predaj'}
        </button>
      </div>
      {submissionStatus && <div className="submission-status">{submissionStatus}</div>}


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
