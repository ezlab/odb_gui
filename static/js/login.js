
(function(){

	var authenticated, username;

	function url(path){
		return path + '?next=' + encodeURIComponent(location.pathname + 'static/pages/login.html');
	}

	app.login = function(){
		$('.s-login').show();
		$('.s-login iframe').attr('src', url('login'));
	};

	app.register = function(){
		$('.s-login').show();
		$('.s-login iframe').attr('src', url('register'));
	};

	app.logout = function(){
		location.href = 'logout';
	};


	app.renderUser = function(){
		if (authenticated){
			$('.s-user-menu').addClass('s-visible');
			$('.s-logout-menu').addClass('s-visible');
			$('.s-username-box').text(username);
		}
		else {
			$('.s-login-menu').addClass('s-visible');
		}
	};

	function extractData(response){
		if (response.data){
			authenticated = true;
			username = response.data.username;
		}
		else {
			authenticated = false;
			username = '';
		}
	}

	$.getJSON('user').then(app.verifyResponse).then(extractData).then(app.renderUser);
})();

