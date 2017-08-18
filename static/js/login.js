
(function(){

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

	function renderUser(){
		if (app.user){
			$('.s-user-menu').addClass('s-visible');
			$('.s-logout-menu').addClass('s-visible');
			$('.s-username-box').text(app.user.username);
		}
		else {
			$('.s-login-menu').addClass('s-visible');
		}
	}

	function saveUser(response){
		app.user = response.data;
	}

	var userReq = $.getJSON('user').then(app.verifyResponse).then(saveUser);

	app.ready = $.when(userReq, app.ready);

	$(function(){
		userReq.then(renderUser);
	});

})();

