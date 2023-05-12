const Game = require('../models/game');
const User = require('../models/user');
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
        rates: game.rates,
        rating: game.rating,
        dlc: game.dlc,
        main: game.main_game,
        img_p: game.image_p,
        img_s: game.image_s,
        video: game.video_link,
        comment: game.comments
      });
    });
};
    exports.getwishlist = function (req, res, next){
      let wishlist = [];
      console.log("hellodsajk")
      User.findById(req.params.id).exec(function (err, user){
        if (err) {
          return next(err);
        }
        console.log(user.wishlist)
        
          Game.find({ _id: { $in: user.wishlist } }).exec(function (err1, games){
            console.log(games)
            if (err1) {
              return next(err1);
            }
            for (let index = 0; index < games.length; index++) {
              wishlist.push({id:games[index]._id, name:games[index].name, image_p:games[index].image_p});
            }
            res.send(wishlist);
          }); 
          });
    };

    exports.addWishlist = function (req, res, next){
      User.findById(req.body.userId).exec(async function (err, user){
        if(err){
          res.send(false);
        }
        user.wishlist.push(req.body.gameId);
        console.log(user.wishlist)
        res.send(await User.findOneAndUpdate({_id:req.body.userId}, {$set:{wishlist: user.wishlist}}, {}));
      })
    };

    exports.getcart = function (req, res, next){
      let cart = [];
      User.findById(req.params.id).exec(function (err, user){
        if (err) {
          return next(err);
        }
        for (let index = 0; index < user.cart.length; index++) {
          Game.findById(user.cart[index]).exec(function (err1, games){
            if (err1) {
              return next(err1);
            }
              cart.push({id:games._id, name:games.name, image_p:games.image_p, type:games.type, price:games.price});
              if (index === user.cart.length-1) {
                res.send(cart);
              }
            
          }); 
          }
            
        });
    };

    exports.addCart = function (req, res, next){
      User.findById(req.body.userId).exec(async function (err, user){

        if (user == null) {
          // No results.
          var err = new Error("user not found");
          err.status = 404;
          return next(err);
        }

        user.cart.push(req.body.gameId);
        console.log(user.cart)
        res.send(await User.findOneAndUpdate({_id:req.body.userId}, {$set:{cart: user.cart}}, {}));
      })
    };

    exports.emptyCart = async function(req, res, next) {
        User.findById(req.body.userId).exec(async function (err, user){
        user.cart = [];
        console.log(user.cart);
        res.send(await User.findOneAndUpdate({_id:req.body.userId}, {$set:{cart: user.cart}}, {}));
      })
    };

    

    exports.removeFromCart = async function(req, res, next) {
      User.findById(req.body.userId).exec(async function (err, user) {
        user.cart = user.cart.filter(id => !id.equals(req.body.gameId));
        console.log(user.cart);
        res.send(await User.findOneAndUpdate({_id: req.body.userId}, {$set: {cart: user.cart}}, {}));
      });

    };

    exports.removeOneFromCart = function (req, res, next){
      User.findById(req.body.userId).exec(async function (err, user){
        console.log(user.cart);
        const gameIndex = user.cart.findIndex(id => id.toString() === req.body.gameId);
        if (gameIndex !== -1) {
          user.cart.splice(gameIndex, 1);
          res.send(await User.findOneAndUpdate({_id:req.body.userId}, {$set:{cart: user.cart}}, {}));
        }
      })
    };
    
    

    //TODO: check
    exports.removeFromWishlist = async function(req, res) {
      User.findById(req.body.userId).exec(async function(err, user) {

        if (user == null) {
          // No results.
          var err = new Error("user not found");
          err.status = 404;
          return next(err);
        }

        // TODO: check
        user.wishlist = user.wishlist.filter(wishlistGame => {
          const isCartGame = user.cart.some(cartGame => cartGame.id === wishlistGame.id);
          return !isCartGame;
        });

        /*for (const gameWL of user.wishList) {
          const game = user.cart.find(gameCart => gameCart.id === gameWL.id);
          
          if (!game) {
            throw new Error(`Game with name ${gameWL.name} not found`);
          } else {
            const index = user.wishlist.findIndex(gameCart => gameCart.id === gameWL.id);
            user.wishlist.splice(index, 1);
          }
        }*/

        res.send(await User.findOneAndUpdate({_id:req.body.userId}, {$set:{wishlist: user.wishlist}}, {}));
      });
    };

    //TODO: check
    exports.updateLibrary = async function(req, res) {
      User.findById(req.body.userId).exec(async function(err, user) {

        if (user == null) {
          // No results.
          var err = new Error("user not found");
          err.status = 404;
          return next(err);
        }

        for (const gameCart of user.cart) {
          Game.findById(gameCart.id).exec(async function(err, game) {

            if (game == null) {
              // No results.
              var err = new Error("game not found");
              err.status = 404;
              return next(err);
            }

            user.games.push(game.id);
          });
        }

        res.send(await User.findOneAndUpdate({_id:req.body.userId}, {$set:{games: user.games}}, {}));
      });
    };

    //TODO: check
    exports.rateGame = async function(req, res) {
      Game.findById(req.body.gameId).exec(async function(err, game) {
        if (game == null) {
          // No results.
          var err = new Error("game not found");
          err.status = 404;
          return next(err);
        }

        game.rates.push(req.body.rating);

        const i = game.rates.length;
        const sum = game.rates.reduce((accumulator, currentValue) => accumulator + currentValue);
        const avg = sum / i;
        game.rating = Number(avg.toFixed(1));
        res.send(await Game.findOneAndUpdate({_id:req.body.gameId}, {$set:{rates: game.rates, rating: game.rating}}, {}));
      })
    };

    //TODO: check
    exports.addCommentGame = function(req, res) {
      Game.findById(req.body.gameId).exec(async function(err, game) {
        if (game == null) {
          // No results.
          var err = new Error("game not found");
          err.status = 404;
          return next(err);
        }

        //TODO: check if comment its .id or not
        game.comments.push(req.body.comment);
        res.send(await Game.findOneAndUpdate({_id:req.body.gameId}, {$set:{comments: game.comments}}, {}));
      })
    };
    
    
  