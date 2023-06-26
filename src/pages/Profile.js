import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Profile() {
    const [data, setdata] = useState(JSON.parse(localStorage.getItem('profile')))
    const [isfollow, setisfollow] = useState(data.followers.includes(localStorage.getItem('userid')));
    const [follolenght, setfollolenght] = useState(data.followers.length);
    const [profilephoto, setprofilephoto] = useState();
    const navigate = useNavigate();
    const [replytweet, setreplytweet] = useState();
    const [content, setreply] = useState('');
    const [ismsg, setismsg] = useState(false);
    const [alltweets, setalltweets] = useState([]);
    const [msg, setmsg] = useState('');
    const [isedit, setisedit] = useState(false);
    const [eddetails, seteddetails] = useState({ name: '', location: '', dob: '' });
    // filter the tweets post by us
    const ourtweets = alltweets.filter(ourtweet => ourtweet.tweetedby._id === data._id);
    const editHandler = (e) => {
        seteddetails({ ...eddetails, [e.target.name]: e.target.value });
    }
    //request the server to change the extra information of the user
    const editsubmithandleer = async (e) => {
        e.preventDefault();
        await axios.put(`http://localhost:5000/api/user/${localStorage.getItem('userid')}`, eddetails, { headers: { 'x-token': localStorage.getItem('token') } }).then(res => {
            setmsg(res.data);
            toast(res.data);
            refresh();
        });
        setisedit(prev => !prev)
        function refresh() {
            axios.get(`http://localhost:5000/api/user/${data._id}`, { headers: { 'x-token': localStorage.getItem('token') } }).then(res => {
                setdata(res.data);
                localStorage.setItem("profile", JSON.stringify(res.data));
                return navigate('/profile');
            });
        }
    }
    //request the server to fetch a single user details
    const searchPofile = ({ id }) => {
        axios.get(`http://localhost:5000/api/user/${id}`, { headers: { 'x-token': localStorage.getItem('token') } }).then(res => {
            localStorage.setItem("profile", JSON.stringify(res.data));
            return navigate('/profile');
        });
    }
    //request the server to submit a reply
    const messageSubmit = () => {
        axios.post(`http://localhost:5000/api/tweet/${replytweet}/reply`, { content }, { headers: { 'x-token': localStorage.getItem('token') } }).then(res => {
            setmsg(res.data);
            toast(res.data);
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
        axios.put(`http://localhost:5000/api/tweet/${id}/retweet`, "payload", { headers: { 'x-token': localStorage.getItem('token') } }).then(res => {
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
    //request the server to update the follow status of the user
    const followHandler = () => {
        if (isfollow) {
            axios.put(`http://localhost:5000/api/user/${data._id}/unfollow`, "payload", { headers: { 'x-token': localStorage.getItem('token') } }).then(res => { setmsg(res.data); toast("unfollowed sucessfully") }).catch(err => setmsg(err.resp.msg));
            setfollolenght(prev => prev - 1);
            setisfollow(prev => !prev);
        }
        else {
            axios.put(`http://localhost:5000/api/user/${data._id}/follow`, "payload", { headers: { 'x-token': localStorage.getItem('token') } }).then(res => { setmsg(res.data); toast('follow sucessfully') }).catch(err => setmsg(err.resp.msg));
            setfollolenght(prev => prev + 1);
            setisfollow(prev => !prev);
        }
    }
    //request the server to fetch a single tweet imformation
    const opentweet = (id) => {
        axios.get(`http://localhost:5000/api/tweet/${id}`, { headers: { 'x-token': `${localStorage.getItem('token')}` } }).then(res => {
            localStorage.setItem('tweet', JSON.stringify(res.data.others));
            return navigate('/singletweet');
        });
    }
    //request the server to set or update the profile
    const uploadProfile = (e) => {
        e.preventDefault();
        const formdata = new FormData();
        formdata.append('profilephoto', profilephoto);
        axios.post(`http://localhost:5000/api/user/${data._id}/uploadprofile`, formdata).then(res => { setmsg(res.data); toast('profile uploaded successfully'); refresh(); }).catch(err => console.log(err.response));
        function refresh() {
            axios.get(`http://localhost:5000/api/user/${data._id}`, { headers: { 'x-token': localStorage.getItem('token') } }).then(res => {
                setdata(res.data);
                localStorage.setItem("profile", JSON.stringify(res.data));
                window.location.reload(false);
                return navigate('/profile');
            });
        }
    }
    //request the server to get all tweets.
    useEffect(() => {
        axios.get('http://localhost:5000/api/tweet', { headers: { 'x-token': `${localStorage.getItem('token')}` } }).then(res => {
            setalltweets(res.data);
        }).catch(err => console.log(err.response));
    }, [msg]);
    if (!localStorage.getItem('token')) {
        return navigate('/login');
    }
    return (
        <div className='notginh'>
            {localStorage.getItem('token') ? <div className="wap">
                {/* avail a dialog to edit the user information */}
                {isedit ? <div className="ided">
                    <div className="edwrap">
                        <h2 className='idedhead'>Edit profile</h2>
                        <div onClick={() => setisedit(prev => !prev)} className="canlog"><i class="fa-sharp fa-solid fa-xmark"></i></div>
                        <form className='edformpro' onSubmit={editsubmithandleer}>
                            <input className='proitemed' onChange={editHandler} type="text" value={eddetails.name} name='name' placeholder='Name' autoComplete='off' />
                            <input className='proitemed' onChange={editHandler} type="text" value={eddetails.location} name='location' placeholder='Location' autoComplete='off' />
                            <input className='proitemed' onChange={editHandler} type="date" name="dob" id="eddate" />
                            <input className='probtned' type="submit" value="Edit" />
                        </form>
                    </div>
                </div> : ""}
                <div className="wraper">
                    <div className="usersidebar"><Sidebar /></div>
                    <div className="prowraper">
                        <div className="style"></div>
                        <div className="userprofile">
                            <div className="proupedwrap">
                                <div className="proimg">
                                    {/* set the profile when it has otherwise set a default profile */}
                                    {data.image === "" ? <img className='usermainpro' src='default.jpg' alt='profileimage' width={70} height={70} /> :
                                        <img className='usermainpro' src={`http://localhost:5000/images/${data.image}`} width={70} height={70} alt="profileimage" />
                                    }
                                    <div className="prousnam">
                                        {data.name}
                                    </div>
                                    <div className="detailsall prouser">@{data.username}</div>
                                </div>
                                <div className="upedwrap">
                                    {/* avail button only for the admin to change or set profile */}
                                    {data.isadmin ? <div className="photoupload">
                                        <form onSubmit={uploadProfile}>
                                            <input onChange={(e) => setprofilephoto(e.target.files[0])} type="file" name="profilphoto" id="profilephoto" required />
                                            <input className='uppobt' type="submit" value="Upload Profile Photo" />
                                        </form>
                                    </div> : ""}
                                    {data.isadmin ? <div className='editbox'><button onClick={() => setisedit(prev => !prev)} className='editbt'>Edit</button></div> : ""}
                                </div>
                            </div>
                            {/* extra information a user */}
                            <div className="edits">
                                <div className="loc"><span className="locdot"><i class="fa-solid fa-location-dot"></i></span> {data.location}</div>
                                <div className="dob"><span className="calendot"><i class="fa-solid fa-calendar-days"></i></span> {data.dob}</div>
                            </div>
                            <div className="folflo">
                                <div className="detailsall profollowers">{follolenght}  Followers</div>
                                <div className="detailsall profollowing"> {data.following.length === 0 ? 0 : data.following.lenght}  Following</div>
                            </div>
                            {data.isadmin ? "" : <div className='followdiv'><button onClick={followHandler} className='followbtn'>{data.followers.includes(localStorage.getItem('userid')) ? "follwing" : "Follow"}</button></div>}
                        </div>
                        <div className='hp'>
                            <div className="alltweets">
                                <h2 className='tweethead'>Tweets</h2>
                                {/* display all tweets by map the ourtwwets array */}
                                {ourtweets?.map((tweet, index) => {
                                    return (
                                        <div key={index} className="tweet">
                                            <div className="tweetimg">
                                                {/* set the profile when it has otherwise set a default profile */}
                                                {tweet.tweetedby.image === "" ? <img className='protweimg' src='default.jpg' alt='profile' width={40} height={35} /> :
                                                    <img className='protweimg' src={`http://localhost:5000/images/${tweet.tweetedby.image}`} alt="tweetimage" width={40} height={35} />}
                                            </div>
                                            <div className="tweetmat">
                                                <div onClick={() => searchPofile({ id: tweet.tweetedby._id })} className='twusername'>@{tweet.tweetedby.username}</div> <span>   -{tweet.createdAt}</span>
                                                <p onClick={() => opentweet(tweet._id)} className='tweetcont'>{tweet.content}</p>
                                                {tweet.image === "" ? "" : <img src={`http://localhost:5000/tweetimages/${tweet.image}`} alt='tweetimg' width={100} height={80} />}
                                                <div className="btns">
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
                        </div>
                        {/* avail a dialogbox to make the comments */}
                        {ismsg ? <div className="megdia" style={{ backgroundColor: 'whitesmoke' }}>
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
                </div>
                <ToastContainer />
            </div> : <Navigate to='/login' />}
        </div>
    )
}