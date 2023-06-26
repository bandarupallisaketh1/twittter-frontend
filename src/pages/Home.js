import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Homepage from '../components/Homepage';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
    const navigate = useNavigate();
    const [msg, setmsg] = useState();
    const [tweetdialog, settweetdialog] = useState(false);
    const [tweet, settweet] = useState({ content: '', tweetphoto: '' });
    const handleText = (e) => {
        settweet({ ...tweet, [e.target.name]: e.target.value })
    }
    const handlePhoto = (e) => {
        settweet({ ...tweet, tweetphoto: e.target.files[0] })
    }
    //request the server to add a tweet in the database
    const addTweetHandler = (e) => {
        e.preventDefault();
        const formdata = new FormData();
        formdata.append('content', tweet.content);
        formdata.append('tweetphoto', tweet.tweetphoto);
        axios.post(`http://localhost:5000/api/tweet`, formdata, { headers: { 'x-token': `${localStorage.getItem('token')}` } }).then(res => { setmsg(res.data); settweetdialog(prev => !prev); toast("tweeted successfully"); window.location.reload(false); }).catch(err => toast(err.response.data));
    }
    return (
        <div className='home'>
            {/* avail dialogbox to make a tweet */}
            {tweetdialog ?
                <div className="addtweet">
                    <div className="twiwrap">
                        <div onClick={() => settweetdialog(prev => !prev)} className="cancellogo"><i class="fa-sharp fa-solid fa-xmark"></i></div>
                        <h2 className='adtwhe'>New Tweet</h2>
                        <form className='tweform' onSubmit={addTweetHandler}>
                            <input onChange={handleText} type="text" value={tweet.content} name='content' className='twiboxtext' placeholder='content' required autoComplete='off' />
                            <input onChange={handlePhoto} type="file" name="tweetphoto" id="tweetphoto" />
                            <input style={{ backgroundColor: 'green', padding: 8, color: 'white', border: 0, fontSize: 20, borderRadius: 5, marginTop: 14, textAlign: 'center' }} type="submit" value="Tweet" />
                        </form>
                    </div>
                </div> : ""}
            {localStorage.getItem('token') ? <div className='homewraper'>
                <div className="sidebar"><Sidebar /></div>
                <div className="homepage"><Homepage tweetdialog={tweetdialog} settweetdialog={settweetdialog} /></div>
            </div> : <Navigate to='/login' />}
            <ToastContainer />
        </div>
    )
}