import React, { useContext, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import logo from "../../images/logo.png";
import { UserContext } from "../../App";
import M from "materialize-css/dist/js/materialize.min.js";

import "./Navbar.css";
export default function Navbar() {
  const searchModal = useRef(null);
  const [search, setSearch] = useState("");
  const [userDetails, setUserDetails] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();

  React.useEffect(() => {
    M.Modal.init(searchModal.current);
    let sidenav = document.querySelector("#slide-out");
    M.Sidenav.init(sidenav, {});
  }, []);

  const fetchUsers = (query) => {
    setSearch(query);
    fetch("/search-users", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setUserDetails(result.user);
      })
      .catch((err) => console.log(err));
  };

  const renderList = () => {
    if (state) {
      return [
        <li key='1'>
          <i
            data-target='modal1'
            className='large material-icons modal-trigger'
            style={{ color: "black", display: "block" }}
          >
            search
          </i>
        </li>,
        <li key={2}>
          <Link to='/profile'>Profile</Link>
        </li>,
        <li key={3}>
          <Link to='/createposts'>Create Posts</Link>
        </li>,
        <li key={4}>
          <Link to='/mefollowingusers'>My Following</Link>
        </li>,

        <li key={5}>
          <button
            className='btn logout-btn'
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              history.push("/signin");
            }}
          >
            logout
          </button>
        </li>,
      ];
    } else {
      return [
        <li key={6}>
          <Link to='/signin'>Sign In</Link>
        </li>,
        <li key={7}>
          <Link to='/signup'>Sign Up</Link>
        </li>,
      ];
    }
  };
  return (
    <div>
      <nav>
        <div className='nav-wrapper white'>
          <a
            href='#'
            data-target='slide-out'
            className='sidenav-trigger show-on-large burger-icon'
          >
            <i className='material-icons'>menu</i>
          </a>
          <Link to={state ? "/" : "/signin"} className='brand-logo'>
            <img src={logo} alt='logo' />
          </Link>
          <ul id='nav-mobile' className='right menus'>
            {renderList()}
          </ul>
        </div>
      </nav>
      <div
        id='modal1'
        className='modal'
        ref={searchModal}
        style={{ color: "#000000" }}
      >
        <div className='modal-content'>
          <input
            type='text'
            placeholder='search user'
            value={search}
            onChange={(e) => fetchUsers(e.target.value)}
          />
          <ul className='collection'>
            {userDetails.map((users) => {
              return (
                <Link
                  to={
                    users._id !== state._id
                      ? "/userprofile/" + users._id
                      : "/profile"
                  }
                  onClick={() => {
                    M.Modal.getInstance(searchModal.current).close();
                    setSearch("");
                  }}
                >
                  <li className='collection-item'>{users.email}</li>
                </Link>
              );
            })}
          </ul>
        </div>
        <div className='modal-footer'>
          <button
            className='modal-close waves-effect waves-green btn-flat'
            onClick={() => setSearch("")}
          >
            Close
          </button>
        </div>
      </div>
      <ul id='slide-out' className='sidenav sidenav-close'>
        {renderList()}
      </ul>
    </div>
  );
}
