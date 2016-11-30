var models = require('../models/models.js');

//Comprueba si el usuario esta registrado en la tabla users
//Si autenticacion falla o hay errores se ejecuta callback (error).
exports.autenticar = function (login, password, callback) {
models.User.findOne( { where: {username: login}} ).then(function(user) { 
        if (user) {
            if (password === user.password){
            	callback(null, user);
            } else {callback(new Error ('Password erróneo.'));}
        } else {
            callback(new Error ('No existe el usuario.'));
        }
    })
    .catch(function(error) {
        console.log("Error:", error);
    });
}


//Autoload - factoriza el código si ruta inclue :UserId
exports.load = function(req, res, next, userId) {
models.User.findById(userId).then(
	function(user){
		if (user) {
			req.user = user;
			next();
		} else { next (new Error('No existe userId=' + userId));}
	}
	).catch(function(error){ next(error);});
};

//GET /users
exports.index = function(req, res, next) {
	models.User.findAll().then(function(user){
		res.render('users/index.ejs', {user: user, errors: []});
	}
  ).catch(function(error){next(error)});
};

//GET /quizes/new
exports.new = function (req, res) {
	var user = models.User.build(
	{username: "", password: ""});
	res.render('users/new', {user: user, errors: []});
}


//POST /users/create
 exports.create = function(req, res) {
	var user = models.User.build(req.body.user);
user.validate().then(
	function(err){
		if (err) {
			res.render('users/new', {user: user, errors: err.errors});
		} else {
		//guarda en DB los campos pregunta y respuesta de user
		user.save({fields: ["username", "password"]}).then(function(){	
		res.redirect('/users')})
	//Redirección HTTP (URL relativo) lista de usuarios 
	}
   }
 );};