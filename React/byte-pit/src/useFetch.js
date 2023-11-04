//funkcija za dohvat podataka sa servera
//ubaci se url podataka koje zelimo, funkcija ih dohvati

import { useState, useEffect } from 'react';

const useFetch = (url) => {
    //makes sure every change in data rerenders our page
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const abortCont = new AbortController();
        //make sure data loading is aborted if user switches page

        fetch(url, { signal: abortCont.signal })
                .then(res => {
                    if (!res.ok) { // error coming back from server
                        throw Error('neuspješan dohvat podataka');
                    }
                    return res.json();
                })
                .then(data => {
                    setLoading(false);
                    setData(data);
                    setError(null);
                })
                .catch(err => {
                    if (err.name === 'AbortError') {

                    } else {
                        setLoading(false);
                        setError(err.message);
                    }
                })

        // abort fetch
        return () => abortCont.abort();
    }, [url])

    return { data, loading, error };
}

export default useFetch;