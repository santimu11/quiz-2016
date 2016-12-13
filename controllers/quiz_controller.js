var models = require('../models/models.js');

//Autoload - factoriza el código si ruta inclue :quizId
exports.load = function(req, res, next, quizId) {
models.Quiz.findById(quizId).then(
	function(quiz){
		if (quiz) {
			req.quiz = quiz;
			next();
		} else { next (new Error('No existe quizId=' + quizId));}
	}
	).catch(function(error){ next(error);});
};

//GET /quizes/show
exports.show = function (req, res) {
	models.Quiz.findById(req.params.quizId).then(function(quiz){
		res.render('quizes/show',{ quiz: req.quiz, errors: []});
	})
};

//GET /quizes/ :id/answer
exports.answer = function(req, res){
	var aciertos;
	if (req.session.user){
		aciertos=req.session.user.aciertos;
	} else if (isNaN(req.session.aciertos)){
	 	aciertos=0;
	} else {
		aciertos=req.session.aciertos;
	}	
	var resultado = 'Incorrecto';
		if (req.query.respuesta === req.quiz.respuesta){
			resultado = 'Correcto';
			aciertos++;
			if (req.session.user){
				req.session.user.aciertos=aciertos;
			} else {
				req.session.aciertos=aciertos;
			}
		} 
		res.render (
		'quizes/answer',
		{
			quiz: req.quiz,
			respuesta: resultado,
			aciertos: aciertos,
			errors: []
		}
	);
};

//GET /quizes
exports.index = function(req, res) {
	models.Quiz.findAll().then(function(quizes){
		res.render('quizes/index.ejs', {quizes: quizes, errors: []});
	}
  ).catch(function(error){next(error)});
};

//GET /quizes/new
exports.new = function (req, res) {
	var quiz = models.Quiz.build(
	{pregunta: "", respuesta: ""});
	res.render('quizes/new', {quiz: quiz, errors: []});
}

//POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);
quiz.validate().then(
	function(err){
		if (err) {
			res.render('quizes/new', {quiz: quiz, errors: err.errors});
		} else {
		//guarda en DB los campos pregunta y respuesta de quiz
		quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){	
		res.redirect('/quizes')})
	//Redirección HTTP (URL relativo) lista de preguntas 
	}
   }
 );
};

//GET /quizes/:id/edit
exports.edit = function(req, res) {
	var quiz = req.quiz; // autoload de instancia de quiz

	res.render('quizes/edit',{quiz: quiz, errors: []});
};

//PUT /quizes/:id
exports.update = function(req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;

	req.quiz
	.validate()
	.then(
		function(err){
			if(err){
				res.render('quizes/edit',{quiz: req.quiz, errors: err.errors});
			} else {
				req.quiz //save: guarda campos pregunta y respuesta en DB
				.save( {fields: ["pregunta", "respuesta"]})
				.then ( function(){ res.redirect('/quizes');});
			}	// Redireccion HTTP a lista de pregunta (URL relativo)
		}
	);
};

//DELETE /quizes/:id
exports.destroy = function (req, res) {
	req.quiz.destroy().then( function () {
		res.redirect('/quizes');
	}).catch (function(error){next(error)});
};

//Autoload :id
exports.load = function (req, res, next, quizId) {
	models.Quiz.findOne ({
		where: { id: Number(quizId)},
		include: [{ model: models.Comment }]
	}).then (function(quiz) {
		if (quiz) {
			req.quiz = quiz;
			next();
		} else {next (new Error ('No existe quizId= ' + quizId))}
	  }
	).catch(function(error){next(error)});
};