
(function(){

	var authenticated, username;

	function url(path){
		return path + '?next=' + encodeURIComponent(location.pathname + location.search);
	}

	app.login = function(){
		location.href = url('login');
	};

	app.register = function(){
		location.href = url('register');
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

