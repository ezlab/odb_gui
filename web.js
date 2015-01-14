
var express = require('express'),
	proxy = require('express-http-proxy'),
	app = express();

var api = function(path){
	return proxy('ceggdev.ezlab.org', {
		forwardPath: function(req, res){
			return '/eztest' + path + String(req.url).replace(/^\/\?/, '?');
		}
	});
};

var file = function(path){
	return function(req, res){
		res.sendFile(__dirname + path);
	};
}

app.use('/static', express.static('static'));

app.use('/group', api('/group'));
app.use('/search', api('/search'));

app.get('/orthologs', file('/orthologs'));
app.get('/siblings', file('/siblings'));
app.get('/tree', file('/tree'));
app.get('/', file('/index.html'));

app.listen(process.env.PORT || 80);