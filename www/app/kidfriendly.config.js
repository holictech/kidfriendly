(function() {
  'use strict';

  angular.module('kidfriendly').config(Config);
  Config.$inject = ['$ionicConfigProvider', '$stateProvider', '$urlRouterProvider', '$httpProvider'];

  function Config($ionicConfigProvider, $stateProvider, $urlRouterProvider, $httpProvider, LocalityService, CategoryService, UserService) {
    if (ionic.Platform.isAndroid()) {
      $ionicConfigProvider.scrolling.jsScrolling(true);
    }

    $ionicConfigProvider.views.transition('ios');
    $ionicConfigProvider.spinner.icon('ios');
    $ionicConfigProvider.tabs.style('standard');
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.backButton.text('');
    $httpProvider.interceptors.push(function() {
      return {
        'request': function(config) {
          config.timeout = 120000;

          return config;
        }
      };
    });

    $stateProvider
      .state('main', {
        url: "/main",
        abstract: true,
        templateUrl: 'app/view/main/main.html',
        controller: 'MainController',
        controllerAs: 'vm'
    }).state('main.home', {
      url: "/home",
      views: {
        'home-view': {
          templateUrl: 'app/view/home/home.html',
          controller: 'HomeController',
          controllerAs: 'vm'
        }
      }
    }).state('main.home-company', {
      url: '/home/company/:primarykey',
      views: {
        'home-view': {
          templateUrl: 'app/view/company/company.html',
          controller: 'CompanyController',
          controllerAs: 'vm'
        }
      }
    }).state('main.user-login', {
      url: '/user/login',
      views: {
        'user-view': {
          templateUrl: 'app/view/login/login.html',
          controller: 'LoginController',
          controllerAs: 'vm'
        }
      }
    }).state('main.user-perfil', {
      url: '/user/perfil',
      views: {
        'user-view': {
          templateUrl: 'app/view/user/perfil.html'/*,
          controller: 'PerfilController',
          controllerAs: 'vm'*/
        }
      }
    }).state('main.user-register', {
      url: '/user/register',
      views: {
        'user-view': {
          templateUrl: 'app/view/user/register.html'/*,
          controller: 'RegisterController',
          controllerAs: 'vm'*/
        }
      }
    });
    /*
    .state('main.search', {
      url: '/search',
      views: {
        'main-view': {
          templateUrl: 'app/view/search/search.html',
          controller: 'SearchController',
          controllerAs: 'vm',
          resolve: {
            statesPrepService: function(LocalityService) {
              return LocalityService.listStateWithCityByCountry();
            },
            categoriesPrepService: function(CategoryService) {
              return CategoryService.listAll();
            }
          }
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
      url: '/company/:idCompany/:idCategory',
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
    })
    .state('main.user', {
      url: '/user',
      views: {
        'main-view': {
          templateUrl: 'app/view/user/user.html',
          controller: 'UserController',
          controllerAs: 'vm',
          resolve: {
            statesPrepService: function(LocalityService) {
              return LocalityService.listStateWithCityByCountry();
            },
            minMaxDtBirthdayPrepService: function(UserService) {
              return UserService.getMinMaxDtBirthday();
            }
          }
        }
      }
    })*/;

    $urlRouterProvider.otherwise("/main/home");
  }
})();
