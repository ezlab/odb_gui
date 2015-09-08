
var express = require('express'),
	cookieParser = require('cookie-parser'),
	auth = require('./auth'),
	cfg = require('./config'),
	app = express();


app.use('', express.static('static'));
app.use(cookieParser());
app.use(auth.user);


app.get('/login', auth.login);
app.get('/logout', auth.logout);
app.get('/stormpath', auth.callback);


app.get('/user', function(req, res){
	req.user ? res.send(req.user.fullName) : res.redirect('/login?next=%2Fuser');
});


auth.init(cfg.auth, function(err){
	err ? console.log(err) : app.listen(cfg.port);
});