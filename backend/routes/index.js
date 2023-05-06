var express = require('express');
var router = express.Router();

const users_controller = require("../controller/userController");
const pets_controller = require("../controller/petController");
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

module.exports = router;
