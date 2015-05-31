/*
	HappinessesService:
	    .list: [happiness]
		.get(): *happinesses

	Abstract connection or disconnection service

	// TODO: improve using cordova connection verification
*/

(function() {
	'use strict';

	angular
		.module('hh.happinesses.services')
		.factory('HappinessesService', HappinessesService);

	/* @ngInject */
	function HappinessesService(dpd,storageFactory) {
		var service = {
			list: [],
			get: get,
		};

		// remote and local services
		var remote = dpd.happinesses;
		var local = storageFactory('happinesses');

		return service;

		// method implementation
		function get(opts) {
			return remote.get(opts)
				// if ok save result
				.then(function(response) {
					return local.setItem('all', response.data);
				})
				// if fails, assume connection error, load local values
				.catch(function() {
					return local.getItem('all');
				})
				// make sure that reference is always ok
				.then(function(values) {
					angular.copy(values, service.list);
					return service.list;
				});
		}
	}

})();