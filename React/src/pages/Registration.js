import {useState} from 'react';
import sendData from "../sendData";
import './Registration.css';

//obrazac za registraciju koji šalje podatke klikom na gumb u nasu imaginarnu json bazu

const Registration = () => {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role,setRole] = useState('COMPETITOR');
    //const [fEmail, setFEmail] = useState(false)
    var fEmail = false;
    const [faultyEmail, setFaultyEmail] = useState(false);
    const[fEmailMess,setFEmailMess]=useState('')
    const [file, setFile] = useState(null);
    var filee = null; //pokusaj prijenosa filea u json bazu - setFile ne radi, ni ovo ne radi :(
    const [isError, setIsError] = useState(false)
    const [errorMsg, setErrorMsg] = useState("");

    const submitFja = (e) => {
        e.preventDefault();
        checkEmail(email);

        if(!fEmail){
            const user = {name: name, lastname: surname, username: username, email: email, password:password, userType:role, image:null};
            console.log(JSON.stringify(user));

            sendData('http://localhost:8080/users', user);
        }
        else{
            //no submit
        }
    }
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];

        // Checking if the file type is allowed or not
        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!allowedTypes.includes(selectedFile?.type)) {
            setIsError(true);
            setErrorMsg("Only JPEG, PNG, and GIF images are allowed!avi");
            return;
        }

        setIsError(false);
        setFile(selectedFile);
        filee = selectedFile;
    };

    const checkEmail=(email)=> {
        let br = 0;
        let dot = 0;

        for(let i in email) {
            if (email[i] === "@") {
                br ++;
                for(let j = Number(i) + 1; j < email.length; j ++) {
                    if (email[j] === ".") {
                        dot ++;
                    }
                }
            }
        }
        if (br !== 1) {
            setFEmailMess("Email must have exactly one @!");
            fEmail=true;
            setFaultyEmail(true);
        }
        else if (dot === 0) {
            setFEmailMess("Email must have at least one dot after @!");
            fEmail=true;
            setFaultyEmail(true);
        }
    };
    
    return (
        <div className="wrapper">
            <h2>Registracija</h2>
            <form onSubmit ={submitFja}>
                
                <div className='kucica'><label>Ime:</label>
                    <input className = 'top' type = "text" value = {name} required onChange={(e) => setName(e.target.value)}></input>
                </div>
                <div className='kucica'><label>Prezime:</label>
                    <input type = "text" value = {surname} required onChange={(e) => setSurname(e.target.value)}></input>
                </div>
                <div className='kucica'><label>Email:</label>
                    <input type = "text" value = {email} required onChange={(e) => setEmail(e.target.value)}></input>
                </div>
                {faultyEmail && <p className='fileError'>{fEmailMess}</p>}

                <div className='kucica'><label>Korisničko ime:</label>
                    <input type = "text" value = {username} required onChange={(e) => setUsername(e.target.value)}></input>
                </div>
                <div className='kucica'><label>Lozinka:</label>
                    <input type = "password" value = {password} required onChange={(e) => setPassword(e.target.value)}></input>
                </div>
                <div className='kucica'><label>Uloga:</label>
                    <label htmlFor="natjecatelj"><input type="radio" id="natjecatelj" name="uloga" value="HTML" checked={role==='COMPETITOR'} onChange={()=>setRole('COMPETITOR')}/>natjecatelj</label>
                    <label className="voditelj" htmlFor="voditelj"><input type="radio" id="voditelj" name="uloga" checked={role==='COMPETITION_LEADER'} value="HTML" onChange={()=>setRole('COMPETITION_LEADER')}/>voditelj</label>
                    </div>
                <div className='kucica'><label>Osobna fotografija: </label><input type="file" name="datoteka" required  onChange={handleFileChange}/></div>
                {isError && <p className='fileError'>{errorMsg}</p>}
                <button className='submitGumb'>Registriraj me!</button>

            </form>
        </div>
    );
}

export default Registration;