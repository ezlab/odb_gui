
(function(){

	function include(file){
		document.write('<script src="ui/js/' + file + '" type="text/javascript"><\/script>');
	}

	include('intro.js');
	include('phyloprofile.js');
	include('tree.js');

})();
