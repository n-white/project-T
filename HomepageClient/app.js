var app = angular.module('app', []);



app.controller('appController', function($scope, $http) {
  $scope.display = 'testing';
  $scope.trendsGrab = function() {
    $http({
      method: 'GET',
      url: '/trends'
    }).then(function success(response) {
      $scope.trends = response.data;
      console.log('!@#$!@#$!@#$!@#$!@#$!@#$')
    }, function error(response) {
      console.log('1234091273409817234098172');
    });
  }

  $scope.twitterGrab = function (q) {
    // q = q.replace(/\s/g, '');
    $http({
      method: 'POST',
      url: '/grabTweets',
      data: {q: q}
    }).then(function success(response) {
        console.log('success ' + q);
      }, function error(response) {
        console.log('failure ' + q);
      });
    }
  });