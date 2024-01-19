import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'universal-cookie';
import {Link} from "react-router-dom";
import useFetch from "../useFetch";
import './Rank.css';

const Rank = () => {
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
            const response = await fetch(`http://localhost:8080/competitions/rank/${competitionId}`, {
                method: 'POST',
            });
            const data = await response.json();
            setRanking(data);
            console.log(data);
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
                {ranking.map((row, index) => (
                    [
                        <tr
                            key={index}
                            className={userData && userData.username && row[1] === userData.username ? 'highlighted-row' : ''}
                        >
                            <td>{row[3]}</td> {/* Rank */}
                            <td><Link to={'/users/' + row[0]}>{row[1]}</Link></td>
                            <td>{row[2]}</td> {/* Points */}
                        </tr>
                    ]
                ))}

                </tbody>
            </table>
            </div>
        </div>
    );
};

export default Rank;
