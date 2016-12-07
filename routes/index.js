var express = require('express');
var router = express.Router();
var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var userController = require ('../controllers/user_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz', errors: []});
});

//Autoload de comandos con :quizId
router.param('quizId', quizController.load); //autoload :quizId
router.param('userId', userController.load); //autoload :userId

//Definicion de rutas de sesion
router.get('/login', sessionController.new);     //formulario login
router.post('/login', sessionController.create);  //crear sesión
router.get('/logout', sessionController.destroy); //destruir sesión (podemos poner un delete en vez de get)

//Definicion de rutas de creacion usuarios
router.get('/users/', userController.index);  //formulario usuario
router.get('/users/new', userController.new);  //formulario crear usuario
router.post('/users', userController.create);  //crear usuario en tabla
router.get('/users/:userId(\\d+)/edit', sessionController.loginRequired, userController.edit);
router.put('/users/:userId(\\d+)', sessionController.loginRequired, userController.update);
router.delete('/users/:userId(\\d+)', sessionController.adminRequired, userController.destroy);

//Definición de rutas de /quizes
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)',quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/new', sessionController.loginRequired, quizController.new);
router.post('/quizes/create', sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit', sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)', sessionController.adminRequired, quizController.destroy);

router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', commentController.create);

module.exports = router;
