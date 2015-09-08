
var express = require('express'),
	proxy = require('express-http-proxy'),
	app = express();

var api = function(path){
	return proxy('orthodb.org', {
		forwardPath: function(req, res){
			return path + String(req.url).replace(/^\//, '');
		}
	});
};

var file = function(path, type){
	return function(req, res){
		res.sendFile(__dirname + path, type ? {headers: {'Content-Type': type}} : {});
	};
}

var v8 = express.Router();

v8.use('/static', express.static('static'));

v8.use('/group', api('/group'));
v8.use('/search', api('/search'));
v8.use('/blast', api('/search'));
v8.use('/orthologs', api('/orthologs'));
v8.use('/siblings', api('/siblings'));
v8.use('/fasta', api('/fasta'));
v8.use('/tab', api('/tab'));
v8.use('/tree', api('/tree'));

v8.get('/', file('/index.html'));


app.use('/v8', v8);

app.get('/', function(req, res){
	res.redirect('/v8' + req.url);
});

app.listen(process.env.PORT || 80);