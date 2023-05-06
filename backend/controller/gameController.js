const Game = require('../models/game');
var async = require('async');
const { body,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');

exports.search = function(req, res, next){
    let l = [];
    Game.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_game) {
      for(let index = 0; index < list_game.length; index++){
        if (list_game[index].name.toLowerCase().includes(req.params.param.toLowerCase())) {
          l.push({id:list_game[index]._id, name:list_game[index].name});
          console.log(list_game[index].name);
        }
      }
      console.log(l);
      res.json(l);
    })
  }

  exports.game_detail = function (req, res, next) {
    Game.findById(req.params.id).exec(function (err, game) {
      if (err) {
        return next(err);
      }
      if (game == null) {
        // No results.
        var err = new Error("game not found");
        err.status = 404;
        return next(err);
      }
      res.send({
        id: game._id,
        type: game.type,
        name: game.name,
        description: game.description,
        platform: game.supported_platform,
        language: game.supported_languages,
        price: game.price,
        rate: game.rate,
        dlc: game.dlc,
        main: game.main_game,
        img_p: game.image_p,
        img_s: game.image_s,
        video: game.video_link,
        comment: game.comments
      });
    });
  };