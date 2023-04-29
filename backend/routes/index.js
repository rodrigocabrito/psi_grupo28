var express = require('express');
var router = express.Router();

const users_controller = require("../controller/userController");
const pets_controller = require("../controller/petController");
const game_controller = require("../controller/gameController");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/user/register/:param1/:param2', users_controller.userRegister);

router.get('/users', users_controller.user_list);

router.get('/user/:id', users_controller.user_detail);

router.post('/user', users_controller.create_user);

router.put('/user/:id', users_controller.update_user);

router.delete('/user/:id', users_controller.delete_user);

router.get('/user/pet/:id', users_controller.pet_user);

router.get('/pets', pets_controller.pet_list);

router.get('/pet/:id', pets_controller.pet_detail);

router.get('/games/search/:param', game_controller.search);

module.exports = router;
