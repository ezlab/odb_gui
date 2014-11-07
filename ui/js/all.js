
(function(){

	function include(file){
		document.write('<script src="ui/js/' + file + '" type="text/javascript"><\/script>');
	}

	include('application.js');
	include('errors.js');
	include('lock.js');
	include('navigation.js');
	include('keywords-input.js');
	include('phyloprofile.js');
	include('search-level.js');
	include('selection-box.js');
	include('full-tree.js');
	include('submit.js');
	include('results.js');

})();
