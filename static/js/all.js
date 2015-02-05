
(function(){

	function include(file){
		document.write('<script src="static/js/' + file + '" type="text/javascript"><\/script>');
	}

	include('application.js');
	include('errors.js');
	include('templates.js');
	include('lock.js');
	include('cookies.js');
	include('navigation.js');
	include('query.js');
	include('phyloprofile.js');
	include('level.js');
	include('selection.js');
	include('tree.js');
	include('submit.js');
	include('results.js');

})();
