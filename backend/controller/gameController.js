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
    exports.getwishlist = function (req, res, next){
      let wishlist = [];
      console.log(req.params.id)
      User.findById(req.params.id).exec(function (err, user){
        if (err) {
          return next(err);
        }
        console.log(req.params.id)
        for (let index = 0; index < user.wishlist.length; index++) {
          Game.findById(user.wishlist[index]).exec(function (err1, games){
            console.log(games)
            if (err1) {
              return next(err1);
            }
              wishlist.push({id:games._id, name:games.name, img_p:games.image_p});
              if (index === user.wishlist.length-1) {
                res.send(wishlist);
              }
            
          }); 
          }
            
        });
    };

    exports.addWishlist = function (req, res, next){
      User.findById(req.body.userId).exec(async function (err, user){
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
              cart.push({id:games._id, name:games.name, img_p:games.image_p, type:games.type, price:games.price});
              if (index === user.cart.length-1) {
                res.send(cart);
              }
            
          }); 
          }
            
        });
    };

    exports.addCart = function (req, res, next){
      User.findById(req.body.userId).exec(async function (err, user){
        user.cart.push(req.body.gameId);
        console.log(user.cart)
        res.send(await User.findOneAndUpdate({_id:req.body.userId}, {$set:{cart: user.cart}}, {}));
      })
    };

    //TODO: check
    exports.emptyCart = async function(req, res) {
      try {
        const userId = req.params.userId;
        // Find the user by ID and update their cart array to an empty array
        const user = await User.findByIdAndUpdate(userId, { cart: [] });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        return res.json(user);
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
      }
    };

    //TODO: check
    exports.removeFromWishlist = async function(req, res) {
      try {
        const userId = req.params.userId;
        const { cart } = req.body;
        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        // Remove the games that are in both the cart and the wishList
        user.wishList = user.wishList.filter(wishListGame => {
          const isCartGame = cart.some(cartGame => cartGame.id.equals(wishListGame.id));
          return !isCartGame;
        });
    
        // Save the updated user object to the database
        await user.save();
    
        return res.json(user);
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
      }
    };

    //TODO: check
    exports.updateLibrary = async function(req, res) {
      try {
        const userId = req.params.userId;
        const updatedUser = req.body;
        // Find the user by ID and update their games array
        const user = await User.findByIdAndUpdate(userId, { games: updatedUser.games });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        return res.json(user);
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
      }
    };
    
    
  