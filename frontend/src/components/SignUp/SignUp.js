import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

import logo from "../../images/logo.png";

import "./SignUp.css";
import { useEffect } from "react";

function SignUp() {
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState(undefined);

  const uploadProfilePic=()=>{
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
        setUrl(data.secure_url);
      })
      .catch((err) => console.log(err));
  }

  const postData=()=>{
    if(image){
      uploadProfilePic()
    }else{
      uploadFields()
    }
  }

  const uploadFields = () => {
    // if (
    //   !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    //     email
    //   )
    // ) {
    //   return M.toast({ html: "Invalid email", classes: "#d32f2f red darken" });
    // }
    fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        pic:url
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#d32f2f red darken" });
        } else {
          M.toast({ html: data.message, classes: "#43a047 green darken" });
          history.push("/signin");
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(()=>{
    if(url){
      uploadFields()
    }
  },[url])

  return (
    <div className='main-signup'>
      <div className='card signup-card'>
        <img src={logo} alt='logo' />
        <input
          type='text'
          placeholder='name'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type='email'
          placeholder='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type='password'
          placeholder='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className='file-field input-field'>
          <div className='btn'>
            <span>upload image</span>
            <input type='file' onChange={(e) => setImage(e.target.files[0])} />
          </div>
          <div className='file-path-wrapper'>
            <input
              className='file-path validate'
              type='text'
              placeholder='Upload file'
            />
          </div>
        </div>
        <button className='waves-effect btn mybtn' onClick={postData}>
          sign up
        </button>
        <Link to='/signin'>
          <h5 className='signup-question'>Already have an account ?</h5>
        </Link>
      </div>
    </div>
  );
}

export default SignUp;
