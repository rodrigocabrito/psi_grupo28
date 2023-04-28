var express = require('express');
var router = express.Router();

const users_controller = require("../controller/userController");
const pets_controller = require("../controller/petController");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/users', users_controller.user_list);

router.get('/user/:id', users_controller.user_detail);

router.post('/user', users_controller.create_user);

router.put('/user/:id', users_controller.update_user);

router.delete('/user/:id', users_controller.delete_user);

router.get('/user/pet/:id', users_controller.pet_user);

router.get('/pets', pets_controller.pet_list);

router.get('/pet/:id', pets_controller.pet_detail);

module.exports = router;
