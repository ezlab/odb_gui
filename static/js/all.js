
(function(){

	function include(file){
		document.write('<script src="static/js/' + file + '" type="text/javascript"><\/script>');
	}

	include('application.js');
	include('errors.js');
	include('templates.js');
	include('lock.js');
	include('navigation.js');
	include('login.js');
	include('files.js');

})();
