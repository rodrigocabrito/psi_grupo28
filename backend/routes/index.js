var express = require('express');
var router = express.Router();

const heroes_controller = require("../controller/heroController");
const pets_controller = require("../controller/petController");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/heroes', heroes_controller.hero_list);

router.get('/hero/:id', heroes_controller.hero_detail);

router.post('/hero', heroes_controller.create_hero);

router.put('/hero/:id', heroes_controller.update_hero);

router.delete('/hero/:id', heroes_controller.delete_hero);

router.get('/hero/pet/:id', heroes_controller.pet_hero);

router.get('/pets', pets_controller.pet_list);

router.get('/pet/:id', pets_controller.pet_detail);

module.exports = router;
