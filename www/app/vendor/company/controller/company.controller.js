(function() {
  'use strict';

  angular.module('kidfriendly').controller('CompanyController', CompanyController);
  CompanyController.$inject = ['CompanyService', 'ImageService', 'FoodTypeService', 'RatingService', 'LocalityService', '$controller', '$scope', '$ionicScrollDelegate', '$stateParams', '$timeout', '$ionicModal', '$cordovaInAppBrowser'];

  function CompanyController(CompanyService, ImageService, FoodTypeService, RatingService, LocalityService, $controller, $scope, $ionicScrollDelegate, $stateParams, $timeout, $ionicModal, $cordovaInAppBrowser) {
    var vm = this;
    angular.extend(this, $controller('AbstractController', {'vm': vm}));
    vm.companyDto = null;
    vm.message = {
      'images': '',
      'foodTypes': '',
      'ratings': ''
    };
    vm.images = [];
    vm.foodTypes = [];
    var ratingPaginatorDto = {
      currentPage: 0,
      pageSize: 5
    };
    vm.ratings = [];
    vm.isInfiniteScrollRating = false;
    vm.loadingRating = false;
    vm.phones = []
    vm.weeks = [];
    vm.characteristics = [];
    initialize();

    vm.openDetails = function() {
      $ionicModal.fromTemplateUrl('app/view/company/details-modal.html', {
        scope: $scope,
        backdropClickToClose: false,
        hardwareBackButtonClose:false
      }).then(function(modal) {
        var stopListening = $scope.$on('modal.hidden', function() {
          stopListening();
          vm.modalDetails.remove();
        });
        vm.modalDetails = modal;
        vm.modalDetails.show();
      });
    };

    vm.openSite = function(url) {
      $cordovaInAppBrowser.open(url, '_system');
      $cordovaInAppBrowser.close();
    };

    vm.closeDetails = function() {
      vm.modalDetails.hide();
    };

    vm.launchNavigator = function($event) {
      vm.showLoading();
      LocalityService.getGeolocation().then(function(response) {
        if (response.error) {
          LocalityService.ionicPopupAlertAttention(response.message);
        } else {
          var destination = '' + vm.companyDto.addressDto.numLatitude + ', ' + vm.companyDto.addressDto.numLongitude + '';
          var start = '' + response.data.latitude + ', ' + response.data.longitude + '';

          launchnavigator.navigate(destination, {
            'start': start,
            'appSelectionDialogHeader': 'Selecione o aplicativo para navegação.',
            'appSelectionCancelButton': 'Cancelar',
            'appSelectionList': [launchnavigator.APP.GOOGLE_MAPS, launchnavigator.APP.APPLE_MAPS, launchnavigator.APP.WAZE]
          });
        }

        vm.hideLoading();
      });
    };

    vm.moreRatings = function() {
      findRatings();
    };

    function findDetails() {
      vm.phones = []
      vm.weeks = [];
      vm.characteristics = [];
      CompanyService.details(vm.companyDto.idCompany).then(function(response) {
        if (response.error) {
          CompanyService.ionicPopupAlertError(response.message);
        } else {
          vm.phones = vm.phones.concat(response.data.phones);
          vm.weeks = vm.weeks.concat(response.data.weeks);
          vm.characteristics = vm.characteristics.concat(response.data.characteristics);
        }
      });
    }

    function findImages() {
      vm.message.images = '';
      vm.images = [];
      ImageService.listByCompany(vm.companyDto.idCompany).then(function(response) {
        if (response.error) {
          vm.message.images = response.message;
        } else {
          vm.images = vm.images.concat(response.data);

          if (vm.images.length === 0) {
            vm.message.images = 'Nenhuma imagem.';
          } else {
            $timeout(function() {
              new Swiper(angular.element(document.querySelector('.swiper-container-gallery')), {
                prevButton: '.swiper-button-prev-gallery',
                nextButton: '.swiper-button-next-gallery',
                spaceBetween: 30,
                effect: 'slide',
                loop: true
              });
            }, 500);
          }
        }
      });
    }

    function findFoodTypes() {
      vm.message.foodTypes = '';
      vm.foodTypes = [];
      FoodTypeService.listByCompany(vm.companyDto.idCompany).then(function(response) {
        if (!response.error) {
          vm.foodTypes = vm.foodTypes.concat(response.data);

          if (vm.foodTypes.length === 0) {
            vm.message.foodTypes = null;
          }
        } else {
          vm.message.foodTypes = response.message;
        }
      });
    }

    function findRatings() {
      vm.message.ratings = '';
      vm.isInfiniteScrollRating = false;
      vm.loadingRating = true;
      ratingPaginatorDto.currentPage = ratingPaginatorDto.currentPage + 1;
      RatingService.listByCompany(vm.companyDto.idCompany, ratingPaginatorDto).then(function(response) {
        if (response.error) {
          vm.message.ratings = response.message;
        } else {
          vm.ratings = vm.ratings.concat(response.data.results);
          ratingPaginatorDto = response.data.paginatorDto;
          vm.isInfiniteScrollRating = (angular.isDefined(ratingPaginatorDto) && ratingPaginatorDto.pagination);

          if (vm.ratings.length === 0) {
            vm.message.ratings = 'Nenhum comentário.';
          }
        }

        $timeout(function() {
          vm.loadingRating = false;
        }, 500);
      });
    };

    function initialize() {
      $scope.$on('$ionicView.beforeEnter', function() {
        $ionicScrollDelegate.scrollTop();
        vm.companyDto = angular.fromJson($stateParams.object);
        findDetails();
        findImages();
        findFoodTypes();
        findRatings();
      });
    }
}
})();
