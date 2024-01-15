import CompetitionsResult from "./CompetitionsResults";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import useFetch from "../useFetch";
import './CompetitionTaskSolutions.css';
import Cookies from "universal-cookie";
import base64 from 'base-64';

 const CompetitionTaskSolutions = () => {
   const { id } = useParams();
   //svi zadaci s natjecanja
    const [problems, setProblems] = useState([]);
    //lista usera koji su skroz tocno rjesili zadatak s idem
    const [users100, setUsers100]=useState([]);

     const [uniqueUsersArray, setUniqueUsersArray] = useState([]);

    //svi koji su predali rjesenje zadatka, po idu zadatka
    const [users, setUsers]=useState([]);

    //varijabla koja odreduje koji je prikaz, po zadacima ili po korisnicima
    const[byTask, setByTask]=useState(true);

    //lista s kljucevima id zadatka, true ili false smije li user skinut rjesenje
    const [isUserInProblem, setIsUserInProblem] = useState({});
    //podatci o ulogiranom korisniku
    const [userData, setUserData] = useState(null);
    const cookies = new Cookies();
    const jwtToken = cookies.get('jwt_authorization');
    const correct_ids=[1,2,3];
    const uniqueUsers = {};
    const [mapa,setMapa] = useState(uniqueUsers);


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
        // svi zadaci s natjecanja
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

    }, []); //zasad [] da mi se sve ne krsi, tu treb ic showTasks, svaki put kad se promijeni tasks tj stisne taj gumb, prikazuje se ovo umjesto onih drugih podataka?
    //mozda ipak bolje da se sve samo jednom fetcha?

    useEffect(() => {
        if(problems) {
            //za svaki problem nadi natjecatelje sa 100
            const newUsersByProblem = {};
            problems.map((problem) => {
                //dohvacamo sve koji su tocno rijesili, to nam sluzi za gumb download
                //treba jos dohvatiti SVE koji su predali rješenje po zadatku i nparaviti do kraja ovaj prikaz
                // za drugi prikaz sve koji su ikad predali rjesenje na ovom natjecanju
                // i onda sva rjesenja zadatka s odredenog natjecanja koja je neki user nekada predao
                //nekako napraviti funkcije koje fetchaju razlicitu stvar ovisno o odabranoj opciji (Umozda neki usestateovi koje suprotni gumbi mijenjaju)
                fetch(`http://localhost:8080/usersolutions/${id}/${problem.id}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        data.map((d)=>{
                            newUsersByProblem[problem.id] = d.user;
                            //provjeri je li user medu onima koji su skroz tocno rijesili zadatak


                        })
                        if (!userData) {
                            //nije ulogiran
                            problems.map((problem) => [problem.id, false])
                        } else {
                            const isUserInProblem = data.some((user) => user.user.id == userData.id);
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
            setUsers100(newUsersByProblem);
            //console.log(users100);
        }
    }, [problems]);

    useEffect(()=> {

        if (problems) {
            //za svaki problem nadi sve natjecatelje (zapravo vraca nes spigano, natjecatelj je kljuc u onom sto vraca)
            const newUsersByProblem = {};
            problems.map((problem) => {
                //dohvacamo sve koji su predali rješenje po zadatku i nparaviti do kraja ovaj prikaz
                // za drugi prikaz sve koji su ikad predali rjesenje na ovom natjecanju
                // i onda sva rjesenja zadatka s odredenog natjecanja koja je neki user nekada predao
                //nekako napraviti funkcije koje fetchaju razlicitu stvar ovisno o odabranoj opciji (Umozda neki usestateovi koje suprotni gumbi mijenjaju)
                //console.log(id, problem.id);
                fetch(`http://localhost:8080/allsolutions/${id}/${problem.id}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        //console.log(data);
                        newUsersByProblem[problem.id] = data;

                        data.forEach((entry) => {
                            // Access the user object from the entry
                            const user = entry.user;
                            // Check if the user id is not already in the object
                            if (!uniqueUsers[user.id]) {
                                // If not, add the user to the object with an array containing the current problem
                                uniqueUsers[user.id]= {
                                    user: user,
                                    problems: [problem],
                                };
                                console.log(uniqueUsers);
                            } else {
                                // If the user id is already in the object, add the current problem to the problems array
                                uniqueUsers[user.id].problems.push(problem);
                            }
                            setMapa(uniqueUsers);
                        });
                        //console.log(data);
                    })
                    .catch(error => {
                        console.error('Error fetching problems:', error);
                        // Handle error here
                    });
           })
            setUsers(newUsersByProblem);
            console.log(uniqueUsers);
            //console.log(uniqueUsers.keys());
        }

    },[problems]);



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

    const [expandedUsers, setExpandedUsers] = useState([]);

    const toggleUser = (userId) => {
        setExpandedUsers((prevExpanded) => {
            if (prevExpanded.includes(userId)) {
                return prevExpanded.filter((id) => id !== userId);
            } else {
                return [...prevExpanded, userId];
            }
        });
    };

    const download_solution=(problemid, userid)=>{
        fetch(`http://localhost:8080/allusersubs/${id}/${problemid}/${userid}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const base64Content = data[0].fileData;

                const binaryString = atob(base64Content);
                const blob = new Blob([new Uint8Array([...binaryString].map(char => char.charCodeAt(0)))], { type: 'application/octet-stream' });
                const blobUrl = URL.createObjectURL(blob);
                const downloadLink = document.createElement('a');
                downloadLink.href = blobUrl;
                downloadLink.download = 'solution.java'; // Specify the desired file name and extension
                document.body.appendChild(downloadLink);
                downloadLink.click();

                document.body.removeChild(downloadLink);
            })
            .catch(error => {
                console.error('Error fetching file:', error);
                // Handle error here
            });

    }

    return (
        <div id="body34">
        <button className="gumb34" onClick={() => {(setByTask(true))}}> Po zadacima </button>
        <button className="gumb34" onClick={() => (setByTask(false))}> Po korisnicima </button>
        <hr/>
            {byTask && (<table id="t34">
                <thead>
                <tr>
                    <th>Zadatak</th>
                    <th></th>
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
                                            <tr key={user.user.id}>
                                                <td>{user.user.name} {user.user.lastname}</td>
                                                <td>Postotak točnih primjera: {user.percentage_of_total * 100} %</td>
                                                <td>Broj bodova: {user.points}</td>
                                                <td>Vrijeme izvršavanja: {user.time}</td>
                                                {/*nesto cime provjerimo je li user tocno rijesio zadatak i smije li dohvatiti rjesenje
                                                correct.includes(problem.id) &&*/
                                                    isUserInProblem[problem.id] &&
                                                    <td><button onClick={() => download_solution(problem.id, user.user.id)}>
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
                {(mapa != undefined) && Object.entries(mapa).map((value) =>(
                    <tr key={value[1].user.id}>
                        <td onClick={() => toggleUser(value[1].user.id)} style={{ cursor: "pointer" }}>
                            {value[1].user.username} 
                        </td>
                        <td>
                            {expandedUsers.includes(value[1].user.id) && (
                                <table>
                                    {value[1].problems.map((problem) => (
                                            <tr key={problem.id}>
                                                <td>{problem.title}</td>
                                               
                                            </tr>
                                        ))}
                                </table>
                            )}
                        </td>
                    </tr>
                ))}
                {console.log(mapa)}
                </tbody>
            </table>)}
        </div>
    );
}
export default CompetitionTaskSolutions;