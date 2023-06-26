import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Singletweet() {
    const [content, setreply] = useState('');
    const [ismsg, setismsg] = useState(false);
    const [replytweet, setreplytweet] = useState();
    const [msg, setmsg] = useState();
    const navigate = useNavigate();
    const [tweet, settweet] = useState(JSON.parse(localStorage.getItem('tweet')));
    const searchPofile = ({ id }) => {
        axios.get(`http://localhost:5000/api/user/${id}`, { headers: { 'x-token': localStorage.getItem('token') } }).then(res => {
            localStorage.setItem("profile", JSON.stringify(res.data));
            return navigate('/profile');
        });
    }
    const deleteHandler = ({ id }) => {
        axios.delete(`http://localhost:5000/api/tweet/${id}`, { headers: { 'x-token': localStorage.getItem('token') } }).then(res => {
            setmsg(res.data);
            toast(res.data);
            refresh();
        });
        function refresh() {
            axios.get(`http://localhost:5000/api/tweet/${tweet._id}`, { headers: { 'x-token': `${localStorage.getItem('token')}` } }).then(res => {
                settweet(res.data.others);
                localStorage.setItem('tweet', JSON.stringify(res.data.others));
            });
        }
    }
    const messageSubmit = (e) => {
        e.preventDefault();
        axios.post(`http://localhost:5000/api/tweet/${replytweet}/reply`, { content }, { headers: { 'x-token': localStorage.getItem('token') } }).then(res => {
            setmsg(res.data);
            toast(res.data);
            setreply('');
            refresh();
            setismsg(prev => !prev);
        }).catch(err => {
            if (err.response.status === 400) {
                toast(err.response.data);
                setmsg(err.response.data);
            }
        });
        function refresh() {
            axios.get(`http://localhost:5000/api/tweet/${tweet._id}`, { headers: { 'x-token': `${localStorage.getItem('token')}` } }).then(res => {
                settweet(res.data.others);
                localStorage.setItem('tweet', JSON.stringify(res.data.others));
            });
        }
    }
    const messageHandler = ({ id }) => {
        setismsg(prev => !prev);
        setreplytweet(id);
    }
    const retweetHandler = ({ id }) => {
        axios.post(`http://localhost:5000/api/tweet/${id}/retweet`, "payload", { headers: { 'x-token': localStorage.getItem('token') } }).then(res => {
            setmsg(res.data);
            toast(res.data);
            refresh();
        }).catch(err => {
            if (err.response.status === 405) {
                toast("you alredy retweeted it");
                setmsg(err.response.data);
                refresh();
            }
        });
        function refresh() {
            axios.get(`http://localhost:5000/api/tweet/${tweet._id}`, { headers: { 'x-token': `${localStorage.getItem('token')}` } }).then(res => {
                settweet(res.data.others);
                localStorage.setItem('tweet', JSON.stringify(res.data.others));
            });
        }
    }
    const likeHandler = ({ id, islike }) => {
        if (islike) {
            axios.put(`http://localhost:5000/api/tweet/${id}/dislike`, "payload", { headers: { 'x-token': localStorage.getItem('token') } }).then(res => {
                refresh()
                toast(res.data);
            }).catch(err => setmsg(err.response.data));
            function refresh() {
                axios.get(`http://localhost:5000/api/tweet/${tweet._id}`, { headers: { 'x-token': `${localStorage.getItem('token')}` } }).then(res => {
                    settweet(res.data.others);
                    localStorage.setItem('tweet', JSON.stringify(res.data.others));
                });
            }
        }
        else {
            axios.put(`http://localhost:5000/api/tweet/${id}/like`, "payload", { headers: { 'x-token': localStorage.getItem('token') } }).then(res => {
                refresh();
                toast(res.data);
            }).catch(err => setmsg(err.response.data));
            function refresh() {
                axios.get(`http://localhost:5000/api/tweet/${tweet._id}`, { headers: { 'x-token': `${localStorage.getItem('token')}` } }).then(res => {
                    settweet(res.data.others);
                    localStorage.setItem('tweet', JSON.stringify(res.data.others));
                });
            }
        }
    }
    return (
        <div className='singletweet'>
            <div className="onewrap">
                <div className="twisi"><Sidebar /></div>
                {tweet && < div className="sinwrap">
                    {/* display a retweet head in the */}
                    {tweet.retweetby.length > 0 ?
                        <div className="retweet"><i class="fa-solid fa-retweet"></i> retweeted by {tweet.retweetby[tweet.retweetby.length - 1].name}</div> : ""
                    }
                    <div className="singwrap">
                        <div className="twepro">
                            {/* set the profile when it has otherwise set a default profile */}
                            {tweet.tweetedby.image === "" ? <img className='tweetprofile' src='default.jpg' alt='profile' width={35} height={30} /> :
                                <img className='tweetprofile' src={`http://localhost:5000/images/${tweet.tweetedby.image}`} alt="tweetimage" width={35} height={30} />}
                        </div>
                        <div className="twicon">
                            <div className="twicons">
                                <div onClick={() => searchPofile({ id: tweet.tweetedby._id })} className='twusername'>@{tweet.tweetedby.username}   <span className='createdat'>   -{tweet.createdAt}</span> </div>
                                {tweet.content}
                            </div>
                            <div className="twisimg">
                                {/* set the tweetimage when it has otherwise set a default profile */}
                                {tweet.image === "" ? "" : <img src={`http://localhost:5000/tweetimages/${tweet.image}`} alt='tweetimg' width={200} height={180} />}
                            </div>
                            <div className="btnes">
                                <ul className="btns">
                                    <li onClick={() => likeHandler({ id: tweet._id, islike: tweet.islike })} className={tweet.islike ? "likebtn liked" : "likebtn"}>{tweet.likes.length}<i class="fa-solid fa-heart"></i></li>
                                    <li onClick={() => messageHandler({ id: tweet._id })} className='replybtn'>{tweet.replies.length}<i class="fa-regular fa-comment"></i></li>
                                    <li onClick={() => retweetHandler({ id: tweet._id })} className={tweet.isretweeted ? "retweetbtn retweeted" : "retweetbtn"}>{tweet.retweetby.length}<i class="fa-solid fa-retweet"></i></li>
                                </ul>
                            </div>
                            <div className="replyhead">
                                <h2>Replies</h2>
                                <div className="allre">
                                    {tweet.replies.length > 0 && tweet.replies.map(tweets => {
                                        return (
                                            <div className="csingwrap" >
                                                <div className="twicon">
                                                    <div className="twicons">
                                                        <div className="tweetimg">
                                                            {tweets.tweetedby.image === "" ? <img className='tweetprofile' src='default.jpg' alt='profile' width={35} height={30} /> :
                                                                <img className='tweetprofile' src={`http://localhost:5000/images/${tweets.tweetedby.image}`} alt="tweetimage" width={35} height={30} />}
                                                        </div>
                                                        <div onClick={() => searchPofile({ id: tweet.tweetedby._id })} className='twusername'>@{tweets.tweetedby.username}   <span className='createdat'>   -{tweets.createdAt}</span> </div>
                                                        {tweets.content}
                                                        {/* avail the delete button only for the admin */}
                                                        {
                                                            tweets.tweetedby._id === localStorage.getItem('userid') ?
                                                                <div onClick={() => deleteHandler({ id: tweets._id })} className='deletebtn'><i class="fa-solid fa-trash"></i></div>
                                                                : ""
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
                {/* avail a dialogbox to make the comments */}
                {ismsg ? <div className="megdia">
                    <div className="comwra">
                        <div onClick={() => setismsg(prev => !prev)} className="cancel"><i class="fa-sharp fa-solid fa-xmark"></i></div>
                        <h2 className="comhead">New Comment</h2>
                        <form onSubmit={messageSubmit}>
                            <input className='comtext' type="text" placeholder='comment' value={content} onChange={(e) => setreply(e.target.value)} />
                            <input className='btndel' type="submit" value="Comment" />
                        </form>
                    </div>
                </div> : ""}
            </div>
            <ToastContainer />
        </div >
    )
}