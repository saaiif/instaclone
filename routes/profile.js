const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireSignin = require("../middlewares/requireSignin");

const Post = mongoose.model("Post");
const User = mongoose.model("User");

router.get("/profile/:id", requireSignin, (req, res) => {
  User.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .exec((err, posts) => {
          if (err) {
            return res.status(422).json({ error: err });
          }
          res.json({ user, posts });
        });
    })
    .catch((err) => {
      return res.status(404).json({ error: "User not found" });
    });
});

router.put("/follow", requireSignin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user._id },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followId },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status.json({ error: err });
        });
    }
  );
});
router.put("/unfollow", requireSignin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowId,
    {
      $pull: { followers: req.user._id },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.body.unfollowId },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status.json({ error: err });
        });
    }
  );
});

router.put("/updatepic", requireSignin, (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { pic: req.body.pic } },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: "Cannot post" });
      }
      res.json(result);
    }
  );
});

router.post("/search-users", (req, res) => {
  let userPattern = new RegExp("^" + req.body.query);
  User.find({ email: { $regex: userPattern } })
    .select("_id email")
    .then((user) => {
      res.json({ user });
    })
    .catch((err) => {
      console.log(err);
    });
});

// router.delete('/deleteProfile/:postId',requireSignin,(req,res)=>{
//   User.findOne({_id:req.params.postId})
//   .populate('comments.postedBy', '_id name')
//   .populate('postedBy','_id')
//   .exec((err,post)=>{
//     if(err || !user){
//       return res.status(422).json({error:err})
//     }if(user.postedBy._id.toString() === req.user._id.toString()){
//       user.remove()
//       .then(result=>{
//       return res.json(result)
//       }).catch(err=>{
//         console.log(err)
//       })
//     }
//   })
// }

module.exports = router;
