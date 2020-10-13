import React, { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../../App";
import M from "materialize-css";

import logo from "../../images/logo.png";

import "./SignIn.css";

function SignIn() {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const postData = () => {
    fetch("/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#d32f2f red darken" });
        } else {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });
          M.toast({
            html: "Signed In succesfully",
            classes: "#43a047 green darken",
          });
          history.push("/");
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className='main-signin'>
      <div className='card signin-card'>
        <img src={logo} alt='logo' />
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
        <button className='waves-effect btn mybtn' onClick={postData}>
          sign in
        </button>
        <Link to='/signup'>
          <h5 className='signin-question'>Don't have an account ?</h5>
        </Link>
      </div>
    </div>
  );
}

export default SignIn;
