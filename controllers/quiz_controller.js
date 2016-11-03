var models = require('../models/models.js');
//GET /quizes/question
exports.question = function (req, res) {
	models.Quiz.findAll().then(function(quiz){
		res.render('quizes/question',{pregunta: quiz[0].pregunta });
	})
};

//GET /quizes/answer
exports.answer = function(req, res){
	models.Quiz.findAll().then(function(quiz){
		if (req.query.respuesta === quiz[0].respuesta){
			quiz[0].aciertos=quiz[0].aciertos+1;
			quiz[0].save();
			res.render('quizes/answer', {respuesta: 'Correcto'});
		}	
		else {
			quiz[0].fallos=quiz[0].fallos+1;
			quiz[0].save();
			res.render('quizes/answer', {respuesta: 'Incorrecto'});
		}
	})
};

//GET /quizes/estadisticas
exports.estadisticas = function(req, res){
	models.Quiz.findAll().then(function(quiz){
		res.render('quizes/estadisticas', {aciertos: quiz[0].aciertos, fallos: quiz[0].fallos});
		quiz[0].aciertos=0;
		quiz[0].fallos=0;
		quiz[0].save();
	})
};



