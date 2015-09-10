
(function(){

	function url(path){
		return path + '?next=' + encodeURIComponent(location.pathname + location.search);
	}

	app.login = function(){
		location.href = url('login');
	};

	app.logout = function(){
		location.href = url('logout');
	};

	app.register = function(){
		location.href = url('register');
	};

})();

