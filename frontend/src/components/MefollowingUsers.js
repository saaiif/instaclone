import React, { useState, useContext } from "react";
import { UserContext } from ".././App";
import M from "materialize-css";

import loader from ".././images/spinner.gif";

import "./Home/Home.css";
import { Link } from "react-router-dom";

function MefollowingUsers() {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  React.useEffect(() => {
    fetch("/mefollowing", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result.posts);
        setData(result.posts);
      });
  }, []);

  const likePost = (id) => {
    fetch("/likes", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => console.log(err));
  };

  const unlikePost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => console.log(err));
  };

  const myComments = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => console.log(err));
  };

  const reset = (e) => {
    myComments(e.value === "");
  };

  const deletePost = (postId) => {
    fetch(`/deletePost/${postId}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
      })
      .then((data) => {
        if (!data) {
          M.toast({
            html: "Deleted Post Successfully",
            classes: "#43a047 green darken",
          });
        }
      })

      .catch((err) => console.log(err));
  };
  const deleteComment = (postId, text) => {
    fetch("/deleteComment", {
      method: "put",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .then((data) => {
        if (!data) {
          M.toast({
            html: "Deleted Comment Successfully",
            classes: "#43a047 green darken",
          });
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      {data ? (
        <div className='home'>
          {data.map((item) => {
            return (
              <div className='card home-card' key={item._id}>
                <div className='top-section'>
                  <img src={item.photo} alt='myself' />
                  <h5 className='posted-by'>
                    <Link
                      to={
                        item.postedBy._id === state._id
                          ? "/profile"
                          : "/userprofile/" + item.postedBy._id
                      }
                    >
                      {item.postedBy.name}
                    </Link>
                  </h5>
                </div>
                <div className='remove-post'>
                  {item.postedBy._id === state._id && (
                    <i
                      className='material-icons'
                      style={{ cursor: "pointer" }}
                      onClick={() => deletePost(item._id)}
                    >
                      delete
                    </i>
                  )}
                </div>

                <div className='card-image'>
                  <img src={item.photo} alt='myself' />
                </div>
                <div className='card-content'>
                  {item.likes.includes(state._id) ? (
                    <i
                      className='material-icons reactions'
                      style={{ cursor: "pointer" }}
                      onClick={() => unlikePost(item._id)}
                    >
                      thumb_down
                    </i>
                  ) : (
                    <i
                      className='material-icons reactions'
                      style={{ cursor: "pointer" }}
                      onClick={() => likePost(item._id)}
                    >
                      thumb_up
                    </i>
                  )}
                  <h6 className='likes-count'>{item.likes.length} likes</h6>
                  <h6>{item.title}</h6>
                  <p>{item.body}</p>
                  {item.comments.map((record) => {
                    return (
                      <div className='comment-sec'>
                        <h6 key={record._id}>
                          <span style={{ fontWeight: "600" }}>
                            {record.postedBy.name}
                          </span>{" "}
                          {record.text}
                        </h6>
                        {item.postedBy._id === state._id && (
                          <i
                            className='material-icons'
                            style={{ cursor: "pointer" }}
                            onClick={() => deleteComment(item._id)}
                          >
                            delete
                          </i>
                        )}
                      </div>
                    );
                  })}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      myComments(e.target[0].value, item._id);
                    }}
                  >
                    <input type='text' placeholder='Add Comment' />
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <img src={loader} alt='loading' />
      )}
    </>
  );
}

export default MefollowingUsers;
