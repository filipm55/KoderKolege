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
    const {data:competition, error} = useFetch(`https://bytepitb-myjy.onrender.com//competitions/competition/${competitionId}`);

    useEffect(() => {
        if (jwtToken) {
            const fetchData = async () => {
                try {
                    const url = `https://bytepitb-myjy.onrender.com//users/${jwtToken}`;
                    const response = await fetch(url);
                    const data = await response.json();
                    setUserData(data);

                } catch (error) {
                    console.error(error);
                }
            };

            fetchData();
        }
    }, [jwtToken]);

    useEffect(() => {
        const fetchRanking = async () => {
            if(userData) {
                const response = await fetch(`https://bytepitb-myjy.onrender.com//virtual/rank/${competitionId}/${userData.username}`, {
                    method: 'POST',
                });
                
                    if (response.ok) {
                        try {
                            const data = await response.json();
                            console.log(data);
                            setRanking(data);
                        } catch (error) {
                            console.error('Error parsing JSON:', error);
                        }
                    } else {
                        console.error('Server response not okay:', response.status);
                    }
            }

        };
        fetchRanking();
    }, [competitionId, userData]);

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
