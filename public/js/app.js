var app = angular.module('watchOut', ['ngRoute', 'firebase']);

app.config(function ($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl',
    })
    .otherwise({
        redirectTo: '/'
    });
})