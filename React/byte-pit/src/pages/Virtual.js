import './Creation.css';
import {Link} from "react-router-dom";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import ExtensionIcon from '@mui/icons-material/Extension';
import CasinoIcon from '@mui/icons-material/Casino';
import Cookies from 'universal-cookie';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';


const Virtual = () => {
    return (
        <div className="body1">
            <div className="kategorije">
                 <Link to='/virtual/competitionChoice' className="link">
                    <div className="kat">
                        <CalendarMonthIcon sx={{ fontSize: 60 }} color="primary"/>
                        <h3 className='nas'>Odabir prošlog natjecanja</h3>
                        <div className='opisKat'>
                            <PlayArrowIcon className='ikona'/>
                            <p className='opis' id ="treci"> Pokreni natjecanje koje se već održalo i saznaj kakav rezultat bi postigao da si sudjelovao!</p>
                        </div>
                
                    </div>
                </Link>
                <Link to='/virtual/randomTasks' className="link">
                    <div className="kat">
                        <CasinoIcon sx={{ fontSize: 60 }} color="primary"/>
                        <h3 className='nas'>Nasumicno generirano natjecanje</h3>
                        <div className='opisKat'>
                            <PlayArrowIcon className='ikona'/>
                            <p className='opis' id ="cetvrti">Doživi iskustvo natjecanja sa nasumično odabranim zadacima za vježbu</p>
                        </div>
                        
                    </div>
                </Link>
            </div>
        </div>

    );
}

export default Virtual;