
(function(){

	function url(path){
		return path + '?next=' + encodeURIComponent(location.pathname.replace(/[\w\.]*$/, '') + 'static/pages/reload.html');
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

	app.closeLoginPopup = function(){
		$('.s-login').hide();
		$('.s-login iframe').attr('src', '');

		if (String(location.href).match(/charts.html/)){
			location = './';
		}
	}

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

