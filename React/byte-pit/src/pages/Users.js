import {Link} from "react-router-dom";
import useFetch from "../useFetch";

const Users = () => {
    const {data:users, error} =useFetch('/users')
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
                        <p>{user.user_type}</p>
                    </div>
                ))}
            </div> }
        </div>
    );
}

export default Users;