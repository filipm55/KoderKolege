import React, {useEffect} from 'react';
import {BrowserRouter as Router, Route, Routes, useLocation} from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home'
import Footer from './components/Footer'
import Login from './pages/Login'
import Registration from './pages/Registration'
import Tasks from './pages/Tasks'
import Users from "./pages/Users";

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
                <Route exact path='/tasks' element={<Tasks />} />
              <Route exact path='/users' element={<Users />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
