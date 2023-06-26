import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';

export default function Login() {
    const navigate = useNavigate();
    const [user, setuser] = useState({ username: '', password: '' });
    const submitHandler = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/api/auth/login', user).then(res => {
            localStorage.setItem("token", `${res.data.token}`);
            localStorage.setItem('email', `${res.data.email}`);
            localStorage.setItem('image', `${res.data.image}`);
            localStorage.setItem('username', `${user.username}`);
            localStorage.setItem('userid', `${res.data.userid}`)
            if (res.data.token) {
                toast("Login user sucessfully");
                //redirect the user to home page on login successful
                return navigate('/');
            }
        }).catch(err => {
            //toast the responce corresponds to the error
            if (err.response.status === 404) {
                toast("user not found");
                return navigate('/register')
            }
            if (err.response.status === 405) {
                toast("password is incorrect");
            }
        });
    }
    const changeHandler = (e) => {
        setuser({ ...user, [e.target.name]: e.target.value })
    }
    return (
        <div className='login'>
            <div className="loginbox">
                <div className="welcomeback">Login Here</div>
               
                <div className="twitter-icon">
                <FontAwesomeIcon icon={faTwitter} bounce size="xl" style={{color: "#0874e7",}} />
        </div>
  
                <div className="loginform">
                
                    <h2 className='loginheading'>Log in</h2>
                    <form className='loginforms' onSubmit={submitHandler}>
                        <input className='logininputs' type="text" name='username' value={user.username} placeholder='Username' onChange={changeHandler} autoComplete="off" />
                        <input className='logininputs' type="text" name='password' value={user.password} placeholder='Password' onChange={changeHandler} autoComplete="off" />
                        <input className='loginsubtn' type="submit" value="Login" />
                    </form>
                    <p className="cant">Can't have an accout <span className='regisli'><Link className='regisli' to='/register'>Register</Link></span> ?</p>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}