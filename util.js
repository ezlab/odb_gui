
var util = {};

util.file = function(path){
	return function(req, res){
		res.sendFile(__dirname + path);
	};
};

util.redirect = function(path){
	return function(req, res){
		res.redirect(path + req.url);
	};
};

module.exports = util;


