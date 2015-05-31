/*
	storageFactory(name):
		.clear() : *ok
		.keys() : *[string:key1,..]
		.getItem(string:key): *object:value
		.removeItem(string:key): *ok
		.setItem(string:key,object:value): *object:value

	Example:
		var carmels = storageFactory('carmels');
		carmels.getItem('obokaman').then(function(specs) {
			console.log(specs);
		});
*/
(function() {
	'use strict';

	angular
		.module('hh.tools.storage')
		.factory('storageFactory', storageFactoryFactory);

	storageFactoryFactory.$inject = ['$q','$window'];
	function storageFactoryFactory  ( $q , $window ) {
		// storages identity map
		var storages = {};

		return storageFactory;

		function storageFactory(name) {
			// look for the storage in current storages
			var storage = storages[name];
			if (!storage) {
				// create a new storage
				storage = new Storage(name);
				// and keep the track
				storages[name] = storage;
			}
			return storage;
		}

		function Storage(name) {
			this.clear = clear;
			this.getItem = getItem;
			this.keys = keys;
			this.removeItem = removeItem;
			this.setItem = setItem;

			/* global localforage: false */
			var lforage = localforage.createInstance({name: name});
			// wrap callbacks into angular promises (not anyplatform supports Promise)
			function clear() {
				return $q(function(resolve, reject) {
					lforage.clear(function(err, value) {
						if (err) { reject(err); }
						else { resolve(value); }
					});
				});
			}
			function getItem(key) {
				return $q(function(resolve, reject) {
					lforage.getItem(key, function(err, value) {
						if (err) { reject(err); }
						else { resolve(value); }
					});
				});
			}
			function keys(keys) {
				return $q(function(resolve, reject) {
					lforage.keys(function(err, value) {
						if (err) { reject(err); }
						else { resolve(value); }
					});
				});
			}
			function removeItem(key) {
				return $q(function(resolve, reject) {
					lforage.removeItem(key, function(err, value) {
						if (err) { reject(err); }
						else { resolve(value); }
					});
				});
			}
			function setItem(key, value) {
				return $q(function(resolve, reject) {
					lforage.setItem(key, value, function(err, value) {
						if (err) { reject(err); }
						else { resolve(value); }
					});
				});
			}
		}
	}

})();