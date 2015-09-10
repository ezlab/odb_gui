
var express = require('express'),
	proxy = require('express-http-proxy'),
	auth = require('./auth'),
	util = require('./util'),
	server = express();


var cfg = {
	root: '/v8',
	port: process.env.PORT || 80,
	auth: {
		apiKeyId: process.env.STORMPATH_APIKEY_ID,
		apiKeySecret: process.env.STORMPATH_APIKEY_SECRET,
		application: process.env.STORMPATH_APPLICATION_HREF
	}
};


var	routes = ['/group', '/search', '/blast', '/orthologs', '/siblings', '/fasta', '/tab', '/tree'];


var app = express.Router();

app.use('/static', express.static('static'));
app.use(auth.cookies);

app.get(routes, proxy('orthodb.org'));
app.get('/', util.file('/index.html'));

app.get('/login', auth.login);
app.get('/logout', auth.logout);
app.get('/register', auth.register);
app.get('/stormpath', auth.callback);


server.use(cfg.root, app);
server.get('/', util.redirect(cfg.root));

auth.init(cfg.auth, function(){
	server.listen(cfg.port);
});