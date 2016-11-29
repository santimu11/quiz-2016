//Definicion del modelo de users

module.exports = function(sequelize, DataTypes) {
	return sequelize.define(
		'Users',
	{ username: {
		type: DataTypes.STRING,
		validate: { notEmpty: {msg: "--> Falta Usuario"}}
	  },
	  password: {
	  	type: DataTypes.STRING,
	  	validate: { notEmpty: {msg: "--> Falta contraseña"}}
	  }
	}
  );
}