
(function(){

	function include(file){
		document.write('<script src="ui/js/' + file + '" type="text/javascript"><\/script>');
	}

	include('application.js');
	include('intro.js');
	include('phyloprofile.js');
	include('selection-box.js');
	include('full-tree.js');

})();
