angular.module('welcome', []);

angular.module('welcome')
  .controller('WelcomeCtrl', WelcomeCtrl)
  .config($stateProvider => {
      $stateProvider
        .state('welcome', {
          url: '/welcome',
          controller: 'WelcomeCtrl',
          templateUrl: 'welcome/welcome.html',
          controllerAs: 'welcome'
        });
  });

function WelcomeCtrl() {
  this.message = 'Bitwise Says Hello.';
}