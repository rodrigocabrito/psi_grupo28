const Pet = require("../models/pet");
var User = require('../models/user');
var async = require('async');


exports.pet_list = (req, res) => {
    Pet.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_pets) {
      if (err) { return next(err); }
      //Successful, so render
      var temp =[];
      for (let index = 0; index < list_pets.length; index++) {
        temp.push({id:list_pets[index]._id, name :list_pets[index].name});
        
      }
      res.json(temp);
    });
};

exports.pet_detail = function(req, res, next) {

    async.parallel({
        pet: function(callback) {
            Pet.findById(req.params.id)
              .exec(callback);
        },

        pet_users: function(callback) {
            User.find({ 'pet': req.params.id })
            .exec(callback);
          },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.pet==null) { // No results.
            var err = new Error('pet not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.json(results);
    });

};