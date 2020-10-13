const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireSignin = require("../middlewares/requireSignin");

const Post = mongoose.model("Post");

router.get("/allposts", requireSignin, (req, res) => {
  Post.find()
    .populate("postedBy", "_id name ")
    .populate('comments.postedBy','_id name pic')
    .sort('-createdAt')
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => console.log(err));
});

router.get('/mefollowing',requireSignin,(req,res)=>{
  Post.find({postedBy:{$in:req.user.following}})
  .populate('postedBy','_id name')
  .populate('comments.postedBy','_id name')
  .sort('-createdAt')
  .then(posts=>{
    res.json({posts})
  }).catch(err=>console.log({err}))
})

router.post("/createpost", requireSignin, (req, res) => {
  const { title, body, pic } = req.body;
  if (!title || !body || !pic) {
    return res.status(401).json({ error: "Please enter all the fields" });
  }
  req.user.password = undefined;
  const post = new Post({
    title,
    body,
    photo: pic,
    postedBy: req.user,
  });
  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((err) => console.log(err));
});

router.get("/mypost", requireSignin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name photo:pic")
    .then((myPosts) => {
      res.json({ myPosts });
    })
    .catch((err) => console.log(err));
});

router.put("/likes", requireSignin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
  .populate("comments.postedBy","_id name")
  .populate('postedBy','_id name')
  .exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});

router.put("/unlike", requireSignin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
  .populate('postedBy','_id name')
  .populate("comments.postedBy","_id name")
  .exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});

router.put('/comment',requireSignin,(req,res)=>{
  const comment = {
    text:req.body.text,
    postedBy:req.user._id
  }
  Post.findByIdAndUpdate(req.body.postId,{
    $push:{comments:comment}
  },{
    new:true
  })
  .populate('comments.postedBy', '_id name')
  .populate('postedBy','_id name')
  .exec((err,result)=>{
    if(err){
      return res.status(422).json({err:err})
    }else{
      return res.json(result)
    }
  })
})

router.delete('/deletePost/:postId',requireSignin,(req,res)=>{
  Post.findOne({_id:req.params.postId})
  .populate('comments.postedBy', '_id name')
  .populate('postedBy','_id')
  .exec((err,post)=>{
    if(err || !post){
      return res.status(422).json({error:err})
    }if(post.postedBy._id.toString() === req.user._id.toString()){
      post.remove()
      .then(result=>{
      return res.json(result)
      }).catch(err=>{
        console.log(err)
      })
    }
  })
})

router.put('/deleteComment',requireSignin,(req,res)=>{
  const comment = {
    text:req.body.text,
    postedBy:req.user._id
  }
  Post.findByIdAndUpdate(req.body.postId,{
    $pull:{comments:comment}
  },{
    new:true
  })
   .populate('comments.postedBy', '_id name')
  .populate('postedBy','_id name')
  .exec((err,result)=>{
    if(err){
      return res.status(422).json({err:err})
    }else{
      return res.json(result)
    }
  })
})

module.exports = router;
