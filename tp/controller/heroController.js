const Hero = require('../models/hero');
var Pet = require("../models/pet");
var async = require('async');
const { body,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');


exports.hero_list = function(req, res)  {
    let temp =[];
    Hero.find()
    .sort([['name', 'ascending']])
    .exec( function (err, list_heroes) {
      if (err) { return next(err); }
      //Successful, so render
      var count =0;
      for (let index = 0; index < list_heroes.length; index++) {
        if (list_heroes[index].pet.length == 0) {
          temp.push({id:list_heroes[index]._id, name:list_heroes[index].name, petname:list_heroes[index].pet});
          count++;
        }else{
          Pet.findById(list_heroes[index].pet[0])
          .exec( function (err, pet) {
              if (err) { return next(err); }
              if (pet==null) { // No results.
                  var err = new Error('Book copy not found');
                  err.status = 404;
                  return next(err);
                }
                temp.push({id:list_heroes[index]._id, name:list_heroes[index].name, petname:{id:pet._id, name:pet.name}});
                count++;
                if(count == list_heroes.length){
                  res.json(temp);
                } 
          })
        }
      }
      if(count == list_heroes.length){
        res.json(temp);
      } 
    });
};

exports.hero_detail = function(req, res, next) {

    Hero.findById(req.params.id)
    .populate('name')
    .exec(function (err, hero) {
      if (err) { return next(err); }
      if (hero==null) { // No results.
          var err = new Error('Book copy not found');
          err.status = 404;
          return next(err);
        }
      // Successful, so render.
      if (hero.pet.length == 0) {
        res.json({id:hero._id, name:hero.name, petname:hero.pet});
      }else{
        Pet.findById(hero.pet[0])
          .exec(function (err, pet) {
              if (err) { return next(err); }
              if (pet==null) { // No results.
                  var err = new Error('Book copy not found');
                  err.status = 404;
                  return next(err);
                }
                res.json({id:hero._id, name:hero.name, petname:{id:pet._id, name:pet.name}});
          })
      }
      
    })

};

exports.create_hero = async function(req, res, next){

      const hero = new Hero({name:req.body.name});
      const m = await hero.save();
      res.json({id: m._id ,name:m.name});  
}

exports.update_hero = async function(req, res, next) {
    Pet.findById(req.body.petname)
    .exec(async function (err, pet) {
      if (err) { return next(err); }
      if (pet==null) { // No results.
        res.send(await Hero.findOneAndUpdate({_id:req.params.id}, {name: req.body.name}, { new : true}));
        return;
      }
    res.send(await Hero.findOneAndUpdate({_id:req.params.id}, {name: req.body.name, pet: pet._id }, { new : true}));//{ name : req.params.name , pet : req.params.pe};
    })
}

exports.delete_hero = async function (req, res, next) {
    Hero.findByIdAndRemove(req.params.id, function deleteAuthor(err) {
        if (err) { return next(err); }
        // Success - go to author list
        res.json("seccess")
    })
}

exports.pet_hero = function(req, res, next){
    Hero.find({ 'pet': req.params.id })
    .exec(function (err, list_heroes) {
        if (err) { return next(err); }
        //Successful, so render
        
        res.json(list_heroes);
      });
}