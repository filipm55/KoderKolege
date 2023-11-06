//funkcija za dohvat podataka sa servera
//ubaci se url podataka koje zelimo, funkcija ih dohvati

import { useState, useEffect } from 'react';

const useFetch = (url) => {
    //makes sure every change in data rerenders our page
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(url)
            .then(res => {
                if (!res.ok) { // error coming back from server
                    throw Error('problem pri učitavanju podataka');
                }
                return res.json();
            })
            .then(data => {
                setData(data);
                setError(null);
            })
            .catch(err => {
                // auto catches network / connection error
                setError(err.message);
            })
    }, [])
    return { data, error };
}

export default useFetch;