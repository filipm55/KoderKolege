import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'universal-cookie';
import {Link} from "react-router-dom";
import useFetch from "../useFetch";
import './Rank.css';

const FinishVirtualCompetition = () => {
    const { competitionId } = useParams();
    const [ranking, setRanking] = useState([]);
    const [userData, setUserData] = useState(null);
    const cookies = new Cookies();
    const jwtToken = cookies.get('jwt_authorization');
    const {data:competition, error} = useFetch(`http://localhost:8080/competitions/competition/${competitionId}`);

    useEffect(() => {
        if (jwtToken) {
            const fetchData = async () => {
                try {
                    const url = `http://localhost:8080/users/${jwtToken}`;
                    const response = await fetch(url);
                    const data = await response.json();
                    setUserData(data.username);
                    console.log(data);
                } catch (error) {
                    console.error(error);
                }
            };

            fetchData();
        }
    }, [jwtToken]);

    useEffect(() => {
        const fetchRanking = async () => {///virtual/rank/{competitionId}/{username}
            const response = await fetch(`http://localhost:8080/virtual/rank/${competitionId}/${userData}`, {
                method: 'POST',
            });
            const data = await response.json();
            setRanking(data);

        };
        fetchRanking();
    }, [competitionId]);

    return (
        <div>
            <h1 className='rankTitle'>Rang lista za <span className='compTitle'>{competition && competition.name}</span> </h1>
            <div className='container'>
                <table className="rank-table">
                    <thead>
                    <tr>
                        <th>RANK</th>
                        <th>USERNAME</th>
                        <th>POINTS</th>
                    </tr>
                    </thead>
                    <tbody>
                    {console.log(ranking)}
                    {ranking && ranking.map((row, index) => (
                        [
                            <tr key={index}>
                                <td>{row.rank}</td> {/* Rank */}
                                <td><Link to={'/users/' + row.id}>{row.username}</Link></td>
                                <td>{row.points}</td> {/* Points */}
                            </tr>
                        ]
                    ))}

                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FinishVirtualCompetition;
