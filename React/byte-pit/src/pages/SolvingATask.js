
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const SolvingATask = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    const fetchTaskById = async () => {
      try {
        const response = await fetch(`http://localhost:8080/problems/${id}`);
        const task = await response.json();
        setTask(task);
      } catch (error) {
        console.error('Error fetching task:', error);
        setTask(null);
      }
    };

    fetchTaskById();
  }, [id]); // Run the effect whenever the 'id' parameter changes

  if (!task) {
    return <div>Loading...</div>; // or handle the case where the task is not found
  }
  console.log(task);
  return (
    <div>
      <h2>{task.title}</h2>
      <p>Task Text: <br></br>{task.text}</p>
    </div>
  );
};

export default SolvingATask;

