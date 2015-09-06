
var stormpath = require('stormpath'),
	Cookies = require('cookies'),
	client,
	application,
	auth = {};


module.exports = auth;


function redirect(res, url){

	res.writeHead(302, {
		'Cache-Control': 'no-store',
		'Pragma': 'no-cache',
		'Location': url
	});

	res.end();
}


auth.login = function(req, res){

	var callbackUri = req.protocol + '://' + req.hostname + '/stormpath',
		url = application.createIdSiteUrl({callbackUri: callbackUri});

	redirect(res, url);
};


auth.logout = function(req, res){

	var callbackUri = req.protocol + '://' + req.hostname + '/stormpath',
		url = application.createIdSiteUrl({callbackUri: callbackUri, logout: true});

	redirect(res, url);
};


auth.callback = function(req, res){

	application.handleIdSiteCallback(req.url, function(err, data) {

		var account = data.account,
			cookies = new Cookies(req, res);

		cookies.set('account', account.href, {httpOnly: true});
		res.redirect('/');
	});

};


auth.user = function(req, res, next){

	function processAccount(err, account){

		if (!err && account.status == 'ENABLED'){
	        req.user = account;
		}

        next();
	}

	if(req.cookies && req.cookies.account){
		client.getAccount(req.cookies.account, processAccount);
	}
	else {
		next();
	}
};


auth.init = function(cfg, callback){

	var apiKey = new stormpath.ApiKey(cfg.apiKeyId, cfg.apiKeySecret);

	client = new stormpath.Client({apiKey: apiKey});

	client.getApplication(cfg.application, function(err, app){
		application = app;
		callback(err);
	});
};
