
(function(){

	function include(file){
		document.write('<script src="ui/js/' + file + '" type="text/javascript"><\/script>');
	}

	include('application.js');
	include('lock.js');
	include('intro.js');
	include('phyloprofile.js');
	include('search-level.js');
	include('selection-box.js');
	include('full-tree.js');

})();
