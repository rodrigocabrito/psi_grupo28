const User = require('../models/user');
const Game = require('../models/game');
var async = require('async');
const { body,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');

exports.user_search = function(req, res, next){
  let l = [];
  User.find()
  .sort([['name', 'ascending']])
  .exec(function (err, list_users) {
    for(let index = 0; index < list_users.length; index++){
      if (list_users[index].username.toLowerCase().includes(req.params.param.toLowerCase())) {
        l.push({id:list_users[index]._id, name:list_users[index].username});
        console.log(list_users[index].username);
      }
    }
    console.log(l);
    res.json(l);
  })
}

exports.user_list = function(req, res)  {
  let temp =[];
  User.find()
  .sort([['username', 'ascending']])
  .exec(function (err, list_users) {
      if (err) { return next(err); }
      //Successful, so render
      var count =0;
      for (let index = 0; index < list_users.length; index++) {
          temp.push({name:list_users[index].username});
          count++;
          if(count == list_users.length){
              res.json(temp);
          } 
      }
  });
};


exports.user_detail = function(req, res, next) {

  User.findById(req.params.id)
  .exec(function (err, user) {
    if (err) { return next(err); }
    if (user==null) { // No results.
        var err = new Error('User not found');
        err.status = 404;
        return next(err);
      }
    // Successful, so render.
    res.json({id:user._id, name:user.username, followers:user.followers, following:user.following, games:user.games, photo:user.photo, wallet:user.wallet});
  })

};

exports.loginUser = function(req, res, next){
  User.find({ 'username': req.params.param1})
    .exec(async function(err, user){
      if (err) { return next(err); }
      if (user.length === 0) {
        var err = new Error('User not found');
        err.status = 404;
        res.send({id:"0" ,username: "", followers: [], following: [], games:[]});
        return next(err);
      }
       if (user[0].password !== req.params.param2) {
        var err = new Error('User password error');
        err.status = 401;
        res.send({id:"0" ,username: "", followers: [], following: [], games:[]});
        return next(err);
       } 
       res.send({id:user[0]._id ,username: user[0].username, followers: user[0].followers, following: user[0].following, games:[]})
    })
};


exports.create_user = async function(req, res, next){

      const user = new User({name:req.body.name});
      const m = await user.save();
      res.json({id: m._id ,name:m.username});  
};

exports.update_user = async function(req, res, next) {
  if (req.body.profile_image) {
    res.send(await User.findOneAndUpdate({_id:req.params.id}, {$set:{username: req.body.name, photo: req.body.profile_image}}, { new : true}));
  }else{
    res.send(await User.findOneAndUpdate({_id:req.params.id}, {$set:{username: req.body.name}}, { new : true}));
  }
  
}



exports.delete_user = async function (req, res, next) {
    User.findByIdAndRemove(req.params.id, function deleteAuthor(err) {
        if (err) { return next(err); }
        // Success - go to author list
        res.json("seccess")
    })
};

exports.registerUser = async function (req, res, next) {
  console.log(req.body.username)
    User.find({ 'username': req.body.username})
    .exec(async function(err, user){
      if (err) { return next(err); }
      if (user.length === 0) {
        const user1 = new User({username: req.body.username, password: req.body.password, followers: [], following: [], games:[], wishlist:[],
           photo:"https://cdn-icons-png.flaticon.com/128/808/808439.png", wallet:0});
        const user2 = await user1.save();
        res.send({id:user2._id ,username: user2.username, followers: user2.followers, following: user2.following})
      }else{
        res.send({id:"0" ,username: "", followers: [], following: [], games:[]});
      }
        
    })
};

exports.follow = function (req, res, next){
  const userVisitor = User.findById(req.body.selfid);
  const userVisited = User.findById(req.body.otherid);
  userVisitor.exec(async function (err, user){
    if(!user.following.includes(req.body.otherid)){
      user.following.push(req.body.otherid);
      res.send(await User.findOneAndUpdate({_id:req.body.selfid}, {$set:{following: user.following}}, {}));
    }
  })
};

exports.followed = function (req, res, next){
  const userVisitor = User.findById(req.body.selfid);
  const userVisited = User.findById(req.body.otherid);
  userVisited.exec(async function (err, user){
    if(!user.followers.includes(req.body.selfid)){
      user.followers.push(req.body.selfid);
      res.send(await User.findOneAndUpdate({_id:req.body.otherid}, {$set:{followers: user.followers}}, {}));
    } 
  })
};

exports.getGamesLibrary = function (req, res, next){
  let gamesList = [];
  User.findById(req.params.id).exec(function (err, user){
    if (err) {
      return next(err);
    }
    for (let index = 0; index < user.games.length; index++) {
      Game.findById(user.games[index]).exec(function (err1, games){
        if (err1) {
          return next(err1);
        }
          gamesList.push({id:games._id, name:games.name, image_p:games.image_p, date:games?.date});
          if (index === user.games.length-1) {
            res.send(gamesList);
          }
      }); 
      }
        
    });
};
