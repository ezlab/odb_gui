
$(function(){

	/*
		these functions allow to break loops when updating some value triggers change event,
		which updates the same value again etc.

		usage:

		var lock = {};

		app.method('setValue', lock, function(value){
			updateUI(value);
		});

		function onChange(value){
			app.call('setValue', lock, value);
		}

	*/

	app.method = function(name, lock, fn){

		var method = app[name];

		if (!method){
			throw new Error('Method ' + name + ' does not exist in the app object');
		}

		app[name] = function(){

			method.apply(this, arguments);

			if (!lock[name]){
				lock[name] = true;
				fn.apply(this, arguments);
				lock[name] = false;
			}
		};
	};


	app.call = function(name, lock){

		var method = app[name];

		if (!method){
			throw new Error('Cannot call ' + name + ' - the method does not exist');
		}

		var args = [].slice.call(arguments, 2);

		if (!lock[name]){
			lock[name] = true;
			method.apply(this, args);
			lock[name] = false;
		}
	};

});

