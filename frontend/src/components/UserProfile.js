import React, { useEffect, useState, useContext } from "react";

import himanshi from "../images/himanshi.jpg";

import loader from '../images/spinner.gif'

import { UserContext } from "../App";
import {useParams} from 'react-router-dom'

import './Profile/Profile.css'

function UserProfile() {
  const [userprofile, setUserProfile] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const {userid}  = useParams()
  const [showfollowers, setShowFollowers] = useState(state?!state.following.includes(userid):true);
  useEffect(() => {
    fetch(`/profile/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setUserProfile(result)
        // setMypost(result.myPosts);
      });
  }, []);

  const followUser =()=>{
    fetch('/follow',{
      method:'put',
      headers:{
        'Content-Type':'application/json',
        'Authorization':'Bearer '+localStorage.getItem('jwt')
      },
      body:JSON.stringify({
        followId:userid
      })
    }).then(res=>res.json())
    .then(result=>{
      console.log(result);
      dispatch({type:'UPDATE',payload:{followers:result.followers,following:result.following}})
      localStorage.setItem('user',JSON.stringify(result))
      setUserProfile(prevState=>{
        return{
          ...prevState,
          user:{
            ...prevState.user,
            followers:[...prevState.user.followers,result._id]

          }
        }
      })
      setShowFollowers(false)
    })
  }

  const unfollowUser=()=>{
    fetch('/unfollow',{
      method:'put',
      headers:{
        'Content-Type':'application/json',
          'Authorization':'Bearer '+localStorage.getItem('jwt')
      },
      body:JSON.stringify({
        unfollowId:userid
      })
    }).then(res=>res.json())
    .then(result=>{
      dispatch({type:'UPDATE',payload:{followers:result.followers,following:result.following}})
      localStorage.setItem('user',JSON.stringify(result))
      setUserProfile(prevState=>{
        const newFollower= prevState.user.followers.filter(item=>item!==result._id)
        return{
          ...prevState,
          user:{
            ...prevState.user,
            followers:newFollower
          }
        }
      })
      setShowFollowers(true)
    })
  }

  return (
    <>
    {userprofile?
      <div className='main-container'>
      <div className='bio-wrapper'>
        <div className='avatar-img'>
          <img src={userprofile.user.pic} alt='avatar' />
          <h5 className='avatar-name'>{userprofile.user.name}</h5>
          <h6 className='avatar-name'>{userprofile.user.email}</h6>
        </div>
        <div className='follow-details'>
          <h5 className='name'>{userprofile.user.name}</h5>
          <h6 className='name'>{userprofile.user.email}</h6>
          <div className='details'>
            <div className='insta-counts'>
              <h6 className='counts'>{userprofile.posts.length}</h6>
              <h6 className='vars'>posts</h6>
            </div>
            <div className='insta-counts'>
              <h6 className='counts'>{userprofile.user.followers.length}</h6>
              <h6 className='vars'>followers</h6>
            </div>
            <div className='insta-counts'>
              <h6 className='counts'>{userprofile.user.following.length}</h6>
              <h6 className='vars'>following</h6>
            </div>
          </div>
          {showfollowers?<button className="btn followers-details" onClick={followUser}>Follow</button>:<button className="btn followers-details" onClick={unfollowUser}>Unfollow</button>}
        </div>
      </div>
      <div className='gallery-container'>
        <div className='gallery'>
          {userprofile.posts.map((item) => {
            return <img className='item' src={item.photo} alt={item.title} />;
          })}
        </div>
      </div>
      </div>
     : <div className="loading-section"><img className="loader" src={loader} alt="loading"/>
          <h6>Please Wait we are fetching data</h6>
     </div>

     }


    </>
  );
}

export default UserProfile;
