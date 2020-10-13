import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import M from "materialize-css";

import "./CreatePosts.css";
function CreatePosts() {
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (url) {
      fetch("/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          title,
          body,
          pic: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            console.log(data.error);
            M.toast({ html: "kjdskj", classes: "#d32f2f red darken" });
          } else {
            M.toast({
              html: "Created Post Succesfully",
              classes: "#43a047 green darken",
            });
            history.push("/");
          }
        })
        .catch((err) => console.log(err));
    }
  }, [url]);

  const postImage = () => {
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
  };

  return (
    <div className='createpost-wrapper'>
      <div className='card input-filed createpost-card'>
        <input
          type='text'
          placeholder='title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type='text'
          placeholder='body'
          value={body}
          onChange={(e) => setBody(e.target.value)}
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
        <button className='waves-effect btn mybtn' onClick={postImage}>
          submit post
        </button>
      </div>
    </div>
  );
}

export default CreatePosts;
