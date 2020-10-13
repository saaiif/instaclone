import React, { useEffect, useState, useContext } from "react";

import { UserContext } from "../../App";
import M from "materialize-css";

import "./Profile.css";

function Profile() {
  const [mypost, setMypost] = useState([]);
  const [image, setImage] = useState("");
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    fetch("/mypost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setMypost(result.myPosts);
      });
  }, []);

  console.log(mypost);
  useEffect(() => {
    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "instagram_clone");
      data.append("cloud_name", "saifcs");
      fetch("https://api.cloudinary.com/v1_1/saifcs/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          fetch("/updatepic", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
              pic: data.secure_url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              console.log(result);
              localStorage.setItem(
                "user",
                JSON.stringify({ ...state, pic: result.pic })
              );
              dispatch({ type: "UPDATEPIC", payload: result.pic });
            });
        })
        .catch((err) => console.log(err));
    }
  }, [image]);

  const uploadPic = (file) => {
    setImage(file);
  };
  const deleteProfile = (postId) => {
    fetch(`/deleteProfile/${postId}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = image.filter((item) => {
          return item._id !== result.myPosts._id;
        });
        setMypost(newData);
      })
      .then((data) => {
        if (!data) {
          M.toast({
            html: "Deleted Pic Successfully",
            classes: "#43a047 green darken",
          });
        }
      })

      .catch((err) => console.log(err));
  };
  return (
    <div className='main-container'>
      <div className='bio-wrapper'>
        <div className='avatar-img'>
          <img src={state ? state.pic : "loading..."} alt='avatar' />
          <div className='file-field input-field'>
            <div className='btn'>
              <span>upload image</span>
              <input
                type='file'
                onChange={(e) => uploadPic(e.target.files[0])}
              />
            </div>
            <div className='file-path-wrapper'>
              <input
                className='file-path validate'
                type='text'
                placeholder='Upload file'
              />
            </div>
          </div>
          <h5 className='avatar-name'>{state ? state.name : "loading..."}</h5>
          <h5 className='avatar-name'>{state ? state.email : "loading..."}</h5>
        </div>
        <div className='follow-details'>
          <h5 className='name'>{state ? state.name : "loading..."}</h5>
          <h5 className='name'>{state ? state.email : "loading..."}</h5>
          <div className='details'>
            <div className='insta-counts'>
              <h6 className='counts'>{mypost.length}</h6>
              <h6 className='vars'>posts</h6>
            </div>
            <div className='insta-counts'>
              <h6 className='counts'>{state ? state.followers.length : 0}</h6>
              <h6 className='vars'>followers</h6>
            </div>
            <div className='insta-counts'>
              <h6 className='counts'>{state ? state.following.length : 0}</h6>
              <h6 className='vars'>following</h6>
            </div>
          </div>
        </div>
      </div>

      <div className='gallery-container'>
        <div className='gallery'>
          {mypost.map((item) => {
            return <img className='item' src={item.photo} alt={item.title} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default Profile;
