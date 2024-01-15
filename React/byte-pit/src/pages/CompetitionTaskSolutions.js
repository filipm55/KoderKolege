import CompetitionsResult from "./CompetitionsResults";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import useFetch from "../useFetch";
import Cookies from "universal-cookie";

const CompetitionTaskSolutions = () => {
   const { id } = useParams();
   //svi zadaci s natjecanja
    const [problems, setProblems] = useState([]);
    //lista usera koji su rjesili zadatak s idem
    const [users100, setUsers100]=useState([]);

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

    //svi podaci o natjecanju, potencijalno useless
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
            console.log(users100);
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

                    })
                    .catch(error => {
                        console.error('Error fetching problems:', error);
                        // Handle error here
                    });


            })
            setUsers(newUsersByProblem);
            //console.log(users);

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

    return (
        <div>
        <button onClick={() => (setByTask(true))}> Po zadacima </button>
        <button onClick={() => (setByTask(false))}> Po korisnicima </button>
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
                                            <tr key={user.user.id}>
                                                <td>{user.user.name} {user.user.surname}</td>
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