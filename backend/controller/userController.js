const User = require('../models/user');
var async = require('async');
const { body,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');


exports.user_list = function(req, res)  {
  let temp =[];
  User.find()
  .sort([['username', 'ascending']])
  .exec(function (err, list_users) {
      if (err) { return next(err); }
      //Successful, so render
      var count =0;
      for (let index = 0; index < list_users.length; index++) {
          temp.push({id:list_users[index]._id, username:list_users[index].username, followers:list_users[index].followers, following:list_users[index].following, games:list_users[index].games, wallet:list_users[index].wallet, cart:list_users[index].cart});
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
    res.json({id:user._id, name:user.username, followers:user.followers, following:user.following, games:user.games, wallet:user.wallet,cart:user.cart});
  })

};

exports.loginUser = function(req, res, next){
  User.find({ 'username': req.params.param1})
    .exec(async function(err, user){
      if (err) { return next(err); }
      if (user.length === 0) {
        var err = new Error('User not found');
        err.status = 404;
        res.send({id:"0" ,username: "", followers: [], following: [], games:[],cart:[]});
        return next(err);
      }
       if (user[0].password !== req.params.param2) {
        var err = new Error('User password error');
        err.status = 401;
        res.send({id:"0" ,username: "", followers: [], following: [], games:[], cart:[]});
        return next(err);
       } 
       res.send({id:user[0]._id ,username: user[0].username, followers: user[0].followers, following: user[0].following, games:[], cart:[]})
    })
}


exports.create_user = async function(req, res, next){

      const user = new User({name:req.body.name});
      const m = await user.save();
      res.json({id: m._id ,name:m.username});  
}

exports.update_user = async function(req, res, next) {
  res.send(await User.findOneAndUpdate({_id:req.params.id}, {name: req.body.name}, { new : true}));
}



exports.delete_user = async function (req, res, next) {
    User.findByIdAndRemove(req.params.id, function deleteAuthor(err) {
        if (err) { return next(err); }
        // Success - go to author list
        res.json("seccess")
    })
}

exports.registerUser = async function (req, res, next) {
  console.log(req.body.username)
    User.find({ 'username': req.body.username})
    .exec(async function(err, user){
      if (err) { return next(err); }
      if (user.length === 0) {
        const user1 = new User({username: req.body.username, password: req.body.password, wallet:0});
        console.log(user1)
        const user2 = await user1.save();
        console.log(user2)
        res.send({id:user2._id ,username: user2.username, followers: user2.followers, following: user2.following})
      }else{
        res.send({id:"0" ,username: "", followers: [], following: [], games:[], cart:[]});
      }
        
    })
}
