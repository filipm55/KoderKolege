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
                    
                    throw Error(res.statusText);
                }
                return res.json();
            })
            .then(data => {
                setData(data);
                setError(null);
            })
            .catch(error => {
                // auto catches network / connection error
                console.error(error.message);
                setError(error.message);
            })
    }, [])
    return { data, error };
}

export default useFetch;