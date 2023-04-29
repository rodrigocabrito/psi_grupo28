const User = require('../models/user');
var Pet = require("../models/pet");
var async = require('async');
const { body,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');


exports.user_list = function(req, res)  {
    let temp =[];
    User.find()
    .sort([['name', 'ascending']])
    .exec( function (err, list_users) {
      if (err) { return next(err); }
      //Successful, so render
      var count =0;
      for (let index = 0; index < list_users.length; index++) {
        if (list_users[index].pet.length == 0) {
          temp.push({id:list_users[index]._id, name:list_users[index].name, petname:list_users[index].pet});
          count++;
        }else{
          Pet.findById(list_users[index].pet[0])
          .exec( function (err, pet) {
              if (err) { return next(err); }
              if (pet==null) { // No results.
                  var err = new Error('Book copy not found');
                  err.status = 404;
                  return next(err);
                }
                temp.push({id:list_users[index]._id, name:list_users[index].name, petname:{id:pet._id, name:pet.name}});
                count++;
                if(count == list_users.length){
                  res.json(temp);
                } 
          })
        }
      }
      if(count == list_users.length){
        res.json(temp);
      } 
    });
};

exports.user_detail = function(req, res, next) {

    User.findById(req.params.id)
    .populate('name')
    .exec(function (err, user) {
      if (err) { return next(err); }
      if (user==null) { // No results.
          var err = new Error('Book copy not found');
          err.status = 404;
          return next(err);
        }
      // Successful, so render.
      if (user.pet.length == 0) {
        res.json({id:user._id, name:user.name, petname:user.pet});
      }else{
        Pet.findById(user.pet[0])
          .exec(function (err, pet) {
              if (err) { return next(err); }
              if (pet==null) { // No results.
                  var err = new Error('Book copy not found');
                  err.status = 404;
                  return next(err);
                }
                res.json({id:user._id, name:user.name, petname:{id:pet._id, name:pet.name}});
          })
      }
      
    })

};

exports.create_user = async function(req, res, next){

      const user = new User({name:req.body.name});
      const m = await user.save();
      res.json({id: m._id ,name:m.name});  
}

exports.update_user = async function(req, res, next) {
    Pet.findById(req.body.petname)
    .exec(async function (err, pet) {
      if (err) { return next(err); }
      if (pet==null) { // No results.
        res.send(await User.findOneAndUpdate({_id:req.params.id}, {name: req.body.name}, { new : true}));
        return;
      }
    res.send(await User.findOneAndUpdate({_id:req.params.id}, {name: req.body.name, pet: pet._id }, { new : true}));//{ name : req.params.name , pet : req.params.pe};
    })
}

exports.delete_user = async function (req, res, next) {
    User.findByIdAndRemove(req.params.id, function deleteAuthor(err) {
        if (err) { return next(err); }
        // Success - go to author list
        res.json("seccess")
    })
}

exports.pet_user = function(req, res, next){
    User.find({ 'pet': req.params.id })
    .exec(function (err, list_users) {
        if (err) { return next(err); }
        //Successful, so render
        
        res.json(list_users);
      });
}