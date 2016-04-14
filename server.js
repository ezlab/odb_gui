
var express = require('express'),
	proxy = require('express-http-proxy'),
	upload = require('./upload'),
	auth = require('./auth'),
	util = require('./util'),
	server = express();


var cfg = {
	root: '/dev',
	port: process.env.PORT || 80,
	auth: {
		apiKeyId: process.env.STORMPATH_APIKEY_ID,
		apiKeySecret: process.env.STORMPATH_APIKEY_SECRET,
		application: process.env.STORMPATH_APPLICATION_HREF
	}
};

cfg.proxy = {
	forwardPath: function(req, res){
		return '/odb/dev' + req.url;
	}
};

var	routes = ['/group', '/search', '/blast', '/orthologs', '/ogdetails', '/siblings', '/fasta', '/tab', '/tree'];


var app = express.Router();

app.use('/static', express.static('static'));
app.use(auth.cookies);

app.get('/search', function(req, res, next){
	req.query.query == 'secret' && !req.user ? res.sendStatus(401) : next();
});

app.get(routes, proxy('ezmeta.unige.ch', cfg.proxy));
app.get('/', util.file('/index.html'));

app.get('/login', auth.login);
app.get('/logout', auth.logout);
app.get('/register', auth.register);
app.get('/stormpath', auth.callback);
app.get('/user', auth.user);

app.use('/upload', upload('tmp'));
app.get('/files', auth.loginRequired, util.file('/files.json'));

app.post('/run', function(req, res){
	res.send({status: 'ok'});
});

server.use(cfg.root, app);
server.get('/', util.redirect(cfg.root));

auth.init(cfg.auth, function(){
	server.listen(cfg.port);
});