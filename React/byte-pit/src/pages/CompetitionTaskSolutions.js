import CompetitionsResult from "./CompetitionsResults";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import useFetch from "../useFetch";
import Cookies from "universal-cookie";

const CompetitionTaskSolutions = () => {
   const { id } = useParams();
    const [problems, setProblems] = useState([]);
    const [users, setUsers]=useState([]);
    const[byTask, setByTask]=useState(true);
    const [isUserInProblem, setIsUserInProblem] = useState({});
    const [userData, setUserData] = useState(null);
    const[showTasks,setShowTasks] = useState(0);
    const[showUsers, setShowUsers] = useState(0);
    const cookies = new Cookies();
    const jwtToken = cookies.get('jwt_authorization');
    const correct_ids=[1,2,3];
    const {data:competition} = useFetch(`http://localhost:8080/competitions/competition/${id}`);

    useEffect(() => {
        if (jwtToken) {
            const fetchData = async () => {
                try {
                    const url = `http://localhost:8080/users/${jwtToken}`;
                    const response = await fetch(url);
                    const data = await response.json();
                    setUserData(data); // Set user data fetched from the backend
                    console.log(data.id);
                } catch (error) {
                    // Handle error if needed
                    console.error(error);
                }
            };

            fetchData();
        } else {
        }
    }, [jwtToken]);

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

        if(problems){
            //za svaki problem nadi sve natjecatelje
            const newUsersByProblem={};
            problems.map((problem)=>{
                //dohvacamo sve koji su tocno rijesili, to nam sluzi za gumb download
                //treba jos dohvatiti SVE koji su predali rješenje po zadatku i nparaviti do kraja ovaj prikaz
                // za drugi prikaz sve koji su ikad predali rjesenje na ovom natjecanju
                // i onda sva rjesenja zadatka s odredenog natjecanja koja je neki user nekada predao
                //nekako napraviti funkcije koje fetchaju razlicitu stvar ovisno o odabranoj opciji (Umozda neki usestateovi koje suprotni gumbi mijenjaju)
                fetch(`http://localhost:8080//usersolutions/${id}/${problem.id}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        newUsersByProblem[problem.id] = data;
                        //provjeri je li user medu onima koji su skroz tocno rijesili zadatak
                        if(!userData){
                            //nije ulogiran
                            problems.map((problem) => [problem.id, false])
                        }else{
                            const isUserInProblem = data.some((user) => user.id == userData.id);
                            setIsUserInProblem((prev) => ({
                                ...prev,
                                [problem.id]: isUserInProblem,
                            }));
                        }


                    })
                    .catch(error => {
                        console.error('Error fetching problems:', error);
                        // Handle error here
                    });
            })
            setUsers(newUsersByProblem);


        }

    }, []); //zasad [] da mi se sve ne krsi, tu treb ic showTasks, svaki put kad se promijeni tasks tj stisne taj gumb, prikazuje se ovo umjesto onih drugih podataka?
    //mozda ipak bolje da se sve samo jednom fetcha?

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
        <div>
        <button onClick={() => {setByTask(true); setShowTasks(showTasks+1);}}> Po zadacima </button>
        <button onClick={() => {setByTask(false); setShowUsers(showUsers+1)}}> Po korisnicima </button>
            {byTask && (<table>
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
                                    {users && users[problem.id] && users[problem.id]
                                        /*.filter((user) => user.problemId === problem.id)*/
                                        .map((user) => (
                                            <tr key={user.id}>
                                                <td>{user.name} {user.surname}</td>
                                                {/*nesto cime provjerimo je li user tocno rijesio zadatak i smije li dohvatiti rjesenje
                                                correct.includes(problem.id) &&*/
                                                    isUserInProblem[problem.id] &&
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
            </table>)}

            {!byTask && (<table>
                <thead>
                <tr>
                    <th>Korisnik</th>
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
                                    {users && users[problem.id] && users[problem.id]
                                        /*.filter((user) => user.problemId === problem.id)*/
                                        .map((user) => (
                                            <tr key={user.id}>
                                                <td>{user.name} {user.surname}</td>
                                                {/*nesto cime provjerimo je li user tocno rijesio zadatak i smije li dohvatiti rjesenje
                                                correct.includes(problem.id) &&*/
                                                    <td>{<button>
                                                        Dohvati rješenje
                                                    </button>}
                                                    </td>}
                                            </tr>
                                        ))}
                                </table>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>)}
        </div>
    );
}
export default CompetitionTaskSolutions;