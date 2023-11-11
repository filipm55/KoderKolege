import {Link} from "react-router-dom";
import useFetch from "../useFetch";

const Users = () => {
    const {data:users, error} =useFetch('http://localhost:8080/users')
//u link ubaciti link za dohvat podataka o pojedinom zadatku
    //na svakom profilu moraju biti zadaci koje je objavio u obliku popisa, backend u odgovoru na ovaj zahtjev mora poslati uz podatke o autoru i podatke o
    //imenima zadataka te id-u zadatka (ako mu je to jedinstveni identifikator
    return (
        <div className="wrapper">
            { error && <div>{ error }</div> }
            { users && <div className="task-list">
                {users.map(user => (

                    <div className="task" key={user.id} >
                        <Link to={'/users/'+user.id}><h2>{ user.name + ' ' + user.lastname }</h2></Link>
                        <p>Podaci o korisniku:</p>
                        <p>{user.email}</p>
                        <p> <img
                            src={`data:image/jpeg;base64,${user.image.data}`} //basicly jer znamo da je slika jpeg uzimamo njezine bajtove i pretvaramo ih u sliku
                            alt="User Image"
                        /></p>
                    </div>
                ))}
            </div> }
        </div>
    );
}

export default Users;