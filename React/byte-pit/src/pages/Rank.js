import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import './Rank.css';

const User = () => {
    const { competitionId } = useParams();
    const [ranking, setRanking] = useState([]);

    useEffect(() => {
        const fetchRanking = async () => {
            const response = await fetch(`http://localhost:8080/rank/${competitionId}`, {
                method: 'POST'
            });
            const data = await response.json();
            setRanking(data);
        };
        fetchRanking();
    }, [competitionId]);

    return (
        <div>
            <h1>Ovo je rang lista.</h1>
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Username</th>
                        <th>Points</th>
                    </tr>
                </thead>
                <tbody>
                    {ranking.map((row, index) => (
                        <tr key={index}>
                            <td>{row[2]}</td> {/* Rank */}
                            <td>{row[0]}</td> {/* Username */}
                            <td>{row[1]}</td> {/* Points */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default User;
