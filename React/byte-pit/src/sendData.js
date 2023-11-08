//template za funkciju za slanje podataka serveru (npri loginu, registraciji, objavi zadataka,....)
//server bi primitkom post naredbe trebao pospremiti podatke


const sendData = (url, data) =>{
    fetch(url, {
            method:'POST',
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(data)
        })
        .then((res)=>{
            if(res.ok){

            }
        })
        .catch((e)=>{console.log("hi"+e.message)});

};

export default sendData;