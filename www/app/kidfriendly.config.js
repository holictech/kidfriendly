(function() {
  'use strict';

  angular.module('kidfriendly').config(Config);

  Config.$inject = ['$ionicConfigProvider', '$stateProvider', '$urlRouterProvider', '$httpProvider'];

  function Config($ionicConfigProvider, $stateProvider, $urlRouterProvider, $httpProvider) {
    if (ionic.Platform.isAndroid()) {
      $ionicConfigProvider.scrolling.jsScrolling(true);
    }

    $httpProvider.interceptors.push(function() {
      return {
        'request': function(config) {
          config.timeout = 7000;

          return config;
        }
      };
    });

    $stateProvider
    .state('main', {
      url: "/main",
      params: {
        params: null
      },
      abstract: true,
      templateUrl: 'app/view/main/main.html'
    })
    .state('main.home', {
      url: "/home",
      views: {
        'main-view': {
          templateUrl: 'app/view/home/home.html',
          controller: 'HomeController',
          controllerAs: 'vm'
        }
      }
    })
    .state('main.search', {
      url: '/search',
      views: {
        'main-view': {
          templateUrl: 'app/view/search/search.html',
          controller: 'SearchController',
          controllerAs: 'vm'
        }
      }
    })
    .state('main.result', {
      url: '/result',
      views: {
        'main-view': {
          templateUrl: 'app/view/result/result.html',
          controller: 'ResultController',
          controllerAs: 'vm'
        }
      }
    })
    .state('main.company', {
      url: '/company',
      views: {
        'main-view': {
          templateUrl: 'app/view/company/company.html',
          controller: 'CompanyController',
          controllerAs: 'vm'
        }
      }
    })
    .state('main.about', {
      url: '/about',
      views: {
        'main-view': {
          templateUrl: 'app/view/template/about.html'
        }
      }
    })
    .state('main.termsofuse', {
      url: '/termsofuse',
      views: {
        'main-view': {
          templateUrl: 'app/view/template/termsofuse.html'
        }
      }
    });


    $urlRouterProvider.otherwise("/main/home");
  }
})();
