import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Homepage({ tweetdialog, settweetdialog }) {
    const navigate = useNavigate();
    const [replytweet, setreplytweet] = useState();
    const [content, setreply] = useState('');
    const [ismsg, setismsg] = useState(false);
    const [alltweets, setalltweets] = useState([]);
    const [msg, setmsg] = useState('');
    const [tweet, settweet] = useState({ content: '', tweetphoto: '' });
    //request the server to fetch a single user details
    const searchPofile = ({ id }) => {
        axios.get(`http://localhost:5000/api/user/${id}`, { headers: { 'x-token': localStorage.getItem('token') } }).then(res => {
            localStorage.setItem("profile", JSON.stringify(res.data));
            return navigate('/profile');
        });
    }
    //request the server to submit a reply
    const messageSubmit = (e) => {
        e.preventDefault();
        axios.post(`http://localhost:5000/api/tweet/${replytweet}/reply`, { content }, { headers: { 'x-token': localStorage.getItem('token') } }).then(res => {
            setmsg(res.data);
            toast(res.data);
            setismsg(prev => !prev);
        }).catch(err => {
            if (err.response.status === 400) {
                toast(err.response.data);
                setmsg(err.response.data);
            }
        });
    }
    //request the server to delete a tweet
    const deleteHandler = ({ id }) => {
        axios.delete(`http://localhost:5000/api/tweet/${id}`, { headers: { 'x-token': localStorage.getItem('token') } }).then(res => {
            setmsg(res.data);
            toast(res.data);
        })
    }
    const messageHandler = ({ id }) => {
        setismsg(prev => !prev);
        setreplytweet(id);
    }
    //request the server to retweet the tweet
    const retweetHandler = ({ id }) => {
        axios.post(`http://localhost:5000/api/tweet/${id}/retweet`, "payload", { headers: { 'x-token': localStorage.getItem('token') } }).then(res => {
            setmsg(res.data);
            toast(res.data);
        }).catch(err => {
            if (err.response.status === 405) {
                toast("you alredy retweeted it");
                setmsg(err.response.data);
            }
        });
    }
    //request the server to update the like status of this post
    const likeHandler = ({ id, islike }) => {
        if (islike) {
            axios.put(`http://localhost:5000/api/tweet/${id}/dislike`, "payload", { headers: { 'x-token': localStorage.getItem('token') } }).then(res => setmsg(res.data)).catch(err => setmsg(err.response.data));
            toast("you disliked this tweet");
        }
        else {
            axios.put(`http://localhost:5000/api/tweet/${id}/like`, "payload", { headers: { 'x-token': localStorage.getItem('token') } }).then(res => setmsg(res.data)).catch(err => setmsg(err.response.data));
            toast("you liked this tweet");
        }
    }
    //request the server to fetch a single tweet imformation
    const opentweet = (id) => {
        axios.get(`http://localhost:5000/api/tweet/${id}`, { headers: { 'x-token': `${localStorage.getItem('token')}` } }).then(res => {
            localStorage.setItem('tweet', JSON.stringify(res.data.others));
            return navigate('/singletweet');
        });
    }
    useEffect(() => {
        axios.get('http://localhost:5000/api/tweet', { headers: { 'x-token': `${localStorage.getItem('token')}` } }).then(res => {
            setalltweets(res.data);
            console.log(res.data);
        }).catch(err => toast(err.response.data));
    }, [msg]);
    return (
        <div className='hp homepg'>
            {/* avail button to make a tweet */}
            <button className='hometweetbtn' onClick={() => settweetdialog(prev => !prev)}>{tweetdialog ? "Cancel" : "Tweet"}</button>
            <div className="alltweets">
                {/* display all tweets by map the alltweets array */}
                {alltweets?.map((tweet, index) => {
                    return (
                        <div key={index} className="tweet">
                            <div className="tweetimg">
                                {/* set the profile when it has otherwise set a default profile */}
                                {tweet.tweetedby.image === "" ? <img className='tweetprofile' src='default.jpg' alt='profile' width={35} height={30} /> :
                                    <img className='tweetprofile' src={`http://localhost:5000/images/${tweet.tweetedby.image}`} alt="tweetimage" width={35} height={30} />}
                            </div>
                            <div className="tweetmat">
                                <div onClick={() => searchPofile({ id: tweet.tweetedby._id })} className='twusername'>@{tweet.tweetedby.username}   <span className='createdat'>   -{tweet.createdAt}</span> </div>
                                <p onClick={() => opentweet(tweet._id)} className='tweetcont'>{tweet.content}</p>
                                {tweet.image === "" ? "" : <img src={`http://localhost:5000/tweetimages/${tweet.image}`} alt='tweetimg' width={200} height={180} />}
                                <div className="btnes">
                                    <ul className="btns">
                                        <li onClick={() => likeHandler({ id: tweet._id, islike: tweet.islike })} className={tweet.islike ? "likebtn liked" : "likebtn"}>{tweet.likes.length}<i class="fa-solid fa-heart"></i></li>
                                        <li onClick={() => messageHandler({ id: tweet._id })} className='replybtn'><i class="fa-regular fa-comment"></i></li>
                                        <li onClick={() => retweetHandler({ id: tweet._id })} className={tweet.isretweeted ? "retweetbtn retweeted" : "retweetbtn"}>{tweet.retweetby.length}<i class="fa-solid fa-retweet"></i></li>
                                        {/* avail the delete buttun for the only amdin of this tweet */}
                                        {
                                            tweet.isdeletebtn ?
                                                <li onClick={() => deleteHandler({ id: tweet._id })} className='deletebtn'><i class="fa-solid fa-trash"></i></li>
                                                : ""
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
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
            <ToastContainer />
        </div>
    );
}