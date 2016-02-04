angular.module('app', [
    'templates',
    'ui.router',
    'welcome'
  ])
  .config(function ($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/welcome');
  })
  .run(function () {

  });