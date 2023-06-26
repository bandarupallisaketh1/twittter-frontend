import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'

export default function Sidebar() {
    const navigate = useNavigate();
    //clear all the data in localstorage when the user click on logout
    const logoutHandler = () => {
        localStorage.clear();
        return navigate('/login')
    }
    const [profile, setprofile] = useState(JSON.parse(localStorage.getItem('profile')));
    //open our current user profile page
    const searchPofile = () => {
        axios.get(`http://localhost:5000/api/user/${localStorage.getItem('userid')}`, { headers: { 'x-token': localStorage.getItem('token') } }).then(res => {
            localStorage.setItem("profile", JSON.stringify(res.data));
            return navigate('/profile');
        });
    }
    return (
        <div className='sidebarcom' >
            <div className="nav">
                <div className="twilogo"><i class="fa-brands fa-twitter"></i></div>
                <nav className='sidenav'>
                    <ul>
                        <li className='sideitems'>
                            <Link className='links' to='/'><span className="homelogo fontas"><i class="fa-solid fa-house"></i></span> Home</Link>
                        </li>
                        <li className='sideitems'>
                            <span onClick={searchPofile} className='twusername'><span className="urlogo fontas"><i class="fa-solid fa-user"></i></span> profile</span>
                        </li>
                        <li className='sideitems' onClick={logoutHandler}>
                            <span className="logoutbtn fontas"><i class="fa-solid fa-right-from-bracket"></i></span> Logout
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="sideprofile">
                {/* set the profile when it has otherwise set a default profile */}
                {localStorage.getItem('image') === "" ?
                    <div><img className='sideimg' src='default.jpg' width={45} height={45} alt="none" /></div>
                    :
                    <div><img className='sideimg' src={localStorage.getItem('profile') ? `http://localhost:5000/images/${profile.image}` : `http://localhost:5000/images/${localStorage.getItem('image')}`} width={45} height={45} alt="none" /></div>
                }
                <div className="imgwra">
                    <div className="sideusername">@{localStorage.getItem('username')}</div>
                    <div className="sideemail">{localStorage.getItem('email')}</div>
                </div>
            </div>
        </div>
    )
}