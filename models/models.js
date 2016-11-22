var path = require('path');

//Cargar Modelo ORM
var Sequelize = require('sequelize');

//Usar BBDD SQLite:
var sequelize = new Sequelize(null, null, null, {
	dialect: "sqlite",
	storage: "quiz.sqlite"
});

//sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function() {
	//sucess(..) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function(count) {
		if (count === 0) { // la tabla se inicializa sólo si está vacía
			Quiz.create({
					pregunta: 'Capital de Italia',
					respuesta: 'Roma'
				});
			Quiz.create({
					pregunta: 'Capital de Portugal',
					respuesta: 'Lisboa'
				})
				.then(function() {
					console.log('Base de datos inicializada')
				});
		};
	});
});

//Importar definición de la tabla Quiz
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

//Importar definicion de la tabla Comment
var comment_path = path.join(__dirname,'comment');
var Comment = sequelize.import (comment_path);

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz; //exportar tabla Quiz
exports.Comment = Comment;
