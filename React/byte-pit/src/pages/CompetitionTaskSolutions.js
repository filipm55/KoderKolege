import CompetitionsResult from "./CompetitionsResults";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import useFetch from "../useFetch";

const CompetitionTaskSolutions = () => {
   const { id } = useParams();
    const [problems, setProblems] = useState([]);
    const users = [
        { id: 1, name: "John", surname: "Doe" },
        { id: 2, name: "Alice", surname: "Johnson" },
        { id: 3, name: "Bob", surname: "Smith" },
        { id: 4, name: "Eva", surname: "Brown" },
        // Add more users as needed
    ];
    const correct_ids=[1,2,3];
    const {data:competition} = useFetch(`http://localhost:8080/competitions/competition/${id}`);

    useEffect(() => {
        // Fetch data inside useEffect
        fetch(`http://localhost:8080/competitions/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setProblems(data)

                // Do something with the problems here
            })
            .catch(error => {
                console.error('Error fetching problems:', error);
                // Handle error here
            });
    }, []);

    const [expandedProblems, setExpandedProblems] = useState([]);

    const toggleProblem = (problemId) => {
        setExpandedProblems((prevExpanded) => {
            if (prevExpanded.includes(problemId)) {
                return prevExpanded.filter((id) => id !== problemId);
            } else {
                return [...prevExpanded, problemId];
            }
        });
    };

    return (
        <table>
            <thead>
            <tr>
                <th>Problem</th>
            </tr>
            </thead>
            <tbody>
            {problems.map((problem) => (
                <tr key={problem.id}>
                    <td onClick={() => toggleProblem(problem.id)} style={{ cursor: "pointer" }}>
                        {problem.title}
                    </td>
                    <td>
                        {expandedProblems.includes(problem.id) && (
                            <table>
                                {users
                                    /*.filter((user) => user.problemId === problem.id)*/
                                    .map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.name} {user.surname}</td>
                                            {/*nesto cime provjerimo je li user tocno rijesio zadatak i smije li dohvatiti rjesenje
                                            correct.includes(problem.id) &&*/
                                                <td><button onClick={() => console.log(`Button clicked for ${user.name}`)}>
                                                Dohvati rješenje
                                            </button></td>}
                                        </tr>
                                    ))}
                            </table>
                        )}
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}
export default CompetitionTaskSolutions;