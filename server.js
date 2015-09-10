
var express = require('express'),
	auth = require('./auth'),
	cfg = require('./config'),
	app = express();


app.use(express.static('static'));
app.use(auth.cookies);


app.get('/login', auth.login);
app.get('/logout', auth.logout);
app.get('/register', auth.register);
app.get('/stormpath', auth.callback);


app.get('/user', auth.loginRequired, function(req, res){
	res.send(req.user.fullName);
});


auth.init(cfg.auth, function(err){
	err ? console.log(err) : app.listen(cfg.port);
});