(function() {
  'use strict';

  angular.module('kidfriendly').config(Config);
  Config.$inject = ['$ionicConfigProvider', '$stateProvider', '$urlRouterProvider', '$httpProvider', 'multiselectProvider'];

  function Config($ionicConfigProvider, $stateProvider, $urlRouterProvider, $httpProvider, multiselectProvider, LocalityService, UserService, CategoryService) {
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
    multiselectProvider.setTemplateUrl('lib/ionic/multiselect/templates/item-template.html');
    multiselectProvider.setModalTemplateUrl('lib/ionic/multiselect/templates/modal-template.html');

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
      url: '/home/company/:object',
      views: {
        'home-view': {
          templateUrl: 'app/view/company/company.html',
          controller: 'CompanyController',
          controllerAs: 'vm'
        }
      }
    }).state('main.user-login', {
      url: '/user/login/:object',
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
          templateUrl: 'app/view/user/perfil.html',
          controller: 'PerfilController',
          controllerAs: 'vm',
          resolve: {
            StatesPrepService: function(LocalityService) {
              return LocalityService.listStateWithCityByCountry();
            },
            MinMaxDtBirthdayPrepService: function(UserService) {
              return UserService.getMinMaxDtBirthday();
            }
          }
        }
      }
    }).state('main.user-register', {
      url: '/user/register/:object',
      views: {
        'user-view': {
          templateUrl: 'app/view/user/register.html',
          controller: 'RegisterController',
          controllerAs: 'vm',
          resolve: {
            StatesPrepService: function(LocalityService) {
              return LocalityService.listStateWithCityByCountry();
            },
            MinMaxDtBirthdayPrepService: function(UserService) {
              return UserService.getMinMaxDtBirthday();
            }
          }
        }
      }
    }).state('main.search', {
      url: '/search',
      views: {
        'search-view': {
          templateUrl: 'app/view/search/search.html',
          controller: 'SearchController',
          controllerAs: 'vm',
          resolve: {
            StatesPrepService: function(LocalityService) {
              return LocalityService.listStateWithCityByCountry();
            },
            CategoryPrepService: function(CategoryService) {
              return CategoryService.listAll();
            }
          }
        }
      }
    }).state('main.indicate', {
      url: '/indicate',
      views: {
        'indicate-view': {
          templateUrl: 'app/view/indicate/indicate.html',
          controller: 'IndicateController',
          controllerAs: 'vm'
        }
      }
    }).state('main.contact', {
      url: '/contact',
      views: {
        'contact-view': {
          templateUrl: 'app/view/contact/contact.html',
          controller: 'ContactController',
          controllerAs: 'vm'
        }
      }
    }).state('main.contact-termsofuser', {
      url: '/contact/termsofuser',
      views: {
        'contact-view': {
          templateUrl: 'app/view/contact/termsofuse.html'
        }
      }
    });

    $urlRouterProvider.otherwise("/main/home");
  }
})();
