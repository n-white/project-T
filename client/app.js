var app = angular.module('app', []);



app.controller('appController', function($scope, $http) {
	$scope.display = 'testing';
	$scope.trends = [];
	$scope.trendsGrab =
		$http({
			method: 'GET',
			url: '/trends'
		}).then(function success(response) {
			$scope.trends = response.data;
		}, function error(response) {
			console.log(response)
		});

	$scope.twitterGrab = function (q) {
		// q = q.replace(/\s/g, '');
		$http({
			method: 'POST',
			url: '/grabTweets',
			data: {q: q}
		}).then(function success(response) {
				console.log('success ' + response);
			}, function error(response) {
				console.log('failure ' + q);
			});
		}
	});
