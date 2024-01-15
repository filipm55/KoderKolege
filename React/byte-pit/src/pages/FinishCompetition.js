import React from 'react';
import {Link} from "react-router-dom";
import './FinishCompetition.css';

const FinishCompetition = () => {
  return (
    <div className="finish-competition-container">
      <p>
      Nakon završetka ovog natjecanja, rang-lista će biti dostupna pod karticom <Link to={'/competitions/results'}>"REZULTATI"</Link>.
      </p>
    </div>
  );
};

export default FinishCompetition;
