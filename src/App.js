import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Singletweet from './pages/Singletweet';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path='/register' element={<Register />} />
        <Route exact path='/login' element={<Login />} />
        <Route exact path='/' element={<Home />} />
        <Route exact path='/profile' element={<Profile />} />
        <Route exact path='/singletweet' element={<Singletweet />} />
      </Routes>
    </div>
  );
}

export default App;