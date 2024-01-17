import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Competition.css'; 
import './SolvingATask.css';
import Timer from './Timer';
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
  const [solutionOutput, setSolutionOutput] = useState(''); 
  const [solutionError, setSolutionError] = useState(''); 
  const [userInput, setUserInput] = useState('');
  let fileInputRef = null;
  const [userData, setUserData] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState('');
  const [solvedTasks, setSolvedTasks] = useState([])

  const cookies = new Cookies();
  const jwtToken = cookies.get('jwt_authorization');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [time, setTime] = useState(null)

    console.log(competition);

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
        //console.log('Competition Info:', data);
        setCompetitionInfo(data);

      })
      .catch((error) => {
        console.error('Error:', error);
      });

  }, [competitionId]);



  useEffect(() => {
    if (jwtToken) {
        setIsLoggedIn(true);
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



  useEffect(() => {
    const fetchDataByTaskUser = async () => {

      try {
        if(userData) {
          const response = await fetch(`http://localhost:8080/problems/${competitionId}/${userData.username}`);
          const solvedTasks = await response.json();
          setSolvedTasks(solvedTasks);
          console.log(solvedTasks)
          console.log(solvedTasks.includes(Number(taskId)))
        }

      } catch (error) {
          console.error('Error fetching task:', error);
          setSolvedTasks([]);
      }
};

const fetchTime = async () => {
  try {
    if(userData) {
      const response = await fetch(`http://localhost:8080/competitions/${competitionId}/competitors/${userData.id}/time`);
      const timeResponse = await response.json();
      setTime(timeResponse);
      console.log(timeResponse);
    }

  } catch (error) {
      console.error('Error fetching time:', error);
      handleTimeExpired();
  }
};

    fetchTime();
    fetchDataByTaskUser();
  }, [competitionId, userData]);


  const handleTestSolution = async () => {
    try {
        const regex = /(public\s+)?class\s+(\w+)/;
        const match = solution.match(regex);
        var newSolution;
        if (match && match[2]) {
            const oldClassName = match[2];
            const newClassName = "TempClass" + taskId;
            newSolution = solution.replace(oldClassName, newClassName);
        }
      const response = await fetch(`http://localhost:8080/solution/${taskId}`, {
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
    if (!fileInputRef || !fileInputRef.files || fileInputRef.files.length === 0) {
      console.error('Niste uploadali datoteku ili ste već predali svoje rješenje...');
      return;
    }

    const uploadedFile = fileInputRef.files[0];

    try {

      const formData = new FormData();

      const storedDateTime = cookies.get('startTime');
      const startDateTime = new Date(storedDateTime);

      let timeDifference = Date.now() - startDateTime;
      console.log(timeDifference)

      formData.append('file', uploadedFile);
      formData.append('time', timeDifference)
      formData.append('user', userData.username);
      formData.append('problem', task.id)
      formData.append('competition_id', competitionId)

      const formDataObject = {};
      formData.forEach((value, key) => {
        formDataObject[key] = value;
      });
      console.log(JSON.stringify(formDataObject, null, 2));



      const submitResponse = await fetch(`http://localhost:8080/submit/${taskId}`, {
        method: 'POST',
        body: formData,
      });

      if (submitResponse.ok) {
        setSubmissionStatus('File submitted successfully');
      } else {
        setSubmissionStatus('Failed to submit file');
      }

      window.location.reload();

    } catch (error) {
      console.error('Error submitting file:', error);
      setSubmissionStatus(`Error submitting file: ${error.message}`);
    }

      
        try {
          const response = await fetch(`http://localhost:8080/rank/${competitionId}/${userData.username}`, {
              method: 'POST'
          });
  
          if (response.ok) {
              console.log('Ranking calculated successfully');
          } else {
              console.error('Failed to calculate ranking');
          }
        } catch (error) {
            console.error('Error finishing competition:', error);
        }

    };

const handleFinishCompetition = async () => {
    const userConfirmed = window.confirm("Jeste li sigurni da želite završiti s natjecanjem?");

    if (userConfirmed) {
        if (competition.isvirtual === false) {
            window.location.href = `/finishcompetition`;
        } else {
            try {
                const response = await fetch(`http://localhost:8080/virtual/rank/${competitionId}/${userData.username}`, {
                    method: 'POST'
                });

                if (response.ok) {
                    const virtualCompRanks = await response.json();
                    console.log(virtualCompRanks);
                    window.location.href = '/virtual/rank/${competitionId}/${userData.username}';
                } else {
                    console.error('Failed to retrieve virtual competition ranks');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }
};


const handleTimeExpired = async () => {
    if (competition.isvirtual===false) window.location.href = `/finishcompetition`;
    else window.location.href = `/virtual/rank/${competitionId}/${userData.username}`
};


  if (!task) {
    return <div>Loading...</div>;
  }
  if (fetchError || !isLoggedIn) { 
        return <div>FORBIDDEN</div>;
    }

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
              <button className="finish-button" onClick={handleFinishCompetition}>Završi Natjecanje</button>

      </div>

      <div className="task-container">
      {competition && time && (
        <div className="timer">
          <Timer endTime={time} onTimerExpired={handleTimeExpired} />
        </div>
      )}
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
          className={`submit-button ${solvedTasks.includes(Number(taskId)) ? 'disabled' : ''}`}
          onClick={handleSubmitFile}
          disabled={solvedTasks.includes(Number(taskId)) && competition && !competition.isvirtual}
        >
        {'Predaj'}
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