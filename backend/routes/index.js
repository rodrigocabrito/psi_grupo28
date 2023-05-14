var express = require('express');
var router = express.Router();

const users_controller = require("../controller/userController");
const game_controller = require("../controller/gameController");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/user/login/:param1/:param2', users_controller.loginUser);

router.get('/users', users_controller.user_list);

router.get('/user/:id', users_controller.user_detail);

router.post('/users', users_controller.registerUser);

router.put('/user/:id', users_controller.update_user);

router.delete('/user/:id', users_controller.delete_user);

router.get('/games/search/:param', game_controller.search);

router.get('/game/:id', game_controller.game_detail);

router.get('/games/wishlist/:id', game_controller.getwishlist);

router.post('/game/towish', game_controller.addWishlist);

router.post('/games/rmwish', game_controller.removeWish);

router.get('/games/cart/:id', game_controller.getcart);

router.post('/game/tocart', game_controller.addCart);

router.get('/users/search/:param', users_controller.user_search);

router.post('/games/emptyCart/', game_controller.emptyCart);

router.post('/games/rmcart', game_controller.removeFromCart);

router.post('/games/rmonecart', game_controller.removeOneFromCart);

router.post('/games/filterWishList', game_controller.removeFromWishlist);

router.post('/games/updateLibrary', game_controller.updateLibrary);

router.post('/game/rate', game_controller.rateGame);

router.post('/game/comment', game_controller.addCommentGame);

router.post('/users/follow', users_controller.follow);

router.post('/users/followed', users_controller.followed);

router.get('/users/gamesLibrary/:id', users_controller.getGamesLibrary);

router.get('/user/:id/followers', users_controller.getFollowers);

router.get('/user/:id/following', users_controller.getFollowing);


module.exports = router;
