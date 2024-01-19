import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AllTasks.css';
import useFetch from "../useFetch";


const CompetitionsResult = () => {
    const [data, setData] = useState([]);
    const [sort, setSort] = useState('name');
    const [competitions, setCompetitions] = useState([]);
    const[fcompetitions, setFcompetitions]=useState([]);

    const {data:allcompetitions, error} = useFetch('http://localhost:8080/competitions');
    const currentDate = new Date();

    useEffect(() => {
        if(allcompetitions){
            allcompetitions.map((comp)=>{
                const dateArray = comp.dateTimeOfBeginning;
                //const formattedStartDate = new Date(Date.UTC(...dateArray)).toISOString().slice(0, -1);
                //comp.dateTimeOfBeginning=formattedStartDate
                var [year, month, day, hours, minutes] = dateArray;

                const formattedStartDate = new Date(year, month - 1, day, hours, minutes)

                comp.dateTimeOfBeginning=formattedStartDate

                const endDateArray = comp.dateTimeOfEnding;

                var [year, month, day, hours, minutes] = endDateArray;
                /**/
                const formattedEndDate = new Date(year, month - 1, day, hours, minutes)
                comp.dateTimeOfEnding=formattedEndDate;
            })
            //filtriraj samo prosla natjecanja
            setFcompetitions(allcompetitions.filter((competition) => {
                console.log(competition.dateTimeOfEnding);
                //
                return competition.dateTimeOfEnding < currentDate;
            }));
            console.log(fcompetitions);
        }
    }, [allcompetitions]);
    useEffect(() => {
        if (fcompetitions) {
            //pretvorba datuma u normalan oblik



            sortCompetitions(sort);
        }
    }, [fcompetitions, sort]);

    const formatDate = (date)=>{
        const formattedDate =date.toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false, // Use 24-hour format
            });
        return formattedDate;
    }
    const sortCompetitions = (property) => {
        const sortedCompetitions = [...fcompetitions].sort((a, b) =>
            property === 'name' ? a.name.localeCompare(b.name) : new Date(b.dateTimeOfBeginning) - new Date(a.dateTimeOfBeginning)
        );
        setCompetitions(sortedCompetitions);
    };


    return (
        <div>
            <div id="popis11">
                <div id="naslovSort">
                    <h1 id="zdzvj">Rezultati prošlih natjecanja</h1>
                    <div id="sortovi91">
                        <p>Sortiraj</p>
                        <select id ="sel91" onChange={(event) => setSort(event.target.value)}>
                            <option value = 'name'>abecedno</option>
                            <option value ='beginningdatetime'>najnovije</option>
                        </select>
                        {/* Add more buttons for different difficulty levels as needed */}
                    </div>
                </div>
                <table className='popisZad'>
                    <thead>
                    <tr id="vrh">
                        <td>Ime natjecanja</td>
                        <td>Početak</td>
                        <td>Kraj</td>
                        <td></td>
                        <td></td>
                    </tr>
                    </thead>
                    <tbody>
                    {competitions.map((comp) => (
                        comp.isvirtual && <tr key={comp.id}>
                            <td>{comp.name}</td>
                            <td>{formatDate(comp.dateTimeOfBeginning)}</td>
                            <td>{formatDate(comp.dateTimeOfEnding)}</td>

                            <td>
                                <Link id="zeleno" className='taskName' to={`/competitions/rank/${comp.id}`}>
                                    Pogledaj ljestvicu!
                                </Link>
                            </td>
                            <td>
                                <Link id="zeleno" className='taskName' to={`/competitions/results/${comp.id}`}>
                                    Pogledaj rješenja!
                                </Link>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};




    /*return (
        <div>
            <div id="popis11">
                <div id="naslovSort">
                    <h1 id="zdzvj">Rezultati prošlih natjecanja</h1>
                </div>
                <table className='popisZad'>
                    <thead>
                    <tr id="vrh">
                        <td className='tName'>Ime natjecanja</td>
                        <td></td>
                    </tr>
                    </thead>
                    <tbody>
                    {Object.keys(tasksByDifficulty).map(difficulty => (
                        tasksByDifficulty[difficulty].map((comp, index) => (
                            ((sort === 'ALL') || (sort === task.problemType)) && !task.isPrivate &&
                            <tr key={comp.id}>
                                <td>{comp.name}</td>
                                <td><Link id="zeleno" className='taskName' to={`/competitions/rank/${comp.id}`}>Pogledaj ljestvicu!</Link></td>
                                <td><Link id="zeleno" className='taskName' to={`/competitions/results/${comp.id}`}>Pogledaj rješenja!</Link></td>
                            </tr>
                        ))
                    ))}</tbody></table>
            </div>
        </div>
    );
};
*/
export default CompetitionsResult;