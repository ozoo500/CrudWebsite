import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import RegisterUser from "./auth/register/RegisterUser"
import Verify from './auth/verify/Verify';
import Login from './auth/login/Login';
import Home from './Home/Home';
import UpdateProfile from './Home/updateProfile';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegisterUser />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home/>} />
        <Route path="/updateProfile" element={<UpdateProfile/>} />


      </Routes>
    </Router>
  );
}

export default App;
