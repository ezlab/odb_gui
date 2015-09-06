
var express = require('express'),
	cookieParser = require('cookie-parser'),
	auth = require('./auth'),
	cfg = require('./config'),
	app = express();


app.use(cookieParser());

app.get('/', function(req, res){
	res.send('home');
});


app.get('/login', auth.login);
app.get('/logout', auth.logout);
app.get('/stormpath', auth.callback);


app.use(auth.user);


app.get('/user', function(req, res){
	if (req.user){
		res.send(req.user.fullName);
	}
	else {
		res.sendStatus(401);
	}
});


auth.init(cfg.auth, function(err){
	err ? console.log(err) : app.listen(cfg.port);
});