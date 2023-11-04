//template za funkciju za slanje podataka serveru (npri loginu, registraciji, objavi zadataka,....)
//server bi primitkom post naredbe trebao pospremiti podatke
const sendData = (url, data) =>{
    fetch('url',{method:'POST', header:{"Content-Type":"application/json"},
            body:JSON.stringify(data)})
        .then((res)=>{
            if(res.ok){
                //stogod zelimo nakon sto se podatak spremio})
            }
        })
        .catch((e)=>{console.log(e.message)});

};

export default sendData;