
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


function idSiteUrlOptions(req){
	return {
		callbackUri: req.protocol + '://' + req.hostname + '/stormpath',
		state: encodeURIComponent(req.query.next || '/')
	};
}


auth.login = function(req, res){

	var options = idSiteUrlOptions(req);
	redirect(res, application.createIdSiteUrl(options));
};


auth.logout = function(req, res){

	var options = idSiteUrlOptions(req);
	options.logout = true;
	redirect(res, application.createIdSiteUrl(options));
};


auth.register = function(req, res){

	var options = idSiteUrlOptions(req);
	options.path = '/#/register';
	redirect(res, application.createIdSiteUrl(options));
};


auth.callback = function(req, res){

	application.handleIdSiteCallback(req.url, function(err, result) {

		var account = result.account,
			status = result.status,
			next = decodeURIComponent(result.state) || '/',
			cookies = new Cookies(req, res);

		if (err){
			res.status(500).end(err.toString());
		}
		else if (status == 'AUTHENTICATED'){
			cookies.set('account', account.href, {httpOnly: true});
			res.redirect(next);
		}
		else if (status == 'LOGOUT'){
			cookies.set('account');
			res.redirect(next);
		}
		else {
			res.status(500).end('Authentication error: ' + status);
		}
	});

};


auth.cookies = function(req, res, next){

	var cookies = new Cookies(req, res),
		href = cookies.get('account');

	if (!href) {
		return next();
	}

	client.getAccount(href, function(err, user){

		if (!err && user.status == 'ENABLED'){
	        req.user = user;
		}

        next(err);
	});
};


auth.loginRequired = function(req, res, next){

	if (req.user){
		return next();
	}

	res.redirect('login?next=' + encodeURIComponent(req.url));
};


auth.init = function(cfg, callback){

	var apiKey = new stormpath.ApiKey(cfg.apiKeyId, cfg.apiKeySecret);

	client = new stormpath.Client({apiKey: apiKey});

	client.getApplication(cfg.application, function(err, app){
		application = app;
		callback(err);
	});
};
