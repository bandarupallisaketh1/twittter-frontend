import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';

export default function Register() {
  const navigate = useNavigate();
  const [user, setuser] = useState({ name: "", username: "", email: "", password: "" });
  const submitHandler = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/auth/register', user).then((res, err) => {
      if (res.data.message === "user account created sucessfully") {
        toast("user created sucessfully");
        //redirect the user when the registration is successful
        return navigate('/login');
      }
    }).catch(err => {
      if (err.response.status === 405) {
        toast(err.response.data.message);
      }
    });
  }
  const changeHandler = (e) => [
    setuser({ ...user, [e.target.name]: e.target.value })
  ]
  return (
    <div className='register'>
      <div className="registerbox">
        <div className="joinus">Join Us
        <FontAwesomeIcon icon={faTwitter} bounce size="xl" style={{color: "#0874e7",}} /> </div>
        <div className="regisform">
  
          <h2 className='regishead'>Register</h2>
          <form className='regisforms' onSubmit={submitHandler}>
            <input className='registinputs' type="text" value={user.name} name='name' placeholder='Full Name' onChange={changeHandler} autoComplete='off' required />
            <input className='registinputs' type="email" value={user.email} name="email" id="email" placeholder='Email' onChange={changeHandler} autoComplete='off' required />
            <input className='registinputs' type="text" value={user.username} name='username' placeholder='Username' onChange={changeHandler} autoComplete='off' required />
            <input className='registinputs' type="password" value={user.password} name="password" id="password" placeholder='Password' onChange={changeHandler} autoComplete='off' required />
            <input className='registbtn' type="submit" value="Register" />
          </form>
          <p className="cant">alredy have an account <Link className='regisli' to='/login'>Login</Link> ?</p>
        </div>
      </div>
      <ToastContainer/>
    </div>
  )
}