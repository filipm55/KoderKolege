import React, {useEffect} from 'react';
import {BrowserRouter as Router, Route, Routes, useLocation} from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home'
import Footer from './components/Footer'
import Login from './pages/Login'
import Registration from './pages/Registration'
import Creation from './pages/Creation'
import Practice from './pages/Practice'
import AddTask from './pages/AddTask'
import Users from "./pages/Users";
import Calendar from "./pages/Calendar";
import Virtual from "./pages/Virtual";
import User from "./pages/User";
import AllTasks from './pages/AllTasks';
import SolvingATask from './pages/SolvingATask';
import CreateCompetition from "./pages/CreateCompetition";
import JoinACompetition from "./pages/JoinACompetition";
import Competition from "./pages/Competition"
import Rank from "./pages/Rank";
import VirtualCalendar from "./pages/VirtualCalendar";
import EditTask from "./pages/EditTask";
import EditCompetition from "./pages/EditCompetition";
import JoinAVirtuallyGeneratedCompetition from "./pages/JoinAVirtuallyGeneratedCompetition";

function App() {

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
                <Route exact path='/' element={<Home />} />
                <Route exact path='/login' element={<Login />} />
                <Route exact path='/registration' element={<Registration />} />
                <Route exact path='/creation' element={<Creation />} />
                <Route exact path='/virtual' element={<Virtual />} />
                <Route exact path='/practice' element={<Practice />} />
                <Route exact path='/tasks/addTask' element={<AddTask />} />
                <Route exact path='/users' element={<Users />} />
                <Route exact path='/calendar' element={<Calendar />} />
                <Route exact path='/users/:id' element={<User />} />
                <Route exact path='/user' element={<User />} />
                <Route exact path='/tasks/allTasks' element={<AllTasks />} />
                <Route exact path='/tasks/:id' element={<SolvingATask />} />
                <Route exact path='/createCompetition' element={<CreateCompetition />} />
                <Route exact path='/competitions/:competitionId' element={<JoinACompetition />} />
                <Route exact path='/rank/:competitionId' element={<Rank />} />
                <Route exact path='/virtual/randomTasks' element={<JoinAVirtuallyGeneratedCompetition />} />
                <Route exact path='/competitions/:competitionId/:taskId' element={<Competition />} />
                <Route exact path='/virtual/competitionChoice' element={<VirtualCalendar />} />
                <Route exact path='/edittask/:id' element={<EditTask />} />
                <Route exact path='/editcompetition/:id' element={<EditCompetition />} />


          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
