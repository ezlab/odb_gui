
$(function(){

	function url(path){
		return path + '?next=' + encodeURIComponent(location.pathname + 'static/pages/reload.html');
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

	function renderUser(response){
		if (response.data){
			$('.s-user-menu').addClass('s-visible');
			$('.s-logout-menu').addClass('s-visible');
			$('.s-username-box').text(response.data.username);
		}
		else {
			$('.s-login-menu').addClass('s-visible');
		}
	}

	$.getJSON('user').then(app.verifyResponse).then(renderUser);
});

